import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { services } from '@/content/services';
import { booking, owner, pillars } from '@/content/site';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getBySlug } from '@/lib/projects';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return {
    title: t('title'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/services`,
      languages: { en: '/en/services', ar: '/ar/services' },
    },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('services');
  const work = await getTranslations('work');

  return (
    <main id="main">
      <PageHeader title={t('title')} lead={t('lead')} />

      <div className="container-page space-y-20 pb-24">
        <ul className="space-y-6">
          {services.map((service, index) => {
            const pillar = pillars[service.pillar];
            const proof = getBySlug(service.proofSlug);

            return (
              <Reveal
                as="li"
                key={service.pillar}
                delay={index * 0.06}
                className="rounded-panel border border-line bg-surface p-7 sm:p-9"
              >
                <Tag tone={pillar.accent === 'ai' ? 'ai' : 'brand'}>{pillar.label[locale]}</Tag>

                <h2 className="mt-5 max-w-3xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {service.headline[locale]}
                </h2>

                <p className="mt-5 max-w-2xl leading-relaxed text-ink-muted">
                  {service.forWhom[locale]}
                </p>

                <div className="mt-8 border-t border-line pt-7">
                  <h3 className="mb-4 font-mono text-xs tracking-widest text-ink-subtle uppercase">
                    {t('deliverables')}
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {service.deliverables.map((item) => (
                      <li key={item.en} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                        />
                        <span className="text-sm leading-relaxed text-ink-muted">
                          {item[locale]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {proof && (
                  <p className="mt-7 text-sm text-ink-subtle">
                    {t('proof')}{' '}
                    {proof.hasCaseStudy ? (
                      <Link
                        href={`/work/${proof.slug}`}
                        className="text-brand hover:text-brand-strong"
                      >
                        {proof.name[locale]}
                      </Link>
                    ) : (
                      <Link href="/work" className="text-brand hover:text-brand-strong">
                        {proof.name[locale]}
                      </Link>
                    )}
                  </p>
                )}
              </Reveal>
            );
          })}
        </ul>

        {/* ---- how engagements work ---- */}
        <section aria-labelledby="engagement-heading" className="max-w-3xl">
          <h2
            id="engagement-heading"
            className="mb-6 font-mono text-xs tracking-widest text-ink-subtle uppercase"
          >
            {t('engagement')}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-ink-muted">
            <p>{t('engagementBody')}</p>
            <p>{t('pricing')}</p>
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section
          aria-labelledby="services-cta"
          className="rounded-panel border border-line p-8 sm:p-10"
        >
          <h2 id="services-cta" className="text-xl font-semibold tracking-tight text-ink">
            {t('ctaTitle')}
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-muted">{t('ctaBody')}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {/*
              A booking button only appears once a scheduling link exists; until
              then the form and WhatsApp are the paths, and both actually work.
            */}
            {booking.calUsername && (
              <ButtonAnchor
                href={`https://cal.com/${booking.calUsername}/${booking.calEvent}`}
                variant="primary"
              >
                {t('bookCall')}
              </ButtonAnchor>
            )}
            <ButtonLink href="/contact" variant={booking.calUsername ? 'secondary' : 'primary'}>
              {t('startHere')}
            </ButtonLink>
            <ButtonAnchor href={`https://wa.me/${owner.whatsapp.e164}`} variant="secondary">
              {t('whatsapp')}
            </ButtonAnchor>
            <ButtonLink href="/work" variant="ghost">
              {work('allWork')}
            </ButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
