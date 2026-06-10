import type { MetadataRoute } from 'next';
import { siteUrl, lastContentUpdate } from '@/lib/site';
import { weekData } from '@/app/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const weekPages: MetadataRoute.Sitemap = weekData.map((w) => ({
    url: `${siteUrl}/week/${w.week}`,
    lastModified: lastContentUpdate,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/toolkit`,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...weekPages,
  ];
}
