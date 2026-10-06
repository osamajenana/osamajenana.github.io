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
         *
         * `/cv/` is the designed PDF (the pages are /en/cv and /ar/cv, which
         * this does not match). That document is kept by hand and can carry
         * details the site itself has since stopped publishing, so it is for
         * the person who downloads it, not for an index or a model to quote.
         */
        disallow: ['/api/', '/cv/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
