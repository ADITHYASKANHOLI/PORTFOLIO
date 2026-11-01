import crypto from 'node:crypto';

export const COOKIE_NAME = 'admin_session';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// In-memory rate limiting map for login attempts: ip -> { count, firstAttempt }
const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    return { allowed: true };
  }
  if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.delete(ip);
    return { allowed: true };
  }
  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.firstAttempt + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }
  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
  }
}

export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

export function isServerConfigured(): boolean {
  const key = process.env.ADMIN_KEY;
  return typeof key === 'string' && key.trim().length > 0;
}

export function verifyKey(submittedKey: string): boolean {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || typeof submittedKey !== 'string' || submittedKey.length === 0) {
    return false;
  }

  // SHA-256 both keys to guarantee fixed 32-byte buffers for constant-time comparison
  const hashSubmitted = crypto.createHash('sha256').update(submittedKey).digest();
  const hashConfigured = crypto.createHash('sha256').update(adminKey).digest();
  return crypto.timingSafeEqual(hashSubmitted, hashConfigured);
}

export function createSessionToken(): string {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    throw new Error('ADMIN_KEY is not configured on the server');
  }

  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', adminKey)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || !token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return false;
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', adminKey)
    .update(encodedPayload)
    .digest('base64url');

  const sigA = Buffer.from(signature, 'utf8');
  const sigB = Buffer.from(expectedSignature, 'utf8');

  if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.role !== 'admin') {
      return false;
    }
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getCookie(rawCookie: string | undefined, name: string): string | null {
  if (!rawCookie || typeof rawCookie !== 'string') return null;
  const cookies = rawCookie.split(';');
  for (const c of cookies) {
    const [k, v] = c.trim().split('=');
    if (k === name && v) return decodeURIComponent(v);
  }
  return null;
}

export function buildSetCookieHeader(token: string, isSecure = false): string {
  const flags = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
  ];
  if (isSecure) {
    flags.push('Secure');
  }
  return flags.join('; ');
}

export function buildClearCookieHeader(isSecure = false): string {
  const flags = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];
  if (isSecure) {
    flags.push('Secure');
  }
  return flags.join('; ');
}

