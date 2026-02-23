import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'FAILED';
  details?: Record<string, any>;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    ipAddress: { type: String },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
