import { generateText, type GenerateResult } from '@/lib/ai/provider-chain';

export class AIService {
  static async generateTechnicalContent(params: {
    prompt: string;
    type?: string;
    context?: string;
  }): Promise<GenerateResult> {
    const prompt = `${params.context ? `Context: ${params.context}\n\n` : ''}${params.prompt}`;
    return generateText(
      prompt,
      'You are SignalForge, a technology intelligence assistant for software engineers. Write precise technical content. Do not invent the user\'s employers, metrics, or credentials.'
    );
  }
}
