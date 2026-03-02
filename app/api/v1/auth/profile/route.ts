import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import {
  createSessionCookie,
  getSessionUser,
  standardError,
  standardResponse,
} from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Profile } from '@/models/Profile';
import { User } from '@/models/User';

export async function PATCH(req: Request) {
  const current = await getSessionUser();
  if (!current) {
    return standardError('UNAUTHORIZED', 'Sign in required', 401);
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : current.name;
  const headline = typeof body.headline === 'string' ? body.headline.trim() : current.headline || '';
  const bio = typeof body.bio === 'string' ? body.bio.trim() : current.bio || '';

  if (!name) {
    return standardError('VALIDATION_ERROR', 'Full name is required', 400);
  }

  const next = { ...current, name, headline, bio };
  await connectToDatabase();
  if (isDbConnected() && mongoose.Types.ObjectId.isValid(current.id)) {
    await User.updateOne({ _id: current.id }, { name });
    await Profile.findOneAndUpdate(
      { userId: current.id },
      { userId: current.id, headline, bio },
      { upsert: true }
    );
  }
  const cookieStore = await cookies();
  cookieStore.set('sf_session', createSessionCookie(next), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return standardResponse({ user: next });
}
