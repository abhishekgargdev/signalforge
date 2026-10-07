import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';
import { prompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const body = await req.json();
    const { prospectName, company, role, techAlignment, userBio } = body;

    if (!prospectName || !company) {
      return standardError('VALIDATION_ERROR', 'prospectName and company are required', 400);
    }

    const result = await generateText(
      prompt('connection-note-detailed', {
        sender: sessionUser.name || 'the sender',
        prospect: prospectName,
        role: role || 'engineering leader',
        company,
        focus: (techAlignment || []).join(', ') || 'not specified',
        background: userBio || sessionUser.bio || 'Do not invent credentials.',
      }),
      prompt('system')
    );

    const note = result.text.trim().replace(/^"|"$/g, '');
    return standardResponse({
      note: note.slice(0, 300),
      charCount: Math.min(note.length, 300),
      provider: result.provider,
      model: result.model,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate connection note';
    return standardError('NOTE_GEN_ERROR', message, 502);
  }
}
