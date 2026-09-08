import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LegalDocumentPage } from '@/components/legal/LegalDocument';
import { termsOfService } from '@/content/legal';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: termsOfService.title[locale],
    description: termsOfService.lead[locale],
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { en: '/en/terms', ar: '/ar/terms' },
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocumentPage document={termsOfService} locale={locale} />;
}
