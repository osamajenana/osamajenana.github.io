import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getExpertise, getProjectsFor } from '@/lib/expertise';
import { breadcrumbNode, graph } from '@/lib/structured-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'expertise' });

  return {
    title: t('metaTitle'),
    description: t('lead'),
    alternates: {
      canonical: `/${locale}/expertise`,
      languages: { en: '/en/expertise', ar: '/ar/expertise' },
    },
  };
}

/**
 * The index of expertise topics.
 *
 * Ordered by how much work stands behind each one, so the page opens on what
 * has been done most rather than on whatever was added to the registry last.
 */
export default async function ExpertiseIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('expertise');
  const nav = await getTranslations('nav');

  const topics = getExpertise()
    .map((topic) => ({ topic, count: getProjectsFor(topic).length }))
    .sort((a, b) => b.count - a.count);

  return (
    <main id="main">
      <PageHeader title={t('title')} lead={t('lead')} />

      <section className="container-page pb-24">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map(({ topic, count }, index) => (
            <Reveal as="li" key={topic.slug} delay={Math.min(index, 5) * 0.05}>
              <Link
                href={`/expertise/${topic.slug}`}
                className="panel lift group flex h-full flex-col p-6"
              >
                <span className="nums self-start rounded-pill border border-line bg-canvas px-2.5 py-1 text-[11px] text-ink-subtle">
                  {t('count', { count })}
                </span>
                <h2 className="mt-6 text-lg font-semibold tracking-tight text-ink">
                  {topic.title[locale]}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{topic.lead[locale]}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <JsonLd
        data={graph(
          breadcrumbNode(locale, [
            { name: nav('home'), path: '' },
            { name: t('title'), path: '/expertise' },
          ]),
        )}
      />
    </main>
  );
}
