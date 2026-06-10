import type { MetadataRoute } from 'next';
import { siteUrl, lastContentUpdate } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
