import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  isServerConfigured,
  verifyKey,
  createSessionToken,
  buildSetCookieHeader,
  COOKIE_NAME,
  getCookie,
  verifySessionToken,
  buildClearCookieHeader,
} from '../../api/_lib/auth';

/**
 * Connect-compatible middleware for Vite dev and preview servers.
 * Ensures /api/admin/login, /api/admin/verify, and /api/admin/logout behave
 * identically to Vercel Serverless Functions during local testing.
 */
export function createAuthMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split('?')[0];

    if (!url?.startsWith('/api/admin/')) {
      return next();
    }

    const sendJson = (status: number, data: any, extraHeaders?: Record<string, string>) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      if (extraHeaders) {
        for (const [k, v] of Object.entries(extraHeaders)) {
          res.setHeader(k, v);
        }
      }
      res.end(JSON.stringify(data));
    };

    // 1. Verify Endpoint (GET or POST)
    if (url === '/api/admin/verify') {
      if (req.method !== 'GET' && req.method !== 'POST') {
        return sendJson(405, { error: 'Method Not Allowed' }, { Allow: 'GET, POST' });
      }

      if (!isServerConfigured()) {
        return sendJson(200, {
          authenticated: false,
          configured: false,
          error: 'ADMIN_KEY not configured on server',
        });
      }

      const rawCookie = req.headers['cookie'];
      const token = getCookie(rawCookie, COOKIE_NAME);

      if (!token) {
        return sendJson(200, { authenticated: false, configured: true });
      }

      const isValid = verifySessionToken(token);
      return sendJson(200, { authenticated: isValid, configured: true });
    }

    // 2. Logout Endpoint (POST)
    if (url === '/api/admin/logout') {
      if (req.method !== 'POST') {
        return sendJson(405, { error: 'Method Not Allowed' }, { Allow: 'POST' });
      }

      const isSecure = req.headers['x-forwarded-proto'] === 'https';
      const clearCookie = buildClearCookieHeader(isSecure);
      return sendJson(200, { success: true }, { 'Set-Cookie': clearCookie });
    }

    // 3. Login Endpoint (POST)
    if (url === '/api/admin/login') {
      if (req.method !== 'POST') {
        return sendJson(405, { error: 'Method Not Allowed' }, { Allow: 'POST' });
      }

      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        '127.0.0.1';

      const rateLimit = checkRateLimit(ip);
      if (!rateLimit.allowed) {
        return sendJson(
          429,
          {
            error: `Too many failed attempts. Please wait ${rateLimit.retryAfterSeconds || 60} seconds before retrying.`,
          },
          { 'Retry-After': String(rateLimit.retryAfterSeconds || 60) }
        );
      }

      // Read request body
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const rawBody = Buffer.concat(chunks).toString('utf8');

      let parsedBody: any = {};
      try {
        parsedBody = JSON.parse(rawBody || '{}');
      } catch {
        return sendJson(400, { error: 'Invalid JSON payload' });
      }

      const key = parsedBody?.key;
      if (!key || typeof key !== 'string' || key.trim().length === 0) {
        return sendJson(400, { error: 'Admin Access Key is required' });
      }

      if (!isServerConfigured()) {
        return sendJson(500, {
          error: 'Server configuration error: ADMIN_KEY is not configured in environment variables.',
        });
      }

      const isValid = verifyKey(key.trim());
      if (!isValid) {
        recordFailedAttempt(ip);
        return sendJson(401, { error: 'Incorrect Admin Access Key. Access denied.' });
      }

      resetRateLimit(ip);
      const token = createSessionToken();
      const isSecure = req.headers['x-forwarded-proto'] === 'https';
      const cookieHeader = buildSetCookieHeader(token, isSecure);

      return sendJson(200, { success: true, message: 'Authentication successful' }, { 'Set-Cookie': cookieHeader });
    }

    return next();
  };
}
