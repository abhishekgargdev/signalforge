import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const body = await req.json();
    const { prospectName, company, role, techAlignment, userBio } = body;

    if (!prospectName || !company) {
      return standardError('VALIDATION_ERROR', 'prospectName and company are required', 400);
    }

    const result = await generateText(`Draft a LinkedIn connection note from ${sessionUser.name || 'the sender'} to ${prospectName} (${role || 'engineering leader'} at ${company}).
Technical focus: ${(techAlignment || []).join(', ') || 'not specified'}.
Sender background: ${userBio || sessionUser.bio || 'Do not invent credentials.'}
Under 280 characters. No flattery. Return only the note.`);

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
