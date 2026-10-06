import { setRequestLocale } from 'next-intl/server';

import { ContactCta } from '@/components/sections/ContactCta';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Hero } from '@/components/sections/Hero';
import { Metrics } from '@/components/sections/Metrics';
import { Pillars } from '@/components/sections/Pillars';
import { StackDiagram } from '@/components/sections/StackDiagram';
import { StackStrip } from '@/components/sections/StackStrip';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Locale } from '@/i18n/routing';
import { graph, profilePageNode } from '@/lib/structured-data';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main">
      <Hero locale={locale} />
      <Pillars locale={locale} />
      <FeaturedWork locale={locale} />
      {/* The stack graph sits after the work, where it reads as an explanation
          of what was just shown rather than as an unexplained ornament. */}
      <StackDiagram locale={locale} />
      <Metrics />
      <StackStrip />
      <ContactCta />

      {/* This page is about the person; the layout's graph says who that is. */}
      <JsonLd data={graph(profilePageNode(locale))} />
    </main>
  );
}
