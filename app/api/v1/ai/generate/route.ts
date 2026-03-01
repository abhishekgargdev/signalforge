import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { AIService } from '@/services/ai-service';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    if (!body.prompt) {
      return standardError('VALIDATION_ERROR', 'Prompt is required', 400);
    }

    const text = await AIService.generateTechnicalContent({
      prompt: body.prompt,
      type: body.type,
      context: body.context,
    });

    return standardResponse({
      text,
      model: 'gemini-2.5-flash',
      userId: user.id,
    });
  } catch (err: any) {
    return standardError('AI_GENERATION_ERROR', err.message || 'Generation failed', 500);
  }
}
