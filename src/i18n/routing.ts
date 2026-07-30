import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // Always prefix so /en and /ar are both explicit, canonical URLs.
  localePrefix: 'always',
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
