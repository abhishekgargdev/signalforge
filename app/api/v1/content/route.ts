import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { ContentService } from '@/services/content-service';

export async function GET() {
  try {
    const user = await requireAuth();
    const items = await ContentService.getAll(user.id);
    return standardResponse({ content: items });
  } catch (err: any) {
    return standardError('CONTENT_FETCH_ERROR', err.message || 'Failed to fetch content pipeline', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const created = await ContentService.create(body, user.id);
    return standardResponse({ item: created }, { status: 201 });
  } catch (err: any) {
    return standardError('CONTENT_CREATE_ERROR', err.message || 'Failed to create content item', 500);
  }
}
