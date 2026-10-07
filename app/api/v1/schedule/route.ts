import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { requireAuth, standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Content } from '@/models/Content';
import { Article } from '@/models/Article';

export async function GET() {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    if (!isDbConnected() || !mongoose.Types.ObjectId.isValid(user.id)) {
      return standardResponse({ items: [] });
    }
    const [posts, articles] = await Promise.all([
      Content.find({ userId: user.id }).sort({ scheduledDate: 1, createdAt: -1 }).lean(),
      Article.find({ userId: user.id }).sort({ scheduledDate: 1, createdAt: -1 }).lean(),
    ]);
    const items = [
      ...posts.map((item) => ({
        id: item._id.toString(),
        kind: item.type === 'ARTICLE' ? 'article' : 'post',
        title: item.title,
        status: item.status,
        scheduledDate: item.scheduledDate || '',
        source: 'content',
      })),
      ...articles.map((item) => ({
        id: item._id.toString(),
        kind: 'article',
        title: item.title,
        status: item.status,
        scheduledDate: item.scheduledDate || '',
        source: 'article',
      })),
    ];
    return standardResponse({ items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not load the calendar';
    return standardError('SCHEDULE_FETCH_ERROR', message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    await connectToDatabase();
    const body = await req.json();
    const date = String(body.scheduledDate || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return standardError('VALIDATION_ERROR', 'Choose a date as YYYY-MM-DD', 400);
    }
    const status = 'SCHEDULED';
    const updated = body.source === 'article'
      ? await Article.findOneAndUpdate({ _id: body.id, userId: user.id }, { scheduledDate: date, status }, { new: true })
      : await Content.findOneAndUpdate({ _id: body.id, userId: user.id }, { scheduledDate: date, status }, { new: true });
    if (!updated) return standardError('SCHEDULE_UPDATE_ERROR', 'Item was not found', 404);
    return standardResponse({ scheduledDate: date, status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not schedule this item';
    return standardError('SCHEDULE_UPDATE_ERROR', message, 500);
  }
}
