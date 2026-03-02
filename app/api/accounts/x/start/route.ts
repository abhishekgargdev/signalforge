import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login?next=/settings', req.url));
  }

  const clientId = process.env.X_CLIENT_ID;
  const redirectUri =
    process.env.X_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/accounts/x/callback`;
  if (!clientId || clientId.includes('your-x-client-id')) {
    return NextResponse.json({ success: false, error: { message: 'X OAuth is not configured' } }, { status: 500 });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');

  const url = new URL('https://twitter.com/i/oauth2/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'tweet.read users.read offline.access');
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  const response = NextResponse.redirect(url);
  response.cookies.set('sf_oauth_state', state, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 600 });
  response.cookies.set('sf_oauth_verifier', verifier, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 600 });
  return response;
}
