import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const body = await req.json();
    const { targetName, company, role, contextTopic, userTargetRole } = body;

    const result = await generateText(`Draft a short LinkedIn message from ${sessionUser.name || 'the sender'} to ${targetName || 'an engineering leader'} (${role || 'leader'} at ${company || 'their company'}).
Topic: ${contextTopic || 'shared technical interests'}.
Sender headline: ${userTargetRole || sessionUser.headline || 'not specified'}.
Maximum 140 words. Do not invent experience. Return only the message.`);

    return standardResponse({
      message: result.text.trim(),
      provider: result.provider,
      model: result.model,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate chat pitch';
    return standardError('CHAT_PITCH_ERROR', message, 502);
  }
}
