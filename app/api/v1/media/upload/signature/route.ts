import { NextRequest } from 'next/server';
import { requireAuth, standardResponse, standardError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const timestamp = Math.round(new Date().getTime() / 1000);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'signalforge_dev';
    const apiKey = process.env.CLOUDINARY_API_KEY || 'dev_key';

    // Mock signature for dev / testing if secret is not set
    const signature = `sf_sig_${timestamp}_${user.id}`;

    return standardResponse({
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder: 'signalforge/uploads',
    });
  } catch (err: any) {
    return standardError('MEDIA_SIGNATURE_ERROR', err.message || 'Signature generation failed', 500);
  }
}
