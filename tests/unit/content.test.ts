import { describe, expect, it } from 'vitest';

import { diagrams } from '@/components/diagrams';
import { posts } from '@/content/posts';
import { projects } from '@/content/projects';
import { caseStudies } from '@/content/projects/case-studies';
import { resume } from '@/content/resume';
import { services } from '@/content/services';
import { getBySlug, getFeatured, getWorkGrid } from '@/lib/projects';

/**
 * The Zod schemas already run at import time, so simply loading these modules
 * proves the content parses. These tests cover the invariants a schema cannot
 * express — the cross-references between registries, and the promises this site
 * makes to the people reading it.
 */

describe('project registry', () => {
  it('loads and is not empty', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('never lists the same client site twice', () => {
    // The 'al-shara-store' and 'dates-commerce-erp' entries turned out to be one
    // client; a duplicate here inflates the portfolio dishonestly.
    const urls = projects.map((p) => p.liveUrl).filter((url): url is string => Boolean(url));
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('never exposes a URL for an anonymized client', () => {
    const leaking = projects
      .filter((p) => p.visibility === 'anonymized' && (p.liveUrl || p.repoUrl))
      .map((p) => p.slug);

    expect(leaking).toEqual([]);
  });

  it('gives every tier-1 project a written case study', () => {
    const missing = projects.filter((p) => p.tier === 1 && !caseStudies[p.slug]).map((p) => p.slug);

    expect(missing).toEqual([]);
  });

  it('references only diagrams that exist', () => {
    const dangling = projects
      .map((p) => p.diagram)
      .filter((key): key is string => typeof key === 'string' && !diagrams[key]);

    expect(dangling).toEqual([]);
  });

  it('orders the featured grid ahead of the rest', () => {
    const grid = getWorkGrid();
    const featuredCount = getFeatured().filter((p) => p.tier <= 2).length;
    const leading = grid.slice(0, featuredCount);

    expect(leading.every((p) => p.featuredOrder !== undefined)).toBe(true);
  });

  it('states a period that has not finished before it started', () => {
    const invalid = projects
      .filter((p) => p.period.to !== null && p.period.to < p.period.from)
      .map((p) => p.slug);

    expect(invalid).toEqual([]);
  });
});

describe('case studies', () => {
  it('name at least one real trade-off each', () => {
    for (const [slug, study] of Object.entries(caseStudies)) {
      expect(study.decisions.length, `${slug} has no design decisions`).toBeGreaterThan(0);

      for (const decision of study.decisions) {
        expect(decision.chose, `${slug}: a decision has no chosen option`).toBeTruthy();
        expect(decision.over, `${slug}: a decision has no rejected option`).toBeTruthy();
        expect(decision.chose).not.toBe(decision.over);
      }
    }
  });

  it('belong to a project that claims one', () => {
    const orphans = Object.keys(caseStudies).filter((slug) => !getBySlug(slug)?.hasCaseStudy);
    expect(orphans).toEqual([]);
  });
});

describe('résumé', () => {
  it('selects projects that exist in the registry', () => {
    const unknown = resume.selectedProjects.filter((slug) => !getBySlug(slug));
    expect(unknown).toEqual([]);
  });

  it('selects only projects flagged for the CV', () => {
    const notFlagged = resume.selectedProjects.filter((slug) => !getBySlug(slug)?.onCv);
    expect(notFlagged).toEqual([]);
  });

  it('publishes no country, matching the remote-only positioning', () => {
    const countries = ['Oman', 'Palestine', 'عمان', 'فلسطين'];
    const location = `${resume.location.en} ${resume.location.ar}`;
    for (const country of countries) {
      expect(location).not.toContain(country);
    }
  });
});

describe('services', () => {
  it('point at a real project as proof', () => {
    const unknown = services.filter((service) => !getBySlug(service.proofSlug));
    expect(unknown).toEqual([]);
  });

  it('promise concrete deliverables', () => {
    for (const service of services) {
      expect(service.deliverables.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('posts', () => {
  it('reference projects that exist', () => {
    const unknown = posts
      .map((entry) => entry.relatedProject)
      .filter((slug): slug is string => typeof slug === 'string' && !getBySlug(slug));

    expect(unknown).toEqual([]);
  });

  it('are dated no later than today', () => {
    const today = new Date().toISOString().slice(0, 10);
    const future = posts.filter((entry) => entry.publishedAt > today).map((entry) => entry.slug);

    expect(future).toEqual([]);
  });
});
