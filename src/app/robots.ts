import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /**
         * `/api/` is disallowed only to keep crawlers out of the PDF generator —
         * it renders a document on every request, and there is nothing there for
         * an index that /cv does not already expose as HTML.
         */
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
