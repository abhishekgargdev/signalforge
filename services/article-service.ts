import mongoose from 'mongoose';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Article } from '@/models/Article';
import { INITIAL_ARTICLES, ArticleItem } from '@/lib/signalforge-data';

let inMemoryArticles: ArticleItem[] = [...INITIAL_ARTICLES];

export class ArticleService {
  static async getAll(): Promise<ArticleItem[]> {
    await connectToDatabase();
    if (isDbConnected()) {
      try {
        const found = await Article.find({}).sort({ createdAt: -1 }).lean();
        if (found.length > 0) {
          return found.map((a: any) => ({
            id: a._id.toString(),
            slug: a.slug,
            title: a.title,
            subtitle: a.subtitle,
            category: a.category,
            status: a.status.toLowerCase(),
            publishedDate: a.publishedDate || 'Sept 2026',
            readTime: a.readTime,
            views: a.views,
            coverImage: a.coverImage || '',
            contentMarkdown: a.contentMarkdown,
            toc: a.toc || [],
            seo: a.seo,
          }));
        }
      } catch (e) {
        console.warn('Fallback to in-memory articles');
      }
    }
    return inMemoryArticles;
  }

  static async getBySlug(slug: string): Promise<ArticleItem | null> {
    const all = await this.getAll();
    return all.find((a) => a.slug === slug) || null;
  }

  static async create(data: Partial<ArticleItem>, userId: string): Promise<ArticleItem> {
    const newArt: ArticleItem = {
      id: `art-${Date.now()}`,
      slug: data.slug || `article-${Date.now()}`,
      title: data.title || 'Untitled Article',
      subtitle: data.subtitle || '',
      category: data.category || 'Architecture',
      status: data.status || 'draft',
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: data.readTime || '5 min read',
      views: 0,
      coverImage: data.coverImage || '',
      contentMarkdown: data.contentMarkdown || '# New Article',
      toc: data.toc || [{ id: 'intro', title: '1. Introduction' }],
      seo: data.seo || {
        metaTitle: data.title || '',
        metaDescription: data.subtitle || '',
        canonicalUrl: `https://signalforge.dev/articles/${data.slug}`,
        keywords: ['Architecture', 'Systems'],
        ogImage: data.coverImage || '',
      },
    };
    inMemoryArticles.unshift(newArt);
    await connectToDatabase();
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const status = (newArt.status || 'draft').toUpperCase();
      const saved = await Article.create({
        userId,
        title: newArt.title,
        slug: newArt.slug,
        subtitle: newArt.subtitle,
        category: newArt.category,
        status: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'].includes(status) ? status : 'DRAFT',
        publishedDate: newArt.publishedDate,
        readTime: newArt.readTime,
        views: 0,
        coverImage: newArt.coverImage,
        contentMarkdown: newArt.contentMarkdown,
        toc: newArt.toc,
        seo: newArt.seo,
      });
      newArt.id = saved._id.toString();
    }
    return newArt;
  }

  static async update(id: string, data: Partial<ArticleItem>, userId: string): Promise<ArticleItem | null> {
    await connectToDatabase();
    const current = inMemoryArticles.find((a) => a.id === id);
    const merged: ArticleItem = {
      ...(current || {
        id,
        slug: data.slug || id,
        title: data.title || 'Untitled Article',
        subtitle: '',
        category: 'Architecture',
        status: 'draft',
        publishedDate: '',
        readTime: '5 min read',
        views: 0,
        coverImage: '',
        contentMarkdown: '',
        toc: [],
        seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', keywords: [], ogImage: '' },
      }),
      ...data,
      id,
    };
    inMemoryArticles = inMemoryArticles.map((a) => (a.id === id ? merged : a));
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id) && mongoose.Types.ObjectId.isValid(userId)) {
      const status = (merged.status || 'draft').toUpperCase();
      await Article.findOneAndUpdate(
        { _id: id, userId },
        {
          title: merged.title,
          slug: merged.slug,
          subtitle: merged.subtitle,
          category: merged.category,
          status: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'].includes(status) ? status : 'DRAFT',
          contentMarkdown: merged.contentMarkdown,
          seo: merged.seo,
          coverImage: merged.coverImage,
        }
      );
    }
    return merged;
  }
}
