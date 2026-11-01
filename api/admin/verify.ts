import {
  isServerConfigured,
  COOKIE_NAME,
  getCookie,
  verifySessionToken,
} from '../_lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // If server is not configured with ADMIN_KEY, sessions cannot be verified
  if (!isServerConfigured()) {
    return res.status(200).json({
      authenticated: false,
      configured: false,
      error: 'ADMIN_KEY not configured on server',
    });
  }

  const rawCookie = req.headers['cookie'];
  const sessionToken = getCookie(rawCookie, COOKIE_NAME);

  if (!sessionToken) {
    return res.status(200).json({
      authenticated: false,
      configured: true,
    });
  }

  const isValid = verifySessionToken(sessionToken);

  return res.status(200).json({
    authenticated: isValid,
    configured: true,
  });
}

