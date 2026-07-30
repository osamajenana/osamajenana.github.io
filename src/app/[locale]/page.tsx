import { setRequestLocale } from 'next-intl/server';

import { ContactCta } from '@/components/sections/ContactCta';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Hero } from '@/components/sections/Hero';
import { Metrics } from '@/components/sections/Metrics';
import { Pillars } from '@/components/sections/Pillars';
import { StackStrip } from '@/components/sections/StackStrip';
import type { Locale } from '@/i18n/routing';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main">
      <Hero locale={locale} />
      <Pillars locale={locale} />
      <FeaturedWork locale={locale} />
      <Metrics />
      <StackStrip />
      <ContactCta />
    </main>
  );
}
