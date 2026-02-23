import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  project: string;
  problem: string;
  challenge: string;
  solution: string;
  technologies: string[];
  result: string;
  lesson: string;
  tags: string[];
}

const ExperienceSchema = new Schema<IExperience>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    project: { type: String, required: true },
    problem: { type: String, required: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    technologies: [{ type: String }],
    result: { type: String, required: true },
    lesson: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Experience =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
