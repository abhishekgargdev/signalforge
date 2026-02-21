import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  website?: string;
  logo?: string;
  industry: string;
  priority: 'Tier 1' | 'Tier 2' | 'Tier 3';
  technologies: string[];
  topics: string[];
  headquarters?: string;
  description: string;
  notes?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  openRolesCount: number;
}

const CompanySchema = new Schema<ICompany>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, index: true },
    website: { type: String },
    logo: { type: String },
    industry: { type: String, required: true },
    priority: { type: String, enum: ['Tier 1', 'Tier 2', 'Tier 3'], default: 'Tier 1' },
    technologies: [{ type: String }],
    topics: [{ type: String }],
    headquarters: { type: String },
    description: { type: String, default: '' },
    notes: { type: String },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
    openRolesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CompanySchema.index({ userId: 1, slug: 1 }, { unique: true });

export const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
