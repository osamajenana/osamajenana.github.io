import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { company, owner, resolveNavItems, SITE_URL, seoKeywords, socials } from '@/content/site';
import { directionOf, localeTags, routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { publishedPostCount } from '@/lib/posts';
import { themeBootstrapScript } from '@/lib/theme';

import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    // The entity that publishes the site, as distinct from the person who
    // writes it. Platform reviewers read this pair together.
    publisher: company.legalName[locale],
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
      siteName: company.legalName[locale],
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

          Two nodes, linked both ways: the registered company that publishes
          the site, and the person who founded it. The Organization node is
          what a platform reviewer's automated check reads, so its `legalName`,
          `address` and identifiers are the certificate's values verbatim,
          fed from `company` rather than retyped here.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}/#organization`,
                  name: company.legalName.en,
                  legalName: company.legalName.en,
                  alternateName: company.legalName.ar,
                  url: SITE_URL,
                  email: company.email,
                  telephone: company.phone.e164,
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: company.postalAddress.streetAddress,
                    addressLocality: company.postalAddress.addressLocality,
                    addressCountry: company.postalAddress.addressCountry,
                  },
                  identifier: [
                    {
                      '@type': 'PropertyValue',
                      name: 'Company number',
                      value: company.companyNumber,
                    },
                    {
                      '@type': 'PropertyValue',
                      name: 'Commercial registration number',
                      value: company.registrationNumber,
                    },
                  ],
                  founder: { '@id': `${SITE_URL}/#person` },
                  contactPoint: [
                    {
                      '@type': 'ContactPoint',
                      contactType: 'customer support',
                      email: company.email,
                      telephone: company.phone.e164,
                      availableLanguage: ['en', 'ar'],
                    },
                  ],
                  sameAs: [socials.github, socials.githubOrg, socials.x, socials.linkedin].filter(
                    (link): link is string => Boolean(link),
                  ),
                },
                {
                  '@type': 'Person',
                  '@id': `${SITE_URL}/#person`,
                  name: owner.fullName,
                  alternateName: owner.shortName,
                  url: SITE_URL,
                  email: `mailto:${owner.email}`,
                  jobTitle: owner.role.en,
                  description: owner.specialism.en,
                  worksFor: { '@id': `${SITE_URL}/#organization` },
                  sameAs: [socials.github, socials.githubOrg, socials.x, socials.linkedin].filter(
                    (link): link is string => Boolean(link),
                  ),
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
