import { requireAuth, standardResponse, standardError } from '@/lib/auth';
import { getCloudinaryConfig } from '@/lib/cloudinary';

export async function GET() {
  try {
    await requireAuth();
    const config = getCloudinaryConfig();
    if (!config) {
      return standardResponse({ assets: [] });
    }

    const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/resources/image?max_results=30`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    if (!response.ok) {
      return standardError('CLOUDINARY_LIST_ERROR', 'Could not list Cloudinary assets', 502);
    }

    const data = await response.json();
    const assets = (data.resources || []).map((item: {
      public_id: string;
      secure_url: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
    }) => ({
      id: item.public_id,
      title: item.public_id.split('/').pop() || item.public_id,
      format: item.format?.toUpperCase() || 'IMG',
      dimensions: `${item.width}x${item.height}`,
      size: `${Math.max(1, Math.round(item.bytes / 1024))} KB`,
      folder: item.public_id.includes('/') ? item.public_id.split('/').slice(0, -1).join('/') : 'root',
      url: item.secure_url,
    }));

    return standardResponse({ assets });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not list media';
    return standardError('MEDIA_LIST_ERROR', message, 500);
  }
}
