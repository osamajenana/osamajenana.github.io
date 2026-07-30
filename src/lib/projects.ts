import { diagrams } from '@/components/diagrams';
import { caseStudies } from '@/content/projects/case-studies';
import { projects } from '@/content/projects';

import type { Locale } from '@/i18n/routing';
import type { CaseStudy, Localized, Pillar, Project } from '@/lib/schemas';

/**
 * Query helpers over the project registry. Everything here is pure and runs at
 * build time — no data fetching, no caching needed.
 */

/** Reads the active locale out of any localized field. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale];
}

/** Anything with a featured slot, in explicit order. */
export function getFeatured(): Project[] {
  return projects
    .filter((p) => p.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity));
}

/**
 * Tiers 1 and 2 — everything that gets a card on /work. Featured projects lead
 * in their explicit order; the rest follow by recency. Sorting purely by date
 * would bury the flagship work behind whatever shipped most recently.
 */
export function getWorkGrid(): Project[] {
  const featured = getFeatured();
  const rest = projects
    .filter((p) => p.tier <= 2 && p.featuredOrder === undefined)
    .sort(byRecencyDesc);

  return [...featured.filter((p) => p.tier <= 2), ...rest];
}

/** Tier 3 — the archive list. */
export function getArchive(): Project[] {
  return projects.filter((p) => p.tier === 3).sort(byRecencyDesc);
}

export function getBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Slugs that have a case study page, for generateStaticParams. */
export function getCaseStudySlugs(): string[] {
  return projects.filter((p) => p.hasCaseStudy).map((p) => p.slug);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

/** Projects selected for the generated CV, in registry order. */
export function getCvProjects(): Project[] {
  return projects.filter((p) => p.onCv).sort(byRecencyDesc);
}

export function filterByPillar(list: Project[], pillar: Pillar | 'all'): Project[] {
  return pillar === 'all' ? list : list.filter((p) => p.pillars.includes(pillar));
}

/** Every distinct technology across tiers 1–2, ordered by how often it appears. */
export function getStackFrequency(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    for (const tech of p.stack) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Ongoing projects first, then by most recent end date, then start date. */
function byRecencyDesc(a: Project, b: Project): number {
  const aEnd = a.period.to ?? Infinity;
  const bEnd = b.period.to ?? Infinity;
  if (aEnd !== bEnd) return bEnd - aEnd;
  return b.period.from - a.period.from;
}

/** Formats a period as "2023 — Present" / "2023 — 2024" / "2024". */
export function formatPeriod(project: Project, presentLabel: string): string {
  const { from, to } = project.period;
  if (to === null) return `${from} — ${presentLabel}`;
  if (to === from) return String(from);
  return `${from} — ${to}`;
}

// --- integrity check --------------------------------------------------------

/**
 * The schema guarantees a tier-1 project claims a case study; this guarantees
 * the case study actually exists. Runs at module load, so a mismatch fails
 * `next build` rather than 404-ing in production.
 */
const missing = projects.filter((p) => p.hasCaseStudy && !caseStudies[p.slug]).map((p) => p.slug);

if (missing.length > 0) {
  throw new Error(
    `Projects claim hasCaseStudy but have no entry in content/projects/case-studies: ${missing.join(', ')}`,
  );
}

const orphaned = Object.keys(caseStudies).filter((slug) => !getBySlug(slug)?.hasCaseStudy);

if (orphaned.length > 0) {
  throw new Error(
    `Case studies exist for projects that do not claim one (set hasCaseStudy: true): ${orphaned.join(', ')}`,
  );
}

/** A `diagram` key that has no spec would render an empty box on a live page. */
const danglingDiagrams = [
  ...new Set([
    ...projects.map((p) => p.diagram),
    ...Object.values(caseStudies).map((study) => study.architecture.diagram),
  ]),
].filter((key): key is string => Boolean(key) && !diagrams[key as string]);

if (danglingDiagrams.length > 0) {
  throw new Error(
    `Diagram keys with no spec in components/diagrams: ${danglingDiagrams.join(', ')}`,
  );
}
