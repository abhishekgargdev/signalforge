import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { LoginSchema } from '@/validators/auth';
import { standardResponse, standardError, createSessionCookie, type AuthSessionUser } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { User } from '@/models/User';
import { Profile } from '@/models/Profile';
import { verifyPassword } from '@/lib/passwords';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return standardError('VALIDATION_ERROR', 'Invalid credentials format', 400, result.error.format());
    }

    await connectToDatabase();
    if (!isDbConnected()) {
      return standardError('DB_UNAVAILABLE', 'Database is not connected', 503);
    }

    const { email, password } = result.data;
    const found = await User.findOne({ email });
    if (!found || !verifyPassword(password, found.passwordHash)) {
      return standardError('AUTH_ERROR', 'Invalid email or password', 401);
    }

    const profile = await Profile.findOne({ userId: found._id });
    const user: AuthSessionUser = {
      id: found._id.toString(),
      name: found.name,
      username: found.username,
      email: found.email,
      role: found.role,
      emailVerified: found.emailVerified,
      headline: profile?.headline || '',
      bio: profile?.bio || '',
    };

    const cookieStore = await cookies();
    cookieStore.set('sf_session', createSessionCookie(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return standardResponse({ user, message: 'Authentication successful' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return standardError('AUTH_ERROR', message, 500);
  }
}
