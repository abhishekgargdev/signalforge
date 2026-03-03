import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const { targetName, company, role, contextTopic, userTargetRole } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are drafting a concise, respectful, high-impact direct message (LinkedIn Chat / InMail) from Abhishek Garg (Staff Systems & AI Architect candidate) to:
Target: ${targetName || 'Engineering Leader'} (${role || 'Leader'} at ${company || 'FAANG Company'})
Context: They recently interacted with our technical commentary regarding "${contextTopic || 'distributed infrastructure'}".
Objective: Express interest in Staff / Senior engineering opportunities on their team, linking to our technical essays.

CONSTRAINTS:
1. Max 100-140 words.
2. Direct, humble yet confident tone.
3. Mention specific systems alignment (e.g. speculative inference decoding, eBPF telemetry, tiered WAL Postgres).
4. Concrete CTA (e.g. "If you have 15 minutes next week, I'd welcome a brief chat").
Return only the text of the message.`,
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
