import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Engagement } from '@/models/Engagement';
import { INITIAL_ENGAGEMENTS, EngagementOpportunity } from '@/lib/signalforge-data';

let inMemoryEngagements: EngagementOpportunity[] = [...INITIAL_ENGAGEMENTS];

export class EngagementService {
  static async getAll(userId: string): Promise<EngagementOpportunity[]> {
    await connectToDatabase();
    if (isDbConnected()) {
      try {
        const found = await Engagement.find({}).sort({ createdAt: -1 }).lean();
        if (found.length > 0) {
          return found.map((e: any) => ({
            id: e._id.toString(),
            author: e.author,
            role: e.role,
            company: e.company,
            avatar: '',
            timestamp: 'Recently',
            platform: e.platform,
            content: e.content,
            relevanceScore: e.relevanceScore,
            technicalAngle: e.technicalAngle,
            status: e.status.toLowerCase(),
            suggestedComments: e.suggestedComments || [],
          }));
        }
      } catch (e) {
        console.warn('Fallback to in-memory engagements');
      }
    }
    return inMemoryEngagements;
  }

  static async getById(id: string): Promise<EngagementOpportunity | null> {
    const all = await this.getAll('session');
    return all.find((item) => item.id === id) || null;
  }
}
