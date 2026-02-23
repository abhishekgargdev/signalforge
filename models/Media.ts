import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  url: string;
  publicId?: string;
  format: string;
  dimensions?: string;
  size?: string;
  folder: string;
  altText?: string;
  tags: string[];
}

const MediaSchema = new Schema<IMedia>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String },
    format: { type: String, default: 'PNG' },
    dimensions: { type: String },
    size: { type: String },
    folder: { type: String, default: 'General' },
    altText: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Media = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
