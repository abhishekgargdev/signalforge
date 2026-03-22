import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://signalforge.dev';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/articles/', '/author/', '/about', '/contact', '/privacy', '/terms'],
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
