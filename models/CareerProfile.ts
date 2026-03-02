import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  targetRole: string;
  experienceLevel: string;
  strategy: string;
  skills: { name: string; matchPercent: number; demand: string }[];
  angles: string[];
}

const CareerProfileSchema = new Schema<ICareerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    targetRole: { type: String, default: '' },
    experienceLevel: { type: String, default: '' },
    strategy: { type: String, default: '' },
    skills: [{ name: String, matchPercent: Number, demand: String }],
    angles: [{ type: String }],
  },
  { timestamps: true }
);

export const CareerProfile =
  mongoose.models.CareerProfile || mongoose.model<ICareerProfile>('CareerProfile', CareerProfileSchema);
