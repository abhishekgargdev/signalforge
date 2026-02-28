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
