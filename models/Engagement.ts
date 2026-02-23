import mongoose, { Schema, Document } from 'mongoose';

export interface IEngagementOpportunity extends Document {
  userId: mongoose.Types.ObjectId;
  author: string;
  role: string;
  company: string;
  platform: 'LinkedIn' | 'X';
  content: string;
  postUrl?: string;
  relevanceScore: number;
  technicalAngle: string;
  status: 'PENDING' | 'POSTED' | 'IGNORED' | 'SAVED';
  suggestedComments: {
    type: 'Technical Insight' | 'Personal Perspective' | 'Constructive Question' | 'Alternative Perspective';
    text: string;
    originalityScore: number;
  }[];
}

const EngagementSchema = new Schema<IEngagementOpportunity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    author: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    platform: { type: String, enum: ['LinkedIn', 'X'], default: 'LinkedIn' },
    content: { type: String, required: true },
    postUrl: { type: String },
    relevanceScore: { type: Number, default: 90 },
    technicalAngle: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'POSTED', 'IGNORED', 'SAVED'], default: 'PENDING' },
    suggestedComments: [
      {
        type: { type: String, required: true },
        text: { type: String, required: true },
        originalityScore: { type: Number, default: 95 },
      },
    ],
  },
  { timestamps: true }
);

export const Engagement =
  mongoose.models.Engagement || mongoose.model<IEngagementOpportunity>('Engagement', EngagementSchema);
