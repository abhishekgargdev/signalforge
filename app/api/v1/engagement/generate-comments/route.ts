import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const body = await req.json();
    const { authorName, company, authorRole, postText, customContext } = body;

    if (!postText || !postText.trim()) {
      return standardError('VALIDATION_ERROR', 'Post text is required', 400);
    }

    const senderName = sessionUser.name || 'the author';
    const prompt = `You are helping ${senderName} write comments on a post by ${authorName || 'an engineering leader'} (${authorRole || 'engineering lead'} at ${company || 'their company'}).

Original post:
"${postText}"

${customContext ? `Additional context: ${customContext}` : ''}

Do not invent employers, metrics, or personal war stories that were not supplied.
Generate exactly 4 comments. Respond with ONLY valid JSON:
{
  "problemSummary": "1 sentence",
  "whyEngage": "1 sentence",
  "comments": [
    { "angle": "Technical insight", "commentText": "", "originalityScore": 0 },
    { "angle": "Personal perspective", "commentText": "", "originalityScore": 0 },
    { "angle": "Constructive question", "commentText": "", "originalityScore": 0 },
    { "angle": "Alternative perspective", "commentText": "", "originalityScore": 0 }
  ]
}`;

    const result = await generateText(prompt);
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
