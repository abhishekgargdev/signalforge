import { NextRequest } from 'next/server';
import { SignupSchema } from '@/validators/auth';
import { standardResponse, standardError, createSessionCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = SignupSchema.safeParse(body);

    if (!result.success) {
      return standardError('VALIDATION_ERROR', 'Validation failed', 400, result.error.format());
    }

    const { name, username, email } = result.data;

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      username,
      email,
      role: 'USER' as const,
      emailVerified: false,
    };

    const cookieVal = createSessionCookie(newUser);
    const cookieStore = await cookies();
    cookieStore.set('sf_session', cookieVal, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return standardResponse({ user: newUser, message: 'Account registered successfully' }, { status: 201 });
  } catch (err: any) {
    return standardError('REGISTRATION_ERROR', err.message || 'Registration failed', 500);
  }
}
