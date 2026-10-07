import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@/validators/auth';
import { standardResponse, standardError, createSessionCookie, type AuthSessionUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return standardError('VALIDATION_ERROR', 'Invalid credentials format', 400, result.error.format());
    }

    const { email, password } = result.data;

    const localPart = email.split('@')[0] || 'user';
    const user: AuthSessionUser = {
      id: `usr_${Date.now()}`,
      name: localPart,
      username: localPart.replace(/\W/g, '').slice(0, 24) || 'user',
      email,
      role: 'USER',
      emailVerified: false,
    };

    const cookieVal = createSessionCookie(user);
    const cookieStore = await cookies();
    cookieStore.set('sf_session', cookieVal, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return standardResponse({ user, message: 'Authentication successful' });
  } catch (err: any) {
    return standardError('AUTH_ERROR', err.message || 'Login failed', 500);
  }
}
