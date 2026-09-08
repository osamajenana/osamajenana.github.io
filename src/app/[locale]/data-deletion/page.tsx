import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LegalDocumentPage } from '@/components/legal/LegalDocument';
import { dataDeletionPolicy } from '@/content/legal';
import type { Locale } from '@/i18n/routing';

/**
 * The URL submitted to Meta as the app's data deletion instructions. It has to
 * stay at exactly this path in both locales — a moved or renamed route breaks
 * a live App Review submission, not just a link.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: dataDeletionPolicy.title[locale],
    description: dataDeletionPolicy.lead[locale],
    alternates: {
      canonical: `/${locale}/data-deletion`,
      languages: { en: '/en/data-deletion', ar: '/ar/data-deletion' },
    },
  };
}

export default async function DataDeletionPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocumentPage document={dataDeletionPolicy} locale={locale} />;
}
