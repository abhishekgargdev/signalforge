import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { generateText } from '@/lib/ai/provider-chain';
import { User } from '@/models/User';
import { Topic } from '@/models/Topic';
import { Company } from '@/models/Company';
import { Experience } from '@/models/Experience';
import { Occasion } from '@/models/Occasion';
import { Content } from '@/models/Content';
import { Article } from '@/models/Article';
import { Profile } from '@/models/Profile';
import { ConnectionLead } from '@/models/ConnectionLead';
import { CommentDraft } from '@/models/CommentDraft';

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

async function draftText(prompt: string, voice?: string) {
  const system = voice?.trim()
    ? voice
    : 'Write in the user\'s voice. Do not invent employers or metrics.';
  try {
    const result = await generateText(prompt, system);
    return result.text;
  } catch {
    return '';
  }
}

type DraftItem = { title: string; body: string; tag: string; kind: 'post' | 'article' };

function parseDrafts(text: string): DraftItem[] {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start < 0 || end <= start) return [];
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && item.title && item.body && item.tag)
      .map((item) => ({
        title: String(item.title).slice(0, 180),
        body: String(item.body),
        tag: String(item.tag).slice(0, 80),
        kind: item.kind === 'article' ? 'article' as const : 'post' as const,
      }));
  } catch {
    return [];
  }
}

async function askDrafts(instruction: string, voice?: string) {
  const text = await draftText(
    `${instruction}\n\nReturn only a JSON array. Each object has title, body, tag, and kind ("post" or "article").`,
    voice
  );
  return parseDrafts(text);
}

