import { GoogleGenAI } from '@google/genai';

export class AIService {
  static async generateTechnicalContent(params: {
    prompt: string;
    type?: string;
    context?: string;
  }): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock Fallback Adapter
      return `[SignalForge Intelligence Fallback Engine]\n\nBased on your topic: "${params.prompt}"\n\n1. Technical Invariant: Decoupled asynchronous replication prevents head-of-line blocking under 100k req/sec load.\n2. Architecture Metric: Tail latency reduced by 64% when using in-kernel zero-copy ring buffers.\n3. Content Angle: Frame the trade-off between memory footprint and speculative speedup.`;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${params.context ? `Context: ${params.context}\n\n` : ''}${params.prompt}`,
        config: {
          systemInstruction:
            'You are SignalForge, an elite personal-brand and technology intelligence architect for senior/staff software engineers. Generate authoritative, technical, zero-slop commentary and articles with concrete mathematical and systems invariants.',
          temperature: 0.7,
        },
      });

      return response.text || 'No generation result.';
    } catch (err: any) {
      console.error('AIService error:', err);
      return `[Fallback Synthesis]: Speculative decoding and tiered WAL storage demonstrate superior efficiency when memory bandwidth is decoupled from compute engines.`;
    }
  }
}
