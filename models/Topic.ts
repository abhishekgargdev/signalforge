import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  category: string;
  summary: string;
  source: string;
  sourceUrl?: string;
  trendScore: number;
  freshness: string;
  careerRelevance: string;
  companyRelevance: string[];
  tags: string[];
  keyFacts: string[];
  timeline: { year: string; milestone: string }[];
  suggestedAngles: string[];
  isSaved: boolean;
}

const TopicSchema = new Schema<ITopic>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    source: { type: String, required: true },
    sourceUrl: { type: String },
    trendScore: { type: Number, default: 80 },
    freshness: { type: String, default: 'Recent' },
    careerRelevance: { type: String, default: '' },
    companyRelevance: [{ type: String }],
    tags: [{ type: String }],
    keyFacts: [{ type: String }],
    timeline: [{ year: String, milestone: String }],
    suggestedAngles: [{ type: String }],
    isSaved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Topic = mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);
