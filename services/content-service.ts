import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Content } from '@/models/Content';
import { INITIAL_CONTENT_PIPELINE, ContentItem } from '@/lib/signalforge-data';

let inMemoryContent: ContentItem[] = [...INITIAL_CONTENT_PIPELINE];

export class ContentService {
  static async getAll(userId: string): Promise<ContentItem[]> {
    await connectToDatabase();
    if (isDbConnected()) {
      try {
        const found = await Content.find({}).sort({ createdAt: -1 }).lean();
        if (found.length > 0) {
          return found.map((c: any) => ({
            id: c._id.toString(),
            title: c.title,
            type: c.type === 'LINKEDIN_POST' ? 'LinkedIn Post' : 'Technical Article',
            status: c.status.toLowerCase(),
            platform: c.platform,
            createdDate: c.createdAt.toISOString().split('T')[0],
            tags: c.tags || [],
            body: c.body,
            views: c.views,
            engagements: c.engagements,
          }));
        }
      } catch (e) {
        console.warn('Fallback to in-memory content pipeline');
      }
    }
    return inMemoryContent;
  }

  static async create(data: Partial<ContentItem>, userId: string): Promise<ContentItem> {
    const newItem: ContentItem = {
      id: `cnt-${Date.now()}`,
      title: data.title || 'Untitled Draft',
      type: data.type || 'LinkedIn Post',
      status: data.status || 'draft',
      platform: data.platform || 'LinkedIn',
      createdDate: new Date().toISOString().split('T')[0],
      scheduledDate: data.scheduledDate,
      tags: data.tags || [],
      body: data.body || '',
      views: 0,
      engagements: 0,
    };
    inMemoryContent.unshift(newItem);
    return newItem;
  }
}
