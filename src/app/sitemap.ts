import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/content/site';
import { routing } from '@/i18n/routing';
import { getPosts } from '@/lib/posts';
import { getCaseStudySlugs } from '@/lib/projects';

/**
 * Every indexable URL, in both locales, with `alternates.languages` so search
 * engines treat the two versions as translations rather than duplicates.
 *
 * Generated from the same registries the pages render from, so a new project or
 * post cannot be missing from the sitemap.
 */
type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

type Entry = {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  lastModified?: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();

  const staticPaths: Entry[] = [
    { path: '', priority: 1, changeFrequency: 'monthly' },
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/work/archive', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/about', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/services', priority: 0.8, changeFrequency: 'yearly' },
    { path: '/cv', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
    // Listed only once there is something to read there.
    ...(posts.length > 0
      ? [{ path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const }]
      : []),
  ];

  const dynamicPaths: Entry[] = [
    ...getCaseStudySlugs().map((slug) => ({
      path: `/work/${slug}`,
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    })),
    ...posts.map((entry) => ({
      path: `/blog/${entry.slug}`,
      priority: 0.6,
      changeFrequency: 'yearly' as const,
      lastModified: entry.updatedAt ?? entry.publishedAt,
    })),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const item of [...staticPaths, ...dynamicPaths]) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${item.path}`,
        priority: item.priority,
        changeFrequency: item.changeFrequency,
        ...(item.lastModified ? { lastModified: new Date(item.lastModified) } : {}),
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alt) => [alt, `${SITE_URL}/${alt}${item.path}`]),
          ),
        },
      });
    }
  }

  return entries;
}
