import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import {
  audience,
  capabilities,
  platformProofSlug,
  platformStack,
  steps,
} from '@/content/platform';
import { company, owner } from '@/content/site';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getBySlug } from '@/lib/projects';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'platform' });

  return {
    title: t('title'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/platform`,
      languages: { en: '/en/platform', ar: '/ar/platform' },
    },
    openGraph: {
      type: 'website',
      title: `${t('title')} — ${company.legalName[locale]}`,
      description: t('lead'),
      url: `/${locale}/platform`,
    },
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('platform');
  const work = await getTranslations('work');
  const proof = getBySlug(platformProofSlug);

  return (
    <main id="main">
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <div className="container-page space-y-20 pb-24">
        {/* ---- what it does ---- */}
        <section aria-labelledby="capabilities-heading" className="pt-14">
          <SectionTitle id="capabilities-heading">{t('whatItDoes')}</SectionTitle>
          <ul className="grid gap-5 md:grid-cols-2">
            {capabilities.map((entry, index) => (
              <Reveal
                as="li"
                key={entry.title.en}
                delay={Math.min(index, 5) * 0.05}
                className="panel p-6"
              >
                <h3 className="font-semibold tracking-tight text-ink">{entry.title[locale]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{entry.body[locale]}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* ---- who it is for ---- */}
        <section aria-labelledby="audience-heading">
          <SectionTitle id="audience-heading">{t('whoItIsFor')}</SectionTitle>
          <ul className="divide-y divide-line border-y border-line">
            {audience.map((entry) => (
              <li
                key={entry.title.en}
                className="grid gap-2 py-6 sm:grid-cols-[16rem_minmax(0,1fr)] sm:gap-8"
              >
                <h3 className="font-medium text-ink">{entry.title[locale]}</h3>
                <p className="leading-relaxed text-ink-muted">{entry.body[locale]}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- how it works ---- */}
        <section aria-labelledby="how-heading">
          <SectionTitle id="how-heading">{t('howItWorks')}</SectionTitle>
          {/*
            An ordered list on a rule, the same treatment the About page gives a
            career: the steps happen in this order and the numbering is the
            content, not decoration.
          */}
          <ol className="space-y-10 border-s border-line ps-6 sm:ps-8">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.title.en} delay={index * 0.05}>
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute -start-[1.9rem] top-2 size-2 rounded-full bg-brand sm:-start-[2.4rem]"
                  />
                  <p className="nums text-xs tracking-widest text-ink-subtle uppercase">
                    {t('step', { number: index + 1 })}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink">
                    {step.title[locale]}
                  </h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
                    {step.body[locale]}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ---- platform compliance ---- */}
        <section aria-labelledby="compliance-heading" className="max-w-3xl">
          <SectionTitle id="compliance-heading">{t('compliance')}</SectionTitle>
          <p className="text-lg leading-relaxed text-ink-muted">{t('complianceBody')}</p>
        </section>

        {/* ---- stack ---- */}
        <section aria-labelledby="stack-heading">
          <SectionTitle id="stack-heading">{t('stack')}</SectionTitle>
          <ul className="flex flex-wrap gap-1.5">
            {platformStack.map((item) => (
              <li key={item}>
                <Tag mono>{item}</Tag>
              </li>
            ))}
          </ul>

          {proof?.hasCaseStudy && (
            <p className="mt-6 text-sm text-ink-subtle">
              {work('viewCase')}:{' '}
              <Link href={`/work/${proof.slug}`} className="text-brand hover:text-brand-strong">
                {proof.name[locale]}
              </Link>
            </p>
          )}
        </section>

        {/* ---- CTA ---- */}
        <section
          aria-labelledby="platform-cta"
          className="rounded-panel border border-line p-8 sm:p-10"
        >
          <h2 id="platform-cta" className="text-xl font-semibold tracking-tight text-ink">
            {t('ctaTitle')}
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-muted">{t('ctaBody')}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact">{t('ctaPrimary')}</ButtonLink>
            <ButtonAnchor href={`https://wa.me/${owner.whatsapp.e164}`} variant="secondary">
              {t('ctaSecondary')}
            </ButtonAnchor>
          </div>
        </section>
      </div>

      {/*
        A SoftwareApplication node, distinct from the Organization node in the
        layout: a reviewer checking that the Tech Provider actually has a
        product is looking for exactly this, and the two are linked by provider.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: t('title'),
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: t('lead'),
            inLanguage: ['en', 'ar'],
            provider: {
              '@type': 'Organization',
              name: company.legalName.en,
              legalName: company.legalName.en,
            },
          }),
        }}
      />
    </main>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="eyebrow mb-8">
      {children}
    </h2>
  );
}
