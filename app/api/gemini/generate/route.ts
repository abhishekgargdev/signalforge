import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';
import { prompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const userPrompt = body.prompt;
    const type = body.type;
    if (!userPrompt || !String(userPrompt).trim()) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    let systemInstruction = prompt('system');
    if (type === 'comment') systemInstruction = prompt('gemini-comment');
    else if (type === 'article_outline') systemInstruction = prompt('gemini-article');

    const result = await generateText(String(userPrompt), systemInstruction);
    return NextResponse.json({
      success: true,
      text: result.text,
      provider: result.provider,
      model: result.model,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate AI response';
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
