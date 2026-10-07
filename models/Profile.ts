import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  headline: string;
  bio: string;
  website?: string;
  skills: string[];
  targetRoles: string[];
  targetIndustries: string[];
  writingStyle: string;
  generationPrompt?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  xUrl?: string;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    website: { type: String },
    skills: [{ type: String }],
    targetRoles: [{ type: String }],
    targetIndustries: [{ type: String }],
    writingStyle: { type: String, default: 'Direct, technical, zero-slop' },
    generationPrompt: { type: String, default: '' },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    xUrl: { type: String },
  },
  { timestamps: true }
);

export const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
