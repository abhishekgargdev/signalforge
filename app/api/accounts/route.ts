import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Account } from '@/models/Account';
import { getSessionUser, standardError, standardResponse } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return standardError('UNAUTHORIZED', 'Sign in required', 401);
  await connectToDatabase();
  if (!isDbConnected()) return standardResponse({ accounts: [] });
  const rows = await Account.find({ userId: user.id }).select('provider displayName providerUserId').lean();
  return standardResponse({
    accounts: rows.map((row) => ({
      provider: row.provider,
      displayName: row.displayName,
      providerUserId: row.providerUserId,
    })),
  });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return standardError('UNAUTHORIZED', 'Sign in required', 401);
  const provider = new URL(req.url).searchParams.get('provider');
  if (provider !== 'linkedin' && provider !== 'x') {
    return standardError('VALIDATION_ERROR', 'Unknown provider', 400);
  }
  await connectToDatabase();
  if (isDbConnected()) {
    await Account.deleteOne({ userId: user.id, provider });
  }
  return standardResponse({ provider, connected: false });
}
