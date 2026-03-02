import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { requireAuth, standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Occasion } from '@/models/Occasion';

function canWrite(userId: string) {
  return isDbConnected() && mongoose.Types.ObjectId.isValid(userId);
}

async function list(userId: string) {
  await connectToDatabase();
  if (!canWrite(userId)) return [];
  const count = await Occasion.countDocuments({ userId });
  if (count === 0) {
    await Occasion.create({
      userId,
      name: 'Gandhi Jayanti',
      date: '10-02',
      note: 'Write about service, simplicity, and building things that last.',
    });
  }
  const rows = await Occasion.find({ userId }).sort({ date: 1 }).lean();
  return rows.map((row) => ({
    id: row._id.toString(),
    name: row.name,
    date: row.date,
    note: row.note || '',
  }));
}

export async function GET() {
  try {
    const user = await requireAuth();
    return standardResponse({ occasions: await list(user.id) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load occasions';
    return standardError('OCCASIONS_FETCH_ERROR', message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    if (!canWrite(user.id)) return standardError('DB_UNAVAILABLE', 'Database is not connected', 503);
    const body = await req.json();
    if (!body.name || !body.date) return standardError('VALIDATION_ERROR', 'Name and date are required', 400);
    const saved = await Occasion.create({ userId: user.id, name: body.name, date: body.date, note: body.note || '' });
    return standardResponse({ occasion: { id: saved._id.toString(), name: saved.name, date: saved.date, note: saved.note } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create occasion';
    return standardError('OCCASION_CREATE_ERROR', message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    const body = await req.json();
    const saved = await Occasion.findOneAndUpdate(
      { _id: body.id, userId: user.id },
      { name: body.name, date: body.date, note: body.note || '' },
      { new: true }
    );
    if (!saved) return standardError('OCCASION_UPDATE_ERROR', 'Occasion was not found', 404);
    return standardResponse({ occasion: { id: saved._id.toString(), name: saved.name, date: saved.date, note: saved.note } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update occasion';
    return standardError('OCCASION_UPDATE_ERROR', message, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    const id = req.nextUrl.searchParams.get('id') || '';
    const result = await Occasion.deleteOne({ _id: id, userId: user.id });
    if (!result.deletedCount) return standardError('OCCASION_DELETE_ERROR', 'Occasion was not found', 404);
    return standardResponse({ deleted: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete occasion';
    return standardError('OCCASION_DELETE_ERROR', message, 500);
  }
}
