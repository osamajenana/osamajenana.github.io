import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // Always prefix so /en and /ar are both explicit, canonical URLs.
  localePrefix: 'always',
  /**
   * `/` always lands on English.
   *
   * With detection on, next-intl reads Accept-Language and sends an
   * Arabic-configured browser to /ar — which is a reasonable default for a
   * product and the wrong one here. This is a CV: the audience that matters
   * arrives from a recruiter's link or a search result and should see the
   * English site unless they choose otherwise. The switch in the header links
   * straight at /ar, so choosing otherwise is one tap.
   */
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/** Text direction for a locale. Drives the `dir` attribute on <html>. */
export function directionOf(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** BCP-47 tag used for hreflang / og:locale. */
export const localeTags: Record<Locale, string> = {
  en: 'en_US',
  ar: 'ar',
};
