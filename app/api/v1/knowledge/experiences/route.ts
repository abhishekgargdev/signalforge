import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { KnowledgeService } from '@/services/knowledge-service';

export async function GET() {
  try {
    const user = await requireAuth();
    const experiences = await KnowledgeService.listExperiences(user.id);
    return standardResponse({ experiences });
  } catch (err: any) {
    return standardError('EXPERIENCES_FETCH_ERROR', err.message || 'Failed to fetch experiences', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const created = await KnowledgeService.createExperience(body, user.id);
    return standardResponse({ experience: created }, { status: 201 });
  } catch (err: any) {
    return standardError('EXPERIENCE_CREATE_ERROR', err.message || 'Failed to create experience', 500);
  }
}
