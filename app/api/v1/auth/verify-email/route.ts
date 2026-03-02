import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { standardError, standardResponse, createSessionCookie, getSessionUser } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return standardError('VALIDATION_ERROR', 'Token is required', 400);
    await connectToDatabase();
    if (!isDbConnected()) return standardError('DB_UNAVAILABLE', 'Database is not connected', 503);

    const user = await User.findOne({ emailVerifyToken: token });
    if (!user) return standardError('INVALID_TOKEN', 'Verification link is invalid', 400);
    user.emailVerified = true;
    user.emailVerifyToken = undefined;
    await user.save();

    const session = await getSessionUser();
    if (session && session.id === user._id.toString()) {
      const cookieStore = await cookies();
      cookieStore.set('sf_session', createSessionCookie({ ...session, emailVerified: true }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return standardResponse({ verified: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not verify email';
    return standardError('VERIFY_ERROR', message, 500);
  }
}
