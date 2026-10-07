import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await requireAuth();
    const body = await req.json();
    const { targetName, company, role, contextTopic, userTargetRole } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are drafting a concise, respectful direct message (LinkedIn chat or InMail) from ${sessionUser.name || 'the sender'} to:
Target: ${targetName || 'an engineering leader'} (${role || 'leader'} at ${company || 'their company'})
Context: Recent interaction or topic: "${contextTopic || 'shared technical interests'}".
Sender's target role: ${userTargetRole || 'senior engineering role'}.

CONSTRAINTS:
1. Max 100-140 words.
2. Direct, humble, professional tone.
3. Reference specific technical alignment only when provided in context.
4. End with a clear, low-pressure call to action.
Return only the message text.`,
          config: {
            temperature: 0.6,
          },
        });

        return standardResponse({
          message: (response.text || '').trim(),
        });
      } catch (aiErr) {
        console.warn('Gemini chat pitch fallback:', aiErr);
      }
    }

    const fallbackPitch = `Hi ${targetName?.split(' ')[0] || 'there'}, thanks for connecting! I really enjoyed our discussion on ${contextTopic || 'low-latency systems'}.\n\nGiven your team's work scaling core infrastructure at ${company || 'your team'}, I wanted to reach out directly. I specialize in speculative decoding inference acceleration, eBPF Linux kernel tracing, and zero-downtime distributed storage.\n\nI have been following your group's engineering milestones closely and would love to explore Staff Systems opportunities on your team if you have 15 minutes for a brief chat sometime next week.`;

    return standardResponse({
      message: fallbackPitch,
    });
  } catch (err: any) {
    return standardError('CHAT_PITCH_ERROR', err.message || 'Failed to generate chat pitch', 500);
  }
}
