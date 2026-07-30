import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

/**
 * Next 16 renamed the `middleware` file convention to `proxy`. next-intl's
 * handler is unchanged — it negotiates the locale and rewrites `/` to the
 * prefixed route.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and anything with a file extension.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
