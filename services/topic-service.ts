import mongoose from 'mongoose';
import { connectToDatabase, isDbConnected } from '@/lib/db/mongoose';
import { Topic, ITopic } from '@/models/Topic';
import { INITIAL_TOPIC_SIGNALS, TopicSignal } from '@/lib/signalforge-data';

let inMemoryTopics: TopicSignal[] = [...INITIAL_TOPIC_SIGNALS];

export class TopicService {
  static async getAll(userId: string): Promise<TopicSignal[]> {
    await connectToDatabase();
    if (isDbConnected()) {
      try {
        const found = await Topic.find({}).sort({ trendScore: -1 }).lean();
        if (found.length > 0) {
          return found.map((t: any) => ({
            id: t._id.toString(),
            title: t.title,
            category: t.category,
            summary: t.summary,
            source: t.source,
            sourceUrl: t.sourceUrl,
            trendScore: t.trendScore,
            freshness: t.freshness,
            careerRelevance: t.careerRelevance,
            companyRelevance: t.companyRelevance || [],
            tags: t.tags || [],
            keyFacts: t.keyFacts || [],
            timeline: t.timeline || [],
            suggestedAngles: t.suggestedAngles || [],
            isSaved: t.isSaved || false,
          }));
        }
      } catch (err) {
        console.warn('Fallback to in-memory topics:', err);
      }
    }
    return inMemoryTopics;
  }

  static async getById(id: string): Promise<TopicSignal | null> {
    const all = await this.getAll('usr_demo_abhishek');
    return all.find((t) => t.id === id) || null;
  }

  static async create(data: Partial<TopicSignal>, userId: string): Promise<TopicSignal> {
    const newTopic: TopicSignal = {
      id: `sig-${Date.now()}`,
      title: data.title || 'Untitled Signal',
      category: data.category || 'AI & Inference',
      summary: data.summary || '',
      source: data.source || 'SignalForge Internal Radar',
      trendScore: data.trendScore || 85,
      freshness: 'Just now',
      careerRelevance: data.careerRelevance || 'Staff Systems Engineer',
      companyRelevance: data.companyRelevance || [],
      tags: data.tags || [],
      keyFacts: data.keyFacts || [],
      timeline: data.timeline || [],
      suggestedAngles: data.suggestedAngles || [],
      isSaved: false,
    };

    inMemoryTopics.unshift(newTopic);
    await connectToDatabase();
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const saved = await Topic.create({
        userId,
        title: newTopic.title,
        slug: `topic-${Date.now()}`,
        category: newTopic.category,
        summary: newTopic.summary,
        source: newTopic.source,
        trendScore: newTopic.trendScore,
        freshness: newTopic.freshness,
        careerRelevance: newTopic.careerRelevance,
        companyRelevance: newTopic.companyRelevance,
        tags: newTopic.tags,
        keyFacts: newTopic.keyFacts,
        timeline: newTopic.timeline,
        suggestedAngles: newTopic.suggestedAngles,
        isSaved: false,
      });
      newTopic.id = saved._id.toString();
    }
    return newTopic;
  }

  static async update(id: string, data: Partial<TopicSignal>, userId: string): Promise<TopicSignal | null> {
    await connectToDatabase();
    if (!isDbConnected() || !mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return null;
    const saved = await Topic.findOneAndUpdate(
      { _id: id, userId },
      { title: data.title, summary: data.summary, category: data.category || 'Topic' },
      { new: true }
    ).lean();
    if (!saved) return null;
    return {
      id: saved._id.toString(),
      title: saved.title,
      category: saved.category,
      summary: saved.summary,
      source: saved.source,
      trendScore: saved.trendScore,
      freshness: saved.freshness,
      careerRelevance: saved.careerRelevance,
      companyRelevance: saved.companyRelevance || [],
      tags: saved.tags || [],
      keyFacts: saved.keyFacts || [],
      timeline: saved.timeline || [],
      suggestedAngles: saved.suggestedAngles || [],
      isSaved: saved.isSaved,
    };
  }

  static async remove(id: string, userId: string): Promise<boolean> {
    await connectToDatabase();
    if (!isDbConnected() || !mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return false;
    const result = await Topic.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}
