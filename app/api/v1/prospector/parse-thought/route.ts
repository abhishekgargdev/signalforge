import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { generateText } from '@/lib/ai/provider-chain';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const thought = body.thought?.trim();

    if (!thought) {
      return standardError('VALIDATION_ERROR', 'Natural language thought query is required', 400);
    }

    const result = await generateText(`Analyze this search request: "${thought}".
Return only JSON with keys companies, roles, technologies, seniorities, locations, searchRationale.
Use empty arrays when the request does not mention a field. Do not invent companies that were not named or clearly implied.`);

    const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return standardResponse({
      criteria: parsed,
      parsedFrom: thought,
      provider: result.provider,
      model: result.model,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to parse natural language thought';
    return standardError('PARSE_ERROR', message, 502);
  }
}
