import { buildClearCookieHeader } from '../_lib/auth';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const isSecure =
    req.headers['x-forwarded-proto'] === 'https' ||
    process.env.NODE_ENV === 'production';

  const clearCookie = buildClearCookieHeader(isSecure);
  res.setHeader('Set-Cookie', clearCookie);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}
