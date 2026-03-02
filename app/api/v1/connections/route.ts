import { NextRequest } from 'next/server';
import { requireAuth, standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db/mongoose';
import { ConnectionLead } from '@/models/ConnectionLead';
import { Account } from '@/models/Account';

function mapLead(row: { _id: { toString(): string }; name: string; role: string; company: string; profileUrl: string; note: string; status: string; dayKey: string }) {
  return {
    id: row._id.toString(),
    name: row.name,
    role: row.role,
    company: row.company,
    profileUrl: row.profileUrl,
    note: row.note,
    status: row.status,
    dayKey: row.dayKey,
  };
}

export async function GET() {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    const rows = await ConnectionLead.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
    return standardResponse({ connections: rows.map(mapLead) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load connections';
    return standardError('CONNECTIONS_FETCH_ERROR', message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    const body = await req.json();
    const account = await Account.findOne({ userId: user.id, provider: 'linkedin' });
    const saved = await ConnectionLead.findOneAndUpdate(
      { _id: body.id, userId: user.id },
      { note: body.note, status: body.status },
      { new: true }
    );
    if (!saved) return standardError('CONNECTION_UPDATE_ERROR', 'Connection was not found', 404);
    return standardResponse({
      connection: mapLead(saved),
      linkedinInviteSent: false,
      message: account
        ? 'LinkedIn is connected for profile access only, so the invite was marked ready instead of sent.'
        : 'Connect LinkedIn in Settings. This invite is marked ready in SignalForge.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update connection';
    return standardError('CONNECTION_UPDATE_ERROR', message, 500);
  }
}
