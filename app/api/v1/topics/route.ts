import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { TopicService } from '@/services/topic-service';

export async function GET() {
  try {
    const user = await requireAuth();
    const topics = await TopicService.getAll(user.id);
    return standardResponse({ topics });
  } catch (err: any) {
    return standardError('TOPICS_FETCH_ERROR', err.message || 'Failed to fetch topics', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const updated = await TopicService.update(body.id, body, user.id);
    if (!updated) return standardError('TOPIC_UPDATE_ERROR', 'Topic was not found', 404);
    return standardResponse({ topic: updated });
  } catch (err: any) {
    return standardError('TOPIC_UPDATE_ERROR', err.message || 'Failed to update topic', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const id = req.nextUrl.searchParams.get('id') || '';
    const ok = await TopicService.remove(id, user.id);
    if (!ok) return standardError('TOPIC_DELETE_ERROR', 'Topic was not found', 404);
    return standardResponse({ deleted: true });
  } catch (err: any) {
    return standardError('TOPIC_DELETE_ERROR', err.message || 'Failed to delete topic', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const created = await TopicService.create(body, user.id);
    return standardResponse({ topic: created }, { status: 201 });
  } catch (err: any) {
    return standardError('TOPIC_CREATE_ERROR', err.message || 'Failed to create topic', 500);
  }
}
