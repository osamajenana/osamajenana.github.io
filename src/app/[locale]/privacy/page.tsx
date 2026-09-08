import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { LegalDocumentPage } from '@/components/legal/LegalDocument';
import { privacyPolicy } from '@/content/legal';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: privacyPolicy.title[locale],
    description: privacyPolicy.lead[locale],
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { en: '/en/privacy', ar: '/ar/privacy' },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocumentPage document={privacyPolicy} locale={locale} />;
}
