import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';
import { prompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const body = await req.json();
    const { targetName, company, role, contextTopic, userTargetRole } = body;

    const result = await generateText(
      prompt('chat-pitch', {
        sender: sessionUser.name || 'the sender',
        target: targetName || 'an engineering leader',
        role: role || 'leader',
        company: company || 'their company',
        topic: contextTopic || 'shared technical interests',
        headline: userTargetRole || sessionUser.headline || 'not specified',
      }),
      prompt('system')
    );

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
