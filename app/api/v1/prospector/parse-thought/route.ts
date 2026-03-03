import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const thought = body.thought?.trim();

    if (!thought) {
      return standardError('VALIDATION_ERROR', 'Natural language thought query is required', 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an expert LinkedIn recruiting and engineering search architect. Analyze this user query: "${thought}".
Extract search filters into clean JSON with these exact keys:
{
  "companies": ["array of company names"],
  "roles": ["array of target job titles"],
  "technologies": ["array of key tech stacks or topics"],
  "seniorities": ["array like Staff, Principal, Engineering Manager, Director, Tech Lead"],
  "locations": ["array of target locations"],
  "searchRationale": "1 sentence explanation of why this target group aligns with the user's intent"
}
Return only valid JSON without markdown fences.`,
          config: {
            temperature: 0.2,
          },
        });

        const rawText = response.text || '';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return standardResponse({
          criteria: parsed,
          parsedFrom: thought,
        });
      } catch (aiErr) {
        console.warn('Gemini filter parse fallback:', aiErr);
      }
    }

    // Heuristic Fallback parser
    const lower = thought.toLowerCase();
    const companies: string[] = [];
    if (lower.includes('google')) companies.push('Google');
    if (lower.includes('meta') || lower.includes('facebook')) companies.push('Meta');
    if (lower.includes('apple')) companies.push('Apple');
    if (lower.includes('netflix')) companies.push('Netflix');
    if (lower.includes('amazon') || lower.includes('aws')) companies.push('Amazon');
    if (lower.includes('anthropic')) companies.push('Anthropic');
    if (lower.includes('openai')) companies.push('OpenAI');
    if (lower.includes('stripe')) companies.push('Stripe');
    if (lower.includes('faang') && companies.length === 0) {
      companies.push('Google', 'Meta', 'Netflix', 'Apple', 'Amazon');
    }

    const roles: string[] = [];
    if (lower.includes('staff')) roles.push('Staff Software Engineer');
    if (lower.includes('principal')) roles.push('Principal Architect');
    if (lower.includes('manager') || lower.includes('em')) roles.push('Engineering Manager');
    if (lower.includes('director')) roles.push('Director of Engineering');
    if (roles.length === 0) roles.push('Staff Systems Engineer', 'Tech Lead');

    const technologies: string[] = [];
    if (lower.includes('inference') || lower.includes('llm')) technologies.push('LLM Inference', 'Speculative Decoding');
    if (lower.includes('distributed')) technologies.push('Distributed Systems', 'Raft Consensus');
    if (lower.includes('kernel') || lower.includes('ebpf')) technologies.push('eBPF', 'Linux Kernel');
    if (lower.includes('pytorch') || lower.includes('gpu')) technologies.push('PyTorch', 'CUDA / GPU Kernels');
    if (technologies.length === 0) technologies.push('High Concurrency', 'Distributed Infrastructure');

    return standardResponse({
      criteria: {
        companies: companies.length ? companies : ['Google', 'Meta', 'Anthropic', 'Stripe'],
        roles,
        technologies,
        seniorities: ['Staff', 'Principal', 'Engineering Manager'],
        locations: ['San Francisco Bay Area', 'Seattle', 'New York', 'Remote'],
        searchRationale: `Extracted targeting parameters for senior engineering leadership in ${technologies.join(', ')}.`,
      },
      parsedFrom: thought,
    });
  } catch (err: any) {
    return standardError('PARSE_ERROR', err.message || 'Failed to parse natural language thought', 500);
  }
}
