import mongoose, { Schema, Document } from 'mongoose';

export interface IConnectionLead extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  role: string;
  company: string;
  profileUrl: string;
  note: string;
  status: 'suggested' | 'invited' | 'skipped';
  dayKey: string;
}

const ConnectionLeadSchema = new Schema<IConnectionLead>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    note: { type: String, default: '' },
    status: { type: String, enum: ['suggested', 'invited', 'skipped'], default: 'suggested' },
    dayKey: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const ConnectionLead =
  mongoose.models.ConnectionLead || mongoose.model<IConnectionLead>('ConnectionLead', ConnectionLeadSchema);
