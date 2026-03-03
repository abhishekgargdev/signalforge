import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const { prospectName, company, role, techAlignment, userBio } = body;

    if (!prospectName || !company) {
      return standardError('VALIDATION_ERROR', 'prospectName and company are required', 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are drafting a high-converting, personalized LinkedIn connection note from Abhishek Garg (Staff Systems & AI Architect candidate) to:
Name: ${prospectName}
Company: ${company}
Role: ${role || 'Engineering Leader'}
Technical focus: ${(techAlignment || []).join(', ')}
User Background: Specializing in speculative decoding inference, eBPF kernel tracing, and tiered WAL replication.

CRITICAL CONSTRAINTS:
1. MUST BE STRICTLY UNDER 280 CHARACTERS (LinkedIn note limit is 300 characters).
2. Zero spam, zero flattery. Mention a specific mutual technical challenge.
3. Polite invitation to connect and follow their engineering insights.
Return ONLY the raw note text with no quotes, no explanations.`,
          config: {
            temperature: 0.6,
          },
        });

        const generatedNote = (response.text || '').trim();
        if (generatedNote.length <= 300) {
          return standardResponse({ note: generatedNote, charCount: generatedNote.length });
        }
      } catch (aiErr) {
        console.warn('Gemini note generator fallback:', aiErr);
      }
    }

    // High quality deterministic fallback note
    const fallbackNote = `Hi ${prospectName.split(' ')[0]}, followed your work at ${company} on ${(techAlignment && techAlignment[0]) || 'distributed systems'}. As an engineer working on speculative decoding & low-overhead eBPF tracing, I'd love to connect and follow your systems insights!`;
    return standardResponse({
      note: fallbackNote,
      charCount: fallbackNote.length,
    });
  } catch (err: any) {
    return standardError('NOTE_GEN_ERROR', err.message || 'Failed to generate connection note', 500);
  }
}
