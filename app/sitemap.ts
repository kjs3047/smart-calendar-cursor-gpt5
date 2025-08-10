import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/calendar`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/tasks`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/admin/categories`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
