import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { BookingButton } from '@/components/ui/BookingButton';
import { ButtonLink } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import {
  getExpertise,
  getExpertiseBySlug,
  getProjectsFor,
  getRelatedExpertise,
  getSpan,
} from '@/lib/expertise';
import { formatPeriod } from '@/lib/projects';
import { breadcrumbNode, expertiseNodes, graph } from '@/lib/structured-data';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getExpertise().map((topic) => ({ locale, slug: topic.slug })),
  );
}

/** The registry is the whole list; an unknown slug is a 404, not a render. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = getExpertiseBySlug(slug);
  if (!topic) return {};

  return {
    // The job title rather than the page heading: it is the phrase the page is
    // looked for by, and the heading is one line below it in a result anyway.
    title: topic.role[locale],
    description: topic.lead[locale],
    alternates: {
      canonical: `/${locale}/expertise/${slug}`,
      languages: { en: `/en/expertise/${slug}`, ar: `/ar/expertise/${slug}` },
    },
    openGraph: {
      title: topic.title[locale],
      description: topic.lead[locale],
    },
  };
}

/**
 * One expertise topic: what it is, and the systems that prove it.
 *
 * The body is the project list on purpose. Each entry carries the summary that
 * was written for the project itself, so the page is made of things that were
 * true before it existed rather than of copy written to fill it.
 */
export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const topic = getExpertiseBySlug(slug);
  if (!topic) notFound();

  const t = await getTranslations('expertise');
  const nav = await getTranslations('nav');
  const work = await getTranslations('work');
  const services = await getTranslations('services');
  const common = await getTranslations('common');

  const list = getProjectsFor(topic);
  const related = getRelatedExpertise(topic);
  const span = getSpan(list);
  const years = `${span.from} — ${span.to ?? common('present')}`;

  return (
    <main id="main">
      <PageHeader
        eyebrow={`${t('count', { count: list.length })} · ${years}`}
        title={topic.title[locale]}
        lead={topic.lead[locale]}
      />

      {/* Top padding because this opens on a small label, which reads as part
          of the masthead's rule if it sits directly under it. */}
      <div className="container-page space-y-20 pt-12 pb-24 sm:pt-16">
        <section aria-labelledby="systems-heading">
          <h2 id="systems-heading" className="eyebrow mb-8">
            {t('systems')}
          </h2>

          <ul className="divide-y divide-line border-y border-line">
            {list.map((project) => (
              <li
                key={project.slug}
                className="flex flex-col gap-3 py-7 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <span className="nums w-32 shrink-0 text-sm text-ink-subtle">
                  {formatPeriod(project, common('present'))}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-ink">
                    {project.hasCaseStudy ? (
                      <Link href={`/work/${project.slug}`} className="hover:text-brand">
                        {project.name[locale]}
                      </Link>
                    ) : (
                      project.name[locale]
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-ink">{project.tagline[locale]}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
                    {project.summary[locale]}
                  </p>
                  {/* Stated per project, because it differs: some of these were
                      built alone and some as one engineer on a team. */}
                  <p className="mt-3 text-xs text-ink-subtle">
                    {work('role')}: {project.role[locale]}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <Tag key={tech} mono tone="muted">
                        {tech}
                      </Tag>
                    ))}
                  </div>

                  {project.hasCaseStudy && (
                    <Link
                      href={`/work/${project.slug}`}
                      className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-strong"
                    >
                      {work('viewCase')}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <nav aria-labelledby="related-heading">
            <h2 id="related-heading" className="eyebrow mb-6">
              {t('related')}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/expertise/${other.slug}`}
                    className="inline-flex rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink shadow-sm transition-[border-color,background-color] hover:border-line-strong hover:bg-raised"
                  >
                    {other.title[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/expertise"
                  className="inline-flex rounded-pill px-4 py-2 text-sm text-ink-muted transition-colors hover:bg-raised hover:text-ink"
                >
                  {t('all')}
                </Link>
              </li>
            </ul>
          </nav>
        )}

        <section
          aria-labelledby="expertise-cta"
          className="rounded-panel border border-line p-8 sm:p-10"
        >
          <h2 id="expertise-cta" className="text-xl font-semibold tracking-tight text-ink">
            {services('ctaTitle')}
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-muted">{services('ctaBody')}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact">{services('startHere')}</ButtonLink>
            <BookingButton />
            <ButtonLink href="/work" variant="ghost">
              {work('allWork')}
            </ButtonLink>
          </div>
        </section>
      </div>

      <JsonLd
        data={graph(
          ...expertiseNodes(locale, topic, list),
          breadcrumbNode(locale, [
            { name: nav('home'), path: '' },
            { name: t('title'), path: '/expertise' },
            { name: topic.title[locale], path: `/expertise/${topic.slug}` },
          ]),
        )}
      />
    </main>
  );
}
