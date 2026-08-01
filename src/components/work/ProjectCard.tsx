import { getTranslations } from 'next-intl/server';

import { ArchDiagram } from '@/components/diagrams/ArchDiagram';
import { getDiagram } from '@/components/diagrams';
import { MetricList } from '@/components/ui/MetricList';
import { StatusDot, Tag } from '@/components/ui/Tag';
import { domainOf, ProjectCover } from '@/components/work/ProjectCover';
import { pillars as pillarConfig } from '@/content/site';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatPeriod } from '@/lib/projects';
import type { Project, ProjectStatus } from '@/lib/schemas';
import { cn } from '@/lib/utils';

const statusTone: Record<ProjectStatus, 'live' | 'active' | 'idle'> = {
  live: 'live',
  shipped: 'active',
  internal: 'active',
  wip: 'active',
  archived: 'idle',
};

const statusKey: Record<ProjectStatus, string> = {
  live: 'statusLive',
  shipped: 'statusShipped',
  internal: 'statusInternal',
  wip: 'statusWip',
  archived: 'statusArchived',
};

/**
 * One project card. The whole card is a single link when a case study exists —
 * nested interactive elements would break keyboard navigation, so external
 * links are surfaced on the detail page rather than inside the card.
 */
export async function ProjectCard({
  project,
  locale,
  featured = false,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  /** Featured cards get more vertical room and show metrics. */
  featured?: boolean;
  /** Passed to the cover so the first card above the fold loads eagerly. */
  priority?: boolean;
}) {
  const t = await getTranslations('work');
  const common = await getTranslations('common');

  const period = formatPeriod(project, common('present'));
  const linksToCaseStudy = project.hasCaseStudy;
  const visibleMetrics = featured ? project.metrics.slice(0, 3) : [];
  const diagram = getDiagram(project.diagram);

  const body = (
    <>
      {project.cover ? (
        <ProjectCover
          cover={project.cover}
          locale={locale}
          domain={domainOf(project.liveUrl)}
          priority={priority}
          className={cn('mb-6', featured ? 'sm:mb-7' : '')}
        />
      ) : (
        // No screenshot — either the client is withheld or, as with the WhatsApp
        // platform, there is no web UI to photograph. The architecture carries
        // the card instead. Only on featured cards: a diagram this dense is
        // unreadable in a half-width slot.
        featured &&
        diagram && (
          <div className="mb-6 min-w-0 overflow-hidden rounded-card border border-line bg-raised p-4 sm:mb-7 sm:p-6">
            <ArchDiagram spec={diagram} locale={locale} hideCaption />
          </div>
        )
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <h3
            className={cn(
              'font-semibold tracking-tight text-ink',
              featured ? 'text-xl sm:text-2xl' : 'text-lg',
            )}
          >
            {project.name[locale]}
          </h3>
          <p className="text-sm text-ink-muted">{project.tagline[locale]}</p>
        </div>

        <span className="flex shrink-0 items-center gap-2 pt-1 font-mono text-[11px] whitespace-nowrap text-ink-subtle">
          <StatusDot tone={statusTone[project.status]} />
          {t(statusKey[project.status])}
        </span>
      </div>

      <p className={cn('text-sm leading-relaxed text-ink-muted', featured ? 'mt-5' : 'mt-4')}>
        {featured ? project.summary[locale] : truncate(project.summary[locale], 180)}
      </p>

      {visibleMetrics.length > 0 && (
        <MetricList
          metrics={visibleMetrics.map(({ hint: _hint, ...rest }) => rest)}
          locale={locale}
          className="mt-6 grid-cols-2 border-t border-line pt-5 sm:grid-cols-3"
        />
      )}

      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        {project.pillars.map((pillar) => (
          <Tag key={pillar} tone={pillarConfig[pillar].accent === 'ai' ? 'ai' : 'brand'}>
            {pillarConfig[pillar].label[locale]}
          </Tag>
        ))}
        {project.stack.slice(0, featured ? 6 : 4).map((tech) => (
          <Tag key={tech} mono>
            {tech}
          </Tag>
        ))}
        {project.stack.length > (featured ? 6 : 4) && (
          <Tag tone="muted" mono>
            +{project.stack.length - (featured ? 6 : 4)}
          </Tag>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
        <span className="nums text-xs text-ink-subtle">{period}</span>
        {linksToCaseStudy ? (
          <span className="flex items-center gap-1.5 text-sm font-medium text-brand">
            {t('viewCase')}
            <Arrow />
          </span>
        ) : (
          project.visibility === 'anonymized' && (
            <span className="text-xs text-ink-subtle">{t('clientWithheld')}</span>
          )
        )}
      </div>
    </>
  );

  const shell = cn(
    'panel group flex h-full min-w-0 flex-col',
    featured ? 'p-7 sm:p-8' : 'p-6',
    linksToCaseStudy && 'lift',
  );

  if (linksToCaseStudy) {
    return (
      <Link href={`/work/${project.slug}`} className={shell}>
        {body}
      </Link>
    );
  }

  return <article className={shell}>{body}</article>;
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}
