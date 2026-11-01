import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  isServerConfigured,
  verifyKey,
  createSessionToken,
  buildSetCookieHeader,
} from '../_lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Determine client IP for rate limiting
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  // Check rate limit
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds || 60));
    return res.status(429).json({
      error: `Too many failed attempts. Please wait ${rateLimit.retryAfterSeconds || 60} seconds before retrying.`,
    });
  }

  // Parse body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  const key = body?.key;
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    return res.status(400).json({ error: 'Admin Access Key is required' });
  }

  // Check server configuration
  if (!isServerConfigured()) {
    return res.status(500).json({
      error: 'Server configuration error: ADMIN_KEY is not configured in Vercel settings.',
    });
  }

  // Verify the submitted key using constant-time comparison
  const isValid = verifyKey(key.trim());

  if (!isValid) {
    recordFailedAttempt(ip);
    return res.status(401).json({ error: 'Incorrect Admin Access Key. Access denied.' });
  }

  // Successful verification: reset rate limiting for this IP
  resetRateLimit(ip);

  // Generate signed cryptographic session token
  const token = createSessionToken();

  // Check if HTTPS is used
  const isSecure =
    req.headers['x-forwarded-proto'] === 'https' ||
    process.env.NODE_ENV === 'production';

  const cookieHeader = buildSetCookieHeader(token, isSecure);
  res.setHeader('Set-Cookie', cookieHeader);

  return res.status(200).json({
    success: true,
    message: 'Authentication successful',
  });
}

