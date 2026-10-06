import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { BookingButton } from '@/components/ui/BookingButton';
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { faq } from '@/content/faq';
import { services } from '@/content/services';
import { owner, pillars } from '@/content/site';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { hasScheduler } from '@/lib/booking';
import { getExpertise } from '@/lib/expertise';
import { getBySlug } from '@/lib/projects';
import { breadcrumbNode, faqNode, graph, serviceNode } from '@/lib/structured-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return {
    // Fuller than the page heading: a search result has room to say what the
    // services are, where the navigation only has room to say "Services".
    title: t('metaTitle'),
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
  const nav = await getTranslations('nav');
  const expertise = await getTranslations('expertise');

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

        {/*
          ---- by technology ----
          The three services above are how the work is sold; these are how it is
          searched for. Each pill is a page of its own that lists the systems
          behind it, and this is the one place every one of them is linked from.
        */}
        <nav aria-labelledby="by-expertise-heading">
          <h2
            id="by-expertise-heading"
            className="mb-6 font-mono text-xs tracking-widest text-ink-subtle uppercase"
          >
            {expertise('browse')}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {getExpertise().map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/expertise/${topic.slug}`}
                  className="inline-flex rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink shadow-sm transition-[border-color,background-color] hover:border-line-strong hover:bg-raised"
                >
                  {topic.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

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

        {/*
          ---- questions ----
          Open on the page, not folded into an accordion: these are short, and
          an answer that has to be clicked for is one a skimming reader — or a
          crawler that does not click — never gets. See content/faq.ts.
        */}
        <section aria-labelledby="faq-heading" className="max-w-3xl">
          <h2
            id="faq-heading"
            className="mb-6 font-mono text-xs tracking-widest text-ink-subtle uppercase"
          >
            {t('faqTitle')}
          </h2>
          <dl className="divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.id} id={`faq-${item.id}`} className="scroll-mt-28 py-6">
                <dt className="font-medium text-ink">{item.question[locale]}</dt>
                <dd className="mt-2 leading-relaxed text-ink-muted">{item.answer[locale]}</dd>
              </div>
            ))}
          </dl>
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
              Booking takes the primary slot once it opens a real calendar.
              Until then it opens WhatsApp with the request already written,
              which would make a plain WhatsApp button beside it the same link
              twice — so it stands in for that button, and the two only appear
              together when they lead to different places.
            */}
            {hasScheduler && <BookingButton variant="primary" />}
            <ButtonLink href="/contact" variant={hasScheduler ? 'secondary' : 'primary'}>
              {t('startHere')}
            </ButtonLink>
            {hasScheduler ? (
              <ButtonAnchor href={`https://wa.me/${owner.whatsapp.e164}`} variant="secondary">
                {t('whatsapp')}
              </ButtonAnchor>
            ) : (
              <BookingButton />
            )}
            <ButtonLink href="/work" variant="ghost">
              {work('allWork')}
            </ButtonLink>
          </div>
        </section>
      </div>

      <JsonLd
        data={graph(
          ...services.map((service) => serviceNode(locale, service)),
          faqNode(locale, faq),
          breadcrumbNode(locale, [
            { name: nav('home'), path: '' },
            { name: t('title'), path: '/services' },
          ]),
        )}
      />
    </main>
  );
}
