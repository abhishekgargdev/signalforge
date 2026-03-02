import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  userId: string;
  provider: 'linkedin' | 'x';
  providerUserId: string;
  displayName: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: String, required: true, index: true },
    provider: { type: String, enum: ['linkedin', 'x'], required: true },
    providerUserId: { type: String, required: true },
    displayName: { type: String, default: '' },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

AccountSchema.index({ userId: 1, provider: 1 }, { unique: true });

export const Account = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
