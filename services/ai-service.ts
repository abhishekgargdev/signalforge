import { generateText, type GenerateResult } from '@/lib/ai/provider-chain';
import { prompt } from '@/lib/prompts';

export class AIService {
  static async generateTechnicalContent(params: {
    prompt: string;
    type?: string;
    context?: string;
  }): Promise<GenerateResult> {
    const task = `${params.context ? `Context: ${params.context}\n\n` : ''}${params.prompt}`;
    return generateText(task, prompt('system'));
  }
}
