import type { ReactElement } from 'react';

import { postBodies } from '@/content/posts/content';
import { posts } from '@/content/posts';

import type { Locale } from '@/i18n/routing';
import type { Post } from '@/lib/schemas';

/**
 * Queries over the post registry.
 *
 * Drafts are filtered out of every public surface — index, sitemap, RSS — but
 * are still routable by slug so a post can be reviewed before it is announced.
 */

export function getPosts(): Post[] {
  return posts
    .filter((entry) => !entry.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostSlugs(): string[] {
  return posts.map((entry) => entry.slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((entry) => entry.slug === slug);
}

export function getPostBody(slug: string, locale: Locale): ReactElement | undefined {
  return postBodies[slug]?.[locale];
}

/**
 * How many published posts exist. content/site.ts keeps /blog out of the nav
 * until this reaches two — a blog with a single entry reads as abandoned, which
 * is worse than not having one.
 */
export const publishedPostCount = getPosts().length;

// --- integrity check --------------------------------------------------------

const missingBodies = posts
  .filter((entry) => {
    const pair = postBodies[entry.slug];
    return !pair?.en || !pair?.ar;
  })
  .map((entry) => entry.slug);

if (missingBodies.length > 0) {
  throw new Error(
    `Posts in the registry with no en/ar MDX pair in content/posts/content.tsx: ${missingBodies.join(', ')}`,
  );
}

const orphanBodies = Object.keys(postBodies).filter((slug) => !getPostBySlug(slug));

if (orphanBodies.length > 0) {
  throw new Error(
    `MDX bodies with no registry entry in content/posts/index.ts: ${orphanBodies.join(', ')}`,
  );
}
