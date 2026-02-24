import { z } from 'zod';

export const ContentCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.enum(['LINKEDIN_POST', 'ARTICLE', 'SHORT_POST', 'CAROUSEL', 'NEWSLETTER']),
  status: z.enum(['IDEA', 'DRAFT', 'REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  platform: z.enum(['LinkedIn', 'X', 'Web', 'All']).default('LinkedIn'),
  body: z.string().min(5, 'Content body must be at least 5 characters'),
  tags: z.array(z.string()).default([]),
  scheduledDate: z.string().optional(),
  coverImage: z.string().optional(),
});

export const ContentGenerateSchema = z.object({
  sourceType: z.string(),
  sourceId: z.string().optional(),
  topic: z.string(),
  angle: z.string().optional(),
  researchNotes: z.string().optional(),
  platform: z.enum(['LinkedIn', 'X', 'Web']).default('LinkedIn'),
  tone: z.string().default('Technical, zero-slop, authoritative'),
});

export const ArticleCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe'),
  subtitle: z.string().default(''),
  category: z.string().min(2),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  contentMarkdown: z.string().min(20, 'Article markdown must be at least 20 characters'),
  readTime: z.string().default('5 min read'),
  coverImage: z.string().optional(),
  seo: z.object({
    metaTitle: z.string().default(''),
    metaDescription: z.string().default(''),
    canonicalUrl: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
  }).optional(),
});

export const CompanyCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().min(2),
  priority: z.enum(['Tier 1', 'Tier 2', 'Tier 3']).default('Tier 1'),
  technologies: z.array(z.string()).default([]),
  description: z.string().default(''),
  headquarters: z.string().optional(),
  notes: z.string().optional(),
});

export const CommentGenerateSchema = z.object({
  postContent: z.string().min(10, 'Post content must be at least 10 characters'),
  authorRole: z.string().optional(),
  company: z.string().optional(),
  technicalAngle: z.string().optional(),
});

export const ExperienceCreateSchema = z.object({
  title: z.string().min(5),
  project: z.string().min(2),
  problem: z.string().min(10),
  challenge: z.string().min(10),
  solution: z.string().min(10),
  technologies: z.array(z.string()).default([]),
  result: z.string().min(10),
  lesson: z.string().min(10),
  tags: z.array(z.string()).default([]),
});

export const ProjectCreateSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  problem: z.string().min(10),
  architecture: z.string().min(10),
  technologies: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  lessons: z.string().default(''),
});
