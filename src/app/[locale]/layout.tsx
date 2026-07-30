import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { owner, resolveNavItems, SITE_URL, seoKeywords, socials } from '@/content/site';
import { directionOf, localeTags, routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { publishedPostCount } from '@/lib/posts';

import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfbfc' },
    { media: '(prefers-color-scheme: dark)', color: '#08090c' },
  ],
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
        <ThemeProvider>
          <NextIntlClientProvider>
            <a
              href="#main"
              className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:start-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-brand focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white"
            >
              {t('skipToContent')}
            </a>
            <Header navItems={resolveNavItems(publishedPostCount)} />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>

        {/* Identity graph for search engines — the site is the canonical source. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: owner.fullName,
              alternateName: owner.shortName,
              url: SITE_URL,
              email: `mailto:${owner.email}`,
              jobTitle: owner.role.en,
              description: owner.specialism.en,
              sameAs: [socials.github, socials.githubOrg, socials.x, socials.linkedin].filter(
                (link): link is string => Boolean(link),
              ),
            }),
          }}
        />
      </body>
    </html>
  );
}
