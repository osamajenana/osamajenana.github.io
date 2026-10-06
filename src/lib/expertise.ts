import { expertise } from '@/content/expertise';
import type { Expertise } from '@/content/expertise';
import { projects } from '@/content/projects';
import type { Project } from '@/lib/schemas';

/**
 * Queries joining the expertise topics to the project registry. Pure, and run
 * at build time — every page that calls these is statically generated.
 */

export function getExpertise(): Expertise[] {
  return expertise;
}

export function getExpertiseBySlug(slug: string): Expertise | undefined {
  return expertise.find((topic) => topic.slug === slug);
}

function belongs(topic: Expertise, project: Project): boolean {
  return (
    topic.also?.includes(project.slug) === true ||
    project.stack.some((tag) => topic.tags.some((pattern) => pattern.test(tag)))
  );
}

/**
 * The projects that back a topic: written-up ones first, then the most recent.
 * Ordering by date alone would open a page on whichever small job shipped
 * last rather than on the system that makes the case.
 */
export function getProjectsFor(topic: Expertise): Project[] {
  return projects
    .filter((project) => belongs(topic, project))
    .sort(
      (a, b) =>
        a.tier - b.tier ||
        (b.period.to ?? Infinity) - (a.period.to ?? Infinity) ||
        b.period.from - a.period.from,
    );
}

/** Topics a project is evidence for — the reverse lookup, for cross-links. */
export function getExpertiseFor(project: Project): Expertise[] {
  return expertise.filter((topic) => belongs(topic, project));
}

/**
 * Other topics that share at least one project with this one, most overlap
 * first. Related by evidence rather than by a hand-kept list, so it cannot
 * point at a topic that has since lost the project connecting them.
 */
export function getRelatedExpertise(topic: Expertise, limit = 5): Expertise[] {
  const own = new Set(getProjectsFor(topic).map((project) => project.slug));

  return expertise
    .filter((other) => other.slug !== topic.slug)
    .map((other) => ({
      other,
      shared: getProjectsFor(other).filter((project) => own.has(project.slug)).length,
    }))
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((entry) => entry.other);
}

/** First and last year a topic's projects cover. `to: null` means still running. */
export function getSpan(list: Project[]): { from: number; to: number | null } {
  const from = Math.min(...list.map((project) => project.period.from));
  const ongoing = list.some((project) => project.period.to === null);
  const to = ongoing ? null : Math.max(...list.map((project) => project.period.to ?? from));

  return { from, to };
}
