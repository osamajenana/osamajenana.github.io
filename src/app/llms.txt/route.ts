import { buildLlmsIndex } from '@/lib/llms';

/**
 * /llms.txt — the short index of the site for a language model. The content,
 * and the reason it exists, are in lib/llms.ts.
 */

/** Built once at build time. Nothing here depends on the request. */
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: {
      // The charset is not optional here: without it the Arabic is mojibake.
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
