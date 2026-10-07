import { requireAuth, standardError, standardResponse } from '@/lib/auth';
import { generateDraftsForCurrentUser } from '@/services/daily-run';

export async function POST() {
  try {
    const user = await requireAuth();
    const result = await generateDraftsForCurrentUser(user.id, user.name);
    return standardResponse(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not generate drafts';
    return standardError('DRAFTS_ERROR', message, 500);
  }
}
