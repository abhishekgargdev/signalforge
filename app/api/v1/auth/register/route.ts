import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SignupSchema } from '@/validators/auth';
import { standardResponse, standardError, createSessionCookie } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/passwords';
import { sendEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = SignupSchema.safeParse(body);
    if (!result.success) {
      return standardError('VALIDATION_ERROR', 'Validation failed', 400, result.error.format());
    }

    const { name, username, email, password } = result.data;
    await connectToDatabase();
    if (!isDbConnected()) {
      return standardError('DB_UNAVAILABLE', 'Database is not connected', 503);
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return standardError('ACCOUNT_EXISTS', 'An account with that email or username already exists', 409);
    }

    const verifyToken = crypto.randomBytes(24).toString('hex');
    const created = await User.create({
      name,
      username,
      email,
      passwordHash: hashPassword(password),
      emailVerified: false,
      emailVerifyToken: verifyToken,
    });

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your SignalForge email',
        template: 'verify-email',
        data: {
          title: 'Confirm your email',
          name,
          username,
          verifyUrl: `${origin}/verify-email?token=${verifyToken}`,
        },
      });
    } catch (mailErr) {
      console.warn('Verification email was not sent', mailErr);
    }

    const sessionUser = {
      id: created._id.toString(),
      name,
      username,
      email,
      role: 'USER' as const,
      emailVerified: false,
    };
    const cookieStore = await cookies();
    cookieStore.set('sf_session', createSessionCookie(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return standardResponse({ user: sessionUser, message: 'Account registered successfully' }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return standardError('REGISTRATION_ERROR', message, 500);
  }
}
