import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';
import { prompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const body = await req.json();
    const { authorName, company, authorRole, postText, customContext } = body;

    if (!postText || !postText.trim()) {
      return standardError('VALIDATION_ERROR', 'Post text is required', 400);
    }

    const senderName = sessionUser.name || 'the author';
    const task = prompt('comment-set', {
      sender: senderName,
      author: authorName || 'an engineering leader',
      role: authorRole || 'engineering lead',
      company: company || 'their company',
      postText,
      extra: customContext ? `Additional context: ${customContext}` : '',
    });

    const result = await generateText(task, prompt('system'));
    const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return standardResponse({
      authorName,
      company,
      postText,
      provider: result.provider,
      model: result.model,
      problemSummary: parsed.problemSummary,
      whyEngage: parsed.whyEngage,
      comments: parsed.comments,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate comments';
    return standardError('COMMENT_GEN_ERROR', message, 502);
  }
}
