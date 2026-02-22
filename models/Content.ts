import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'LINKEDIN_POST' | 'ARTICLE' | 'SHORT_POST' | 'CAROUSEL' | 'NEWSLETTER';
  status: 'IDEA' | 'DRAFT' | 'REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  platform: 'LinkedIn' | 'X' | 'Web' | 'All';
  body: string;
  tags: string[];
  scheduledDate?: string;
  coverImage?: string;
  views?: number;
  engagements?: number;
}

const ContentSchema = new Schema<IContent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['LINKEDIN_POST', 'ARTICLE', 'SHORT_POST', 'CAROUSEL', 'NEWSLETTER'],
      default: 'LINKEDIN_POST',
    },
    status: {
      type: String,
      enum: ['IDEA', 'DRAFT', 'REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    platform: { type: String, enum: ['LinkedIn', 'X', 'Web', 'All'], default: 'LinkedIn' },
    body: { type: String, required: true },
    tags: [{ type: String }],
    scheduledDate: { type: String },
    coverImage: { type: String },
    views: { type: Number, default: 0 },
    engagements: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Content = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
