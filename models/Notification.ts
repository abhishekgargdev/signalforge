import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type:
    | 'NEW_SIGNAL'
    | 'RESEARCH_READY'
    | 'CONTENT_GENERATED'
    | 'CONTENT_SCHEDULED'
    | 'PUBLISH_SUCCESS'
    | 'PUBLISH_FAILED'
    | 'ENGAGEMENT_OPPORTUNITY'
    | 'RELATIONSHIP_REMINDER'
    | 'SYSTEM';
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'NEW_SIGNAL',
        'RESEARCH_READY',
        'CONTENT_GENERATED',
        'CONTENT_SCHEDULED',
        'PUBLISH_SUCCESS',
        'PUBLISH_FAILED',
        'ENGAGEMENT_OPPORTUNITY',
        'RELATIONSHIP_REMINDER',
        'SYSTEM',
      ],
      default: 'SYSTEM',
    },
    read: { type: Boolean, default: false },
    link: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
