import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { getCloudinaryConfig, signUpload } from '@/lib/cloudinary';

export async function POST() {
  try {
    await requireAuth();
    const config = getCloudinaryConfig();
    if (!config) {
      return standardError('CLOUDINARY_NOT_CONFIGURED', 'Cloudinary credentials are missing', 500);
    }

    const timestamp = String(Math.round(Date.now() / 1000));
    const folder = 'signalforge/uploads';
    const signature = signUpload({ folder, timestamp }, config.apiSecret);

    return standardResponse({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || config.cloudName,
      apiKey: config.apiKey,
      folder,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signature generation failed';
    return standardError('MEDIA_SIGNATURE_ERROR', message, 500);
  }
}
