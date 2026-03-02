import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { User } from '@/models/User';
import { sendEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return standardError('VALIDATION_ERROR', 'Email is required', 400);
    await connectToDatabase();
    if (!isDbConnected()) return standardError('DB_UNAVAILABLE', 'Database is not connected', 503);

    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(24).toString('hex');
      user.passwordResetToken = token;
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      await sendEmail({
        to: email,
        subject: 'Reset your SignalForge password',
        title: 'Password reset',
        rows: [{ label: 'Account', value: email }],
        action: { href: `${origin}/reset-password?token=${token}`, label: 'Choose a new password' },
      });
    }

    return standardResponse({ sent: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not send reset email';
    return standardError('RESET_ERROR', message, 500);
  }
}
