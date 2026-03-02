import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const { prompt, type } = await req.json();
    if (!prompt || !String(prompt).trim()) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    let systemInstruction =
      'You are SignalForge. Provide precise technical writing. Do not invent the user\'s employment history.';
    if (type === 'comment') {
      systemInstruction =
        'Write a specific technical comment. Do not use generic praise. Do not invent personal experience.';
    } else if (type === 'article_outline') {
      systemInstruction = 'Outline a technical article with trade-offs and section headings.';
    }

    const result = await generateText(String(prompt), systemInstruction);
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
