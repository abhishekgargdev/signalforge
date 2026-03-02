import mongoose, { Schema, Document } from 'mongoose';

export interface IOccasion extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  date: string;
  note: string;
}

const OccasionSchema = new Schema<IOccasion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Occasion = mongoose.models.Occasion || mongoose.model<IOccasion>('Occasion', OccasionSchema);
