import { NextRequest } from 'next/server';
import { standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/passwords';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password || String(password).length < 8) {
      return standardError('VALIDATION_ERROR', 'A valid token and password are required', 400);
    }
    await connectToDatabase();
    if (!isDbConnected()) return standardError('DB_UNAVAILABLE', 'Database is not connected', 503);

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) return standardError('INVALID_TOKEN', 'Reset link is invalid or expired', 400);

    user.passwordHash = hashPassword(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return standardResponse({ reset: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not reset password';
    return standardError('RESET_ERROR', message, 500);
  }
}
