import { GoogleGenAI } from '@google/genai';

export type GenerateResult = { text: string; provider: string; model: string };

function geminiKeys(): string[] {
  const numbered = [1, 2, 3, 4, 5, 6]
    .map((index) => process.env[`GEMINI_API_KEY_${index}`]?.trim())
    .filter((key): key is string => Boolean(key));
  const legacy = process.env.GEMINI_API_KEY?.trim();
  if (legacy && !numbered.includes(legacy)) numbered.push(legacy);
  return numbered;
}

async function openaiCompatible(options: {
  url: string;
  apiKey: string;
  model: string;
  provider: string;
  prompt: string;
  systemInstruction?: string;
}): Promise<GenerateResult> {
  const messages = [
    ...(options.systemInstruction
      ? [{ role: 'system', content: options.systemInstruction }]
      : []),
    { role: 'user', content: options.prompt },
  ];
  const response = await fetch(options.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model,
      messages,
      temperature: 0.7,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options.provider} ${response.status}: ${body.slice(0, 240)}`);
  }
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error(`${options.provider} returned an empty response`);
  return { text, provider: options.provider, model: options.model };
}

export async function generateText(prompt: string, systemInstruction?: string): Promise<GenerateResult> {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  let lastError: Error = new Error('No AI providers are configured');

  for (const apiKey of geminiKeys()) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      const text = response.text || '';
      if (!text) throw new Error('Gemini returned an empty response');
      return { text, provider: 'gemini', model };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();
  if (nvidiaKey) {
    try {
      return await openaiCompatible({
        url: 'https://integrate.api.nvidia.com/v1/chat/completions',
        apiKey: nvidiaKey,
        model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b',
        provider: 'nvidia',
        prompt,
        systemInstruction,
      });
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey) {
    try {
      return await openaiCompatible({
        url: 'https://api.groq.com/openai/v1/chat/completions',
        apiKey: groqKey,
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        provider: 'groq',
        prompt,
        systemInstruction,
      });
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError;
}

export async function generateImage(prompt: string): Promise<{ url?: string; provider: string; model: string; note?: string }> {
  const model = process.env.GEMINI_IMAGE_MODEL || 'imagen-3.0-generate-002';
  for (const apiKey of geminiKeys()) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateImages({
        model,
        prompt,
        config: { numberOfImages: 1 },
      });
      const image = response.generatedImages?.[0]?.image?.imageBytes;
      if (image) {
        return { provider: 'gemini', model, note: 'image-bytes', url: `data:image/png;base64,${image}` };
      }
    } catch {
      continue;
    }
  }

  const nvidiaKey = (process.env.NVIDIA_IMAGE_API_KEY || process.env.NVIDIA_API_KEY || '').trim();
  const nvidiaModel = process.env.NVIDIA_IMAGE_MODEL || 'qwen/qwen-image';
  if (nvidiaKey) {
    const response = await fetch('https://integrate.api.nvidia.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${nvidiaKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: nvidiaModel, prompt, n: 1 }),
    });
    if (!response.ok) {
      throw new Error(`Image generation failed (${response.status})`);
    }
    const data = await response.json();
    const url = data?.data?.[0]?.url || data?.data?.[0]?.b64_json;
    return { provider: 'nvidia', model: nvidiaModel, url };
  }

  throw new Error('No image provider is configured');
}
