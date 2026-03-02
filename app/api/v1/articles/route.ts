import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { ArticleService } from '@/services/article-service';

export async function GET() {
  try {
    const articles = await ArticleService.getAll();
    return standardResponse({ articles });
  } catch (err: any) {
    return standardError('ARTICLES_FETCH_ERROR', err.message || 'Failed to fetch articles', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    if (!body.id) return standardError('ARTICLE_UPDATE_ERROR', 'Article id is required', 400);
    const updated = await ArticleService.update(body.id, body, user.id);
    return standardResponse({ article: updated });
  } catch (err: any) {
    return standardError('ARTICLE_UPDATE_ERROR', err.message || 'Failed to update article', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const created = await ArticleService.create(body, user.id);
    return standardResponse({ article: created }, { status: 201 });
  } catch (err: any) {
    return standardError('ARTICLE_CREATE_ERROR', err.message || 'Failed to create article', 500);
  }
}
