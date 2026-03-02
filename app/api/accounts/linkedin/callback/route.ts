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
  const expected = cookieStore.get('sf_oauth_state')?.value;
  const user = await getSessionUser();
  const settings = new URL('/settings', process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin);

  if (!user || !code || !state || state !== expected) {
    settings.searchParams.set('account', 'linkedin-error');
    return NextResponse.redirect(settings);
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI || '',
    client_id: process.env.LINKEDIN_CLIENT_ID || '',
    client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
  });

  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!tokenRes.ok) {
    settings.searchParams.set('account', 'linkedin-error');
    return NextResponse.redirect(settings);
  }
  const token = await tokenRes.json();

  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const profile = profileRes.ok ? await profileRes.json() : {};

  await connectToDatabase();
  if (isDbConnected()) {
    await Account.findOneAndUpdate(
      { userId: user.id, provider: 'linkedin' },
      {
        userId: user.id,
        provider: 'linkedin',
        providerUserId: profile.sub || 'linkedin-user',
        displayName: profile.name || user.name,
        accessToken: encryptSecret(token.access_token),
        refreshToken: token.refresh_token ? encryptSecret(token.refresh_token) : undefined,
        expiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined,
      },
      { upsert: true }
    );
  }

  cookieStore.delete('sf_oauth_state');
  settings.searchParams.set('account', 'linkedin-connected');
  return NextResponse.redirect(settings);
}
