import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { KnowledgeService } from '@/services/knowledge-service';

export async function GET() {
  try {
    const user = await requireAuth();
    const projects = await KnowledgeService.listProjects(user.id);
    return standardResponse({ projects });
  } catch (err: any) {
    return standardError('PROJECTS_FETCH_ERROR', err.message || 'Failed to fetch projects', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const created = await KnowledgeService.createProject(body, user.id);
    return standardResponse({ project: created }, { status: 201 });
  } catch (err: any) {
    return standardError('PROJECT_CREATE_ERROR', err.message || 'Failed to create project', 500);
  }
}
