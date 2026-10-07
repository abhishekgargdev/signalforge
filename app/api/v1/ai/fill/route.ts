import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { requireAuth, standardError, standardResponse } from '@/lib/auth';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { AIService } from '@/services/ai-service';
import { Profile } from '@/models/Profile';
import { Experience } from '@/models/Experience';
import { Company } from '@/models/Company';
import { Topic } from '@/models/Topic';
import { prompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const idea = String(body.idea || '').trim();
    if (!idea) return standardError('VALIDATION_ERROR', 'Describe the idea first', 400);

    let context = `Signed-in person: ${user.name} (@${user.username}).`;
    await connectToDatabase();
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(user.id)) {
      const [profile, experiences, companies, topics] = await Promise.all([
        Profile.findOne({ userId: user.id }).lean(),
        Experience.find({ userId: user.id }).limit(5).lean(),
        Company.find({ userId: user.id }).limit(8).lean(),
        Topic.find({ userId: user.id }).limit(8).lean(),
      ]);
      if (profile) context += `\nHeadline: ${profile.headline || ''}\nBio: ${profile.bio || ''}`;
      if (experiences.length) {
        context += `\nExperience:\n${experiences.map((item) => `- ${item.title}: ${item.lesson}`).join('\n')}`;
      }
      if (companies.length) context += `\nCompanies: ${companies.map((item) => item.name).join(', ')}`;
      if (topics.length) context += `\nTopics: ${topics.map((item) => item.title).join(', ')}`;
    }

    const result = await AIService.generateTechnicalContent({
      prompt: [prompt('post'), prompt('article'), prompt('fill', { idea })].join('\n\n'),
      context,
    });
    return standardResponse({ text: result.text, provider: result.provider, model: result.model });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return standardError('AI_FILL_ERROR', message, 502);
  }
}
