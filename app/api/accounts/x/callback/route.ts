import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Account } from '@/models/Account';
import { getSessionUser } from '@/lib/auth';
import { encryptSecret } from '@/lib/token-crypto';

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const cookieStore = await cookies();
  const user = await getSessionUser();
  const settings = new URL('/settings', process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin);
  const expected = cookieStore.get('sf_oauth_state')?.value;
  const verifier = cookieStore.get('sf_oauth_verifier')?.value;

  if (!user || !code || !state || state !== expected || !verifier) {
    settings.searchParams.set('account', 'x-error');
    return NextResponse.redirect(settings);
  }

  const redirectUri =
    process.env.X_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin}/api/accounts/x/callback`;
  const clientId = process.env.X_CLIENT_ID || '';
  const clientSecret = process.env.X_CLIENT_SECRET || '';
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
    client_id: clientId,
  });

  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body,
  });
  if (!tokenRes.ok) {
    settings.searchParams.set('account', 'x-error');
    return NextResponse.redirect(settings);
  }
  const token = await tokenRes.json();

  const meRes = await fetch('https://api.twitter.com/2/users/me', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const me = meRes.ok ? await meRes.json() : { data: {} };

  await connectToDatabase();
  if (isDbConnected()) {
    await Account.findOneAndUpdate(
      { userId: user.id, provider: 'x' },
      {
        userId: user.id,
        provider: 'x',
        providerUserId: me.data?.id || 'x-user',
        displayName: me.data?.username || user.name,
        accessToken: encryptSecret(token.access_token),
        refreshToken: token.refresh_token ? encryptSecret(token.refresh_token) : undefined,
        expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined,
      },
      { upsert: true }
    );
  }

  cookieStore.delete('sf_oauth_state');
  cookieStore.delete('sf_oauth_verifier');
  settings.searchParams.set('account', 'x-connected');
  return NextResponse.redirect(settings);
}