async function saveDraft(userId: unknown, item: DraftItem) {
  if (item.kind === 'article') {
    const existing = await Article.findOne({ userId, 'seo.keywords': item.tag });
    if (existing) return false;
    const slug = `${item.tag}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await Article.create({
      userId,
      title: item.title,
      slug: slug || `article-${Date.now()}`,
      subtitle: '',
      category: 'Draft',
      status: 'DRAFT',
      contentMarkdown: item.body,
      toc: [],
      seo: { metaTitle: item.title, metaDescription: item.body.slice(0, 140), keywords: [item.tag] },
    });
    return true;
  }
  const existing = await Content.findOne({ userId, tags: item.tag });
  if (existing) return false;
  await Content.create({
    userId,
    title: item.title,
    type: 'LINKEDIN_POST',
    status: 'DRAFT',
    platform: 'LinkedIn',
    body: item.body,
    tags: [item.tag],
  });
  return true;
}

async function generateDraftsForUser(userId: unknown, name: string, today: string) {
  const [topics, companies, experiences, occasions, profile] = await Promise.all([
    Topic.find({ userId }).lean(),
    Company.find({ userId }).lean(),
    Experience.find({ userId }).limit(4).lean(),
    Occasion.find({ userId }).lean(),
    Profile.findOne({ userId }).lean(),
  ]);
  const voice = profile?.generationPrompt || '';
  const background = `Person: ${name}. Experience: ${experiences.map((item) => item.title).join('; ') || 'not listed'}.`;
  let created = 0;

  const missingOccasions = [];
  for (const occasion of occasions) {
    const tag = `occasion:${occasion._id}`;
    const exists = await Content.findOne({ userId, tags: tag });
    if (!exists) missingOccasions.push({ ...occasion, tag });
  }
  if (missingOccasions.length) {
    const drafts = await askDrafts(
      `${background}\nWrite one LinkedIn post for each occasion:\n${missingOccasions.map((item) => `- tag ${item.tag}; ${item.name} on ${item.date}; ${item.note}`).join('\n')}`,
      voice
    );
    for (const draft of drafts) created += (await saveDraft(userId, { ...draft, kind: 'post' })) ? 1 : 0;
  }

  const companyLines = [];
  for (const company of companies) {
    const postTag = `company-post:${company._id}`;
    const articleTag = `company-article:${company._id}`;
    if (!(await Content.findOne({ userId, tags: postTag }))) companyLines.push(`post tag ${postTag} for ${company.name}: ${company.description || ''}`);
    if (!(await Article.findOne({ userId, 'seo.keywords': articleTag }))) companyLines.push(`article tag ${articleTag} for ${company.name}`);
  }
  if (companyLines.length) {
    const drafts = await askDrafts(`${background}\nWrite these company pieces so the company would notice this person:\n${companyLines.join('\n')}`, voice);
    for (const draft of drafts) created += (await saveDraft(userId, draft)) ? 1 : 0;
  }

  const topicPool = [...topics];
  for (let index = topicPool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [topicPool[index], topicPool[swap]] = [topicPool[swap], topicPool[index]];
  }
  const topicCount = topicPool.length <= 2 ? topicPool.length : 2 + Math.floor(Math.random() * 2);
  const topicLines = [];
  for (const topic of topicPool.slice(0, topicCount)) {
    const postTag = `topic-post:${today}:${topic._id}`;
    const articleTag = `topic-article:${today}:${topic._id}`;
    if (!(await Content.findOne({ userId, tags: postTag }))) topicLines.push(`post tag ${postTag} about ${topic.title}: ${topic.summary || ''}`);
    if (!(await Article.findOne({ userId, 'seo.keywords': articleTag }))) topicLines.push(`article tag ${articleTag} about ${topic.title}`);
  }
  if (topicLines.length) {
    const drafts = await askDrafts(`${background}\nWrite these topic pieces:\n${topicLines.join('\n')}`, voice);
    for (const draft of drafts) created += (await saveDraft(userId, draft)) ? 1 : 0;
  }

  const newsTag = `news:${today}`;
  if (!(await Content.findOne({ userId, tags: new RegExp(`^${newsTag}:`) }))) {
    const drafts = await askDrafts(
      `${background}\nWrite 7 LinkedIn posts about notable technology news or achievements from around ${today}. Tags must be ${newsTag}:1 through ${newsTag}:7. kind is post.`,
      voice
    );
    for (const draft of drafts.slice(0, 10)) created += (await saveDraft(userId, { ...draft, kind: 'post' })) ? 1 : 0;
  }

  const achievementTag = `achievement:${today}`;
  if (!(await Content.findOne({ userId, tags: achievementTag }))) {
    const drafts = await askDrafts(
      `${background}\nWrite one LinkedIn post about one major world achievement relevant to an engineer. tag ${achievementTag}. kind post.`,
      voice
    );
    for (const draft of drafts.slice(0, 1)) created += (await saveDraft(userId, { ...draft, kind: 'post', tag: achievementTag })) ? 1 : 0;
  }

  return created;
}

async function publishScheduled(userId: unknown, today: string) {
  const posts = await Content.updateMany({ userId, status: 'SCHEDULED', scheduledDate: today }, { status: 'PUBLISHED' });
  const articles = await Article.updateMany({ userId, status: 'SCHEDULED', scheduledDate: today }, { status: 'PUBLISHED' });
  return (posts.modifiedCount || 0) + (articles.modifiedCount || 0);
}

export async function runDailyForAllUsers() {
  await connectToDatabase();
  if (!isDbConnected()) return { ran: false, reason: 'Database is not connected', users: 0 };
  const users = await User.find({}).select('_id name').lean();
  const today = dayKey();
  let drafts = 0;
  let published = 0;
  let leads = 0;
  let comments = 0;

  for (const user of users) {
    const userId = user._id;
    published += await publishScheduled(userId, today);
    drafts += await generateDraftsForUser(userId, user.name, today);
    const [topics, companies] = await Promise.all([
      Topic.find({ userId }).lean(),
      Company.find({ userId }).lean(),
    ]);

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

  return { ran: true, users: users.length, drafts, published, leads, comments, day: today };
}

export async function generateDraftsForCurrentUser(userId: string, name: string) {
  await connectToDatabase();
  if (!isDbConnected()) return { created: 0, reason: 'Database is not connected' };
  const created = await generateDraftsForUser(userId, name, dayKey());
  return { created };
}
