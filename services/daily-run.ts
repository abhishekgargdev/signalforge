import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { generateText } from '@/lib/ai/provider-chain';
import { User } from '@/models/User';
import { Topic } from '@/models/Topic';
import { Company } from '@/models/Company';
import { Experience } from '@/models/Experience';
import { Occasion } from '@/models/Occasion';
import { Content } from '@/models/Content';
import { ConnectionLead } from '@/models/ConnectionLead';
import { CommentDraft } from '@/models/CommentDraft';

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

async function draftText(prompt: string) {
  try {
    const result = await generateText(prompt, 'Write in the user\'s voice. Do not invent employers or metrics.');
    return result.text;
  } catch {
    return prompt;
  }
}

export async function runDailyForAllUsers() {
  await connectToDatabase();
  if (!isDbConnected()) return { ran: false, reason: 'Database is not connected', users: 0 };
  const users = await User.find({}).select('_id name').lean();
  const today = dayKey();
  const monthDay = today.slice(5);
  let drafts = 0;
  let leads = 0;
  let comments = 0;

  for (const user of users) {
    const userId = user._id;
    const [topics, companies, experiences, occasions] = await Promise.all([
      Topic.find({ userId }).lean(),
      Company.find({ userId }).lean(),
      Experience.find({ userId }).limit(3).lean(),
      Occasion.find({ userId }).lean(),
    ]);
    const occasion = occasions.find((item) => item.date === monthDay || item.date === today);
    const tag = `daily-${today}`;
    const existing = await Content.findOne({ userId, tags: tag });
    if (!existing) {
      const topic = topics[Number(today.slice(-2)) % Math.max(topics.length, 1)];
      const companyNames = companies.map((item) => item.name).join(', ') || 'the companies you listed';
      const experience = experiences.map((item) => item.title).join('; ');
      const prompt = occasion
        ? `Write a LinkedIn post for ${occasion.name} (${occasion.date}). Note: ${occasion.note}. Person: ${user.name}. Experience: ${experience}`
        : `Write a LinkedIn post about ${topic?.title || 'a technical lesson'}. Angle: ${topic?.summary || ''}. Mention why it matters to ${companyNames}. Experience: ${experience}`;
      const body = await draftText(prompt);
      await Content.create({
        userId,
        title: occasion ? occasion.name : topic?.title || `Daily draft ${today}`,
        type: 'LINKEDIN_POST',
        status: 'DRAFT',
        platform: 'LinkedIn',
        body,
        tags: [tag, occasion ? 'occasion' : 'topic'],
      });
      drafts += 1;
    }

    const leadCount = await ConnectionLead.countDocuments({ userId, dayKey: today });
    if (leadCount === 0 && companies.length > 0) {
      for (const company of companies.slice(0, 5)) {
        const note = await draftText(`Write a 2-sentence connection note from ${user.name} to an engineer at ${company.name}. Reason: ${company.description || 'shared technical work'}.`);
        await ConnectionLead.create({
          userId,
          name: `Engineer at ${company.name}`,
          role: 'Engineer',
          company: company.name,
          profileUrl: company.website || '',
          note,
          status: 'suggested',
          dayKey: today,
        });
        leads += 1;
      }
    }

    const commentCount = await CommentDraft.countDocuments({ userId, dayKey: today });
    if (commentCount === 0) {
      for (let index = 0; index < 5; index += 1) {
        const topic = topics.length ? topics[index % topics.length] : null;
        const subject = topic?.title || 'a technical lesson from your work';
        const comment = await draftText(`Write a short LinkedIn comment on a post about ${subject}. Person: ${user.name}. Do not pretend you read a specific post.`);
        await CommentDraft.create({
          userId,
          author: topic ? `Post about ${topic.title}` : `Suggested post ${index + 1}`,
          excerpt: topic?.summary || 'A post in one of your topics.',
          comment,
          status: 'prepared',
          dayKey: today,
        });
        comments += 1;
      }
    }
  }

  return { ran: true, users: users.length, drafts, leads, comments, day: today };
}
