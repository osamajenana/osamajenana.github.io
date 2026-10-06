import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { owner, resolveNavItems, SITE_URL, seoKeywords } from '@/content/site';
import { directionOf, localeTags, routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { publishedPostCount } from '@/lib/posts';
import { graph, personNode, websiteNode } from '@/lib/structured-data';
import { themeBootstrapScript } from '@/lib/theme';

import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Only the locales above exist. Without this, any root path the proxy does not
 * handle — `/favicon.ico`, `/ads.txt`, a scanner probing `/wp-login.php` — is
 * rendered as if its first segment were a locale, the page reads content that
 * has no entry under that key, throws, and the visitor gets a 500. A crawler
 * reads a run of server errors as an unhealthy site; these are simply not found.
 */
export const dynamicParams = false;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  /**
   * One value, not a prefers-color-scheme pair. The site opens dark for
   * everybody regardless of the OS setting, so a light chrome colour keyed off
   * the OS would frame a dark page in a white bar. Tracks --canvas in the dark
   * palette in globals.css.
   */
  themeColor: '#08090e',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('titleDefault'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    keywords: seoKeywords,
    authors: [{ name: owner.fullName, url: SITE_URL }],
    creator: owner.fullName,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ar: '/ar',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName: owner.shortName,
      title: t('titleDefault'),
      description: t('description'),
      url: `/${locale}`,
      locale: localeTags[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => localeTags[l]),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('titleDefault'),
      description: t('description'),
      creator: '@OsamaJenana',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    /**
     * Ownership proof for Google Search Console and Bing Webmaster Tools, so
     * verifying either is an environment variable rather than a code change.
     * Bing is worth the second line: its index is what several assistants
     * search. Unset variables emit no tag at all.
     */
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
        : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Opts this layout and its children into static rendering.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <html
      lang={locale}
      dir={directionOf(locale)}
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        {/*
          Runs before anything below it paints, so the page never renders one
          frame in the wrong theme. Emitted by this server component rather than
          from inside the provider: a <script> created during a client render is
          both useless (it would not execute) and something React 19 warns about.
        */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />

        <ThemeProvider>
          <NextIntlClientProvider>
            <a
              href="#main"
              className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:start-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-brand focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-medium focus-visible:text-on-brand"
            >
              {t('skipToContent')}
            </a>
            <Header navItems={resolveNavItems(publishedPostCount)} />
            {children}
            <Footer locale={locale} />
            {/* Film grain over the whole page. Fixed, non-interactive, and the
                last thing painted so it sits over every section. */}
            <div aria-hidden className="grain" />
          </NextIntlClientProvider>
        </ThemeProvider>

        {/*
          Identity graph for search engines — the site is the canonical source.
          The person and the website, on every route; a page adds its own nodes
          (a service, a case study, a post) and points back at these by `@id`.
          See lib/structured-data.ts.
        */}
        <JsonLd data={graph(personNode(locale), websiteNode())} />
      </body>
    </html>
  );
}
