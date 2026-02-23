import mongoose, { Schema, Document } from 'mongoose';

export interface IPerson extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  username?: string;
  company: string;
  companyId?: mongoose.Types.ObjectId;
  role: string;
  avatar?: string;
  profileUrl?: string;
  topics: string[];
  priority: 'High' | 'Medium' | 'Low';
  relationshipStatus: 'New' | 'Following' | 'Engaged' | 'Replied' | 'Connected' | 'Active Dialogue';
  lastInteraction?: string;
  engagementCount: number;
  notes?: string;
}

const PersonSchema = new Schema<IPerson>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    username: { type: String },
    company: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    role: { type: String, required: true },
    avatar: { type: String },
    profileUrl: { type: String },
    topics: [{ type: String }],
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    relationshipStatus: {
      type: String,
      enum: ['New', 'Following', 'Engaged', 'Replied', 'Connected', 'Active Dialogue'],
      default: 'New',
    },
    lastInteraction: { type: String },
    engagementCount: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Person = mongoose.models.Person || mongoose.model<IPerson>('Person', PersonSchema);
