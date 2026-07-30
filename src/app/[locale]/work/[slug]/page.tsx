import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ArchDiagram } from '@/components/diagrams/ArchDiagram';
import { getDiagram } from '@/components/diagrams';
import { ButtonAnchor } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { StatusDot, Tag } from '@/components/ui/Tag';
import { pillars as pillarConfig } from '@/content/site';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import {
  formatPeriod,
  getBySlug,
  getCaseStudy,
  getCaseStudySlugs,
  getFeatured,
} from '@/lib/projects';
import type { LocalizedProse, ProjectStatus } from '@/lib/schemas';

const statusKey: Record<ProjectStatus, string> = {
  live: 'statusLive',
  shipped: 'statusShipped',
  internal: 'statusInternal',
  wip: 'statusWip',
  archived: 'statusArchived',
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCaseStudySlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getBySlug(slug);
  if (!project) return {};

  return {
    title: project.name[locale],
    description: project.tagline[locale],
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: { en: `/en/work/${slug}`, ar: `/ar/work/${slug}` },
    },
    openGraph: {
      type: 'article',
      title: project.name[locale],
      description: project.tagline[locale],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getBySlug(slug);
  const study = getCaseStudy(slug);
  if (!project || !study) notFound();

  const t = await getTranslations('work');
  const cs = await getTranslations('caseStudy');
  const common = await getTranslations('common');

  // The case study's own key wins; the project's is the fallback.
  const diagram = getDiagram(study.architecture.diagram ?? project.diagram);

  const featured = getFeatured().filter((p) => p.hasCaseStudy);
  const currentIndex = featured.findIndex((p) => p.slug === slug);
  const next = featured[(currentIndex + 1) % featured.length];

  return (
    <main id="main">
      {/* ---- masthead ---- */}
      <header className="container-page pt-32 pb-16 sm:pt-40">
        <Link
          href="/work"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <span aria-hidden className="rtl:-scale-x-100">
            ←
          </span>
          {t('allWork')}
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {project.pillars.map((pillar) => (
            <Tag key={pillar} tone={pillarConfig[pillar].accent === 'ai' ? 'ai' : 'brand'}>
              {pillarConfig[pillar].label[locale]}
            </Tag>
          ))}
          <span className="flex items-center gap-2 font-mono text-[11px] text-ink-subtle">
            <StatusDot tone={project.status === 'live' ? 'live' : 'active'} />
            {t(statusKey[project.status])}
          </span>
        </div>

        <h1 className="mt-6 max-w-4xl text-display-sm font-semibold tracking-tight text-ink">
          {project.name[locale]}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          {project.tagline[locale]}
        </p>

        <dl className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
          <Meta label={t('role')} value={project.role[locale]} />
          <Meta label={t('period')} value={formatPeriod(project, common('present'))} mono />
          <Meta
            label={t('stack')}
            value={project.stack.join(' · ')}
            mono
            className="sm:col-span-1"
          />
        </dl>

        {project.liveUrl && (
          <div className="mt-8">
            <ButtonAnchor href={project.liveUrl} variant="secondary" size="sm">
              {t('viewLive')}
              <span aria-hidden>↗</span>
            </ButtonAnchor>
          </div>
        )}
      </header>

      {/* ---- metrics band ---- */}
      {project.metrics.length > 0 && (
        <section aria-labelledby="metrics-heading" className="border-y border-line bg-surface">
          <div className="container-page py-12">
            <h2 id="metrics-heading" className="sr-only">
              {cs('metrics')}
            </h2>
            <dl className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.label.en}>
                  <dd className="nums text-3xl font-semibold text-ink sm:text-4xl">
                    {metric.value}
                  </dd>
                  <dt className="mt-1.5 text-sm text-ink-muted">{metric.label[locale]}</dt>
                  {metric.hint && (
                    <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
                      {metric.hint[locale]}
                    </p>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ---- narrative ---- */}
      <div className="container-page grid gap-16 py-20 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div className="min-w-0 space-y-20">
          <Section id="problem" title={cs('problem')}>
            <Prose prose={study.problem} locale={locale} />
          </Section>

          <Section id="constraints" title={cs('constraints')}>
            <ul className="space-y-4">
              {study.constraints.map((constraint) => (
                <li key={constraint.en} className="flex gap-4">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-heat" />
                  <span className="leading-relaxed text-ink-muted">{constraint[locale]}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="architecture" title={cs('architecture')}>
            <Prose prose={study.architecture.summary} locale={locale} />

            {diagram && (
              <ArchDiagram
                spec={diagram}
                locale={locale}
                className="mt-10 rounded-panel border border-line bg-surface p-5 sm:p-7"
              />
            )}

            <ul className="mt-10 divide-y divide-line rounded-panel border border-line">
              {study.architecture.layers.map((layer) => (
                <li key={layer.name} className="flex flex-col gap-1.5 p-5 sm:flex-row sm:gap-6">
                  <span className="w-56 shrink-0 font-mono text-sm text-ink">{layer.name}</span>
                  <span className="text-sm leading-relaxed text-ink-muted">
                    {layer.role[locale]}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="decisions" title={cs('decisions')}>
            <div className="space-y-6">
              {study.decisions.map((decision) => (
                <Reveal
                  as="article"
                  key={decision.title.en}
                  className="rounded-panel border border-line bg-surface p-6 sm:p-7"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-ink">
                    {decision.title[locale]}
                  </h3>

                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                    <span className="text-ink-subtle">{cs('chose')}</span>
                    <Tag tone="ai" mono>
                      {decision.chose}
                    </Tag>
                    <span className="text-ink-subtle">{cs('over')}</span>
                    <Tag tone="muted" mono className="line-through decoration-ink-subtle/50">
                      {decision.over}
                    </Tag>
                  </div>

                  <div className="mt-5 border-t border-line pt-5">
                    <Prose prose={decision.because} locale={locale} size="sm" />
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          <Section id="outcome" title={cs('outcome')}>
            <Prose prose={study.outcome} locale={locale} />
          </Section>

          {study.lessons.length > 0 && (
            <Section id="lessons" title={cs('lessons')}>
              <ul className="space-y-5">
                {study.lessons.map((lesson, index) => (
                  <li key={lesson.en} className="flex gap-4">
                    <span className="nums mt-0.5 shrink-0 text-sm text-ink-subtle">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-relaxed text-ink">{lesson[locale]}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* ---- sticky contents ---- */}
        <aside className="hidden lg:block">
          <nav aria-label={cs('contents')} className="sticky top-28 space-y-3">
            <p className="font-mono text-xs tracking-widest text-ink-subtle uppercase">
              {cs('contents')}
            </p>
            <ul className="space-y-2 border-s border-line ps-4">
              {(
                [
                  ['problem', cs('problem')],
                  ['constraints', cs('constraints')],
                  ['architecture', cs('architecture')],
                  ['decisions', cs('decisions')],
                  ['outcome', cs('outcome')],
                  ...(study.lessons.length > 0 ? [['lessons', cs('lessons')] as const] : []),
                ] as const
              ).map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-sm text-ink-muted hover:text-ink">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      {/* ---- next case study ---- */}
      {next && next.slug !== slug && (
        <section className="border-t border-line">
          <Link href={`/work/${next.slug}`} className="group block">
            <div className="container-page flex flex-col gap-2 py-16 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              <span className="font-mono text-xs tracking-widest text-ink-subtle uppercase">
                {cs('next')}
              </span>
              <span className="text-display-sm font-semibold tracking-tight text-ink">
                {next.name[locale]}
              </span>
              <span className="text-ink-muted">{next.tagline[locale]}</span>
            </div>
          </Link>
        </section>
      )}
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <h2
        id={`${id}-heading`}
        className="mb-6 font-mono text-xs tracking-widest text-ink-subtle uppercase"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Prose({
  prose,
  locale,
  size = 'base',
}: {
  prose: LocalizedProse;
  locale: Locale;
  size?: 'base' | 'sm';
}) {
  return (
    <div className={size === 'sm' ? 'space-y-3' : 'space-y-5'}>
      {prose[locale].map((paragraph, index) => (
        <p
          key={index}
          className={
            size === 'sm'
              ? 'text-sm leading-relaxed text-ink-muted'
              : 'text-[1.0625rem] leading-[1.75] text-ink-muted'
          }
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Meta({
  label,
  value,
  mono = false,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="font-mono text-xs tracking-widest text-ink-subtle uppercase">{label}</dt>
      <dd className={`mt-2 text-sm leading-relaxed text-ink ${mono ? 'font-mono' : ''}`}>
        {value}
      </dd>
    </div>
  );
}
