import { buildLlmsFull } from '@/lib/llms';

/**
 * /llms-full.txt — the whole site as one Markdown document, for a reader that
 * would rather fetch once than crawl. See lib/llms.ts.
 */

/** Built once at build time. Nothing here depends on the request. */
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildLlmsFull(), {
    headers: {
      // The charset is not optional here: without it the Arabic is mojibake.
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
