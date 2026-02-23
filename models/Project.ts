import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  problem: string;
  solution?: string;
  architecture: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  lessons: string;
  relatedArticleSlug?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String },
    architecture: { type: String, required: true },
    technologies: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String },
    lessons: { type: String, default: '' },
    relatedArticleSlug: { type: String },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
