import mongoose, { Schema, Document } from 'mongoose';

export interface ICommentDraft extends Document {
  userId: mongoose.Types.ObjectId;
  author: string;
  excerpt: string;
  comment: string;
  status: 'prepared' | 'posted' | 'skipped';
  dayKey: string;
}

const CommentDraftSchema = new Schema<ICommentDraft>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    author: { type: String, default: '' },
    excerpt: { type: String, required: true },
    comment: { type: String, default: '' },
    status: { type: String, enum: ['prepared', 'posted', 'skipped'], default: 'prepared' },
    dayKey: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const CommentDraft =
  mongoose.models.CommentDraft || mongoose.model<ICommentDraft>('CommentDraft', CommentDraftSchema);
