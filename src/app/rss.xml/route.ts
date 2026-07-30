import { SITE_URL, owner } from '@/content/site';
import { routing } from '@/i18n/routing';
import { getPosts } from '@/lib/posts';

/**
 * RSS 2.0 feed.
 *
 * One feed rather than one per locale: each item is emitted in the default
 * locale and carries an `<xhtml:link>` alternate to its translation, so a reader
 * subscribing once still sees every post exactly once.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getPosts();
  const locale = routing.defaultLocale;
  const other = routing.locales.filter((l) => l !== locale);

  const items = posts
    .map((entry) => {
      const url = `${SITE_URL}/${locale}/blog/${entry.slug}`;
      const alternates = other
        .map(
          (alt) =>
            `      <xhtml:link rel="alternate" hreflang="${alt}" href="${SITE_URL}/${alt}/blog/${entry.slug}" />`,
        )
        .join('\n');

      return [
        '    <item>',
        `      <title>${escapeXml(entry.title[locale])}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(entry.description[locale])}</description>`,
        `      <pubDate>${new Date(`${entry.publishedAt}T09:00:00Z`).toUTCString()}</pubDate>`,
        ...entry.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        alternates,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <channel>
    <title>${escapeXml(owner.fullName)} — Writing</title>
    <link>${SITE_URL}/${locale}/blog</link>
    <description>Notes on building and running production systems.</description>
    <language>${locale}</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
