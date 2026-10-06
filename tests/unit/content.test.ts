import { describe, expect, it } from 'vitest';

import { diagrams } from '@/components/diagrams';
import { posts } from '@/content/posts';
import { projects } from '@/content/projects';
import { caseStudies } from '@/content/projects/case-studies';
import { resume } from '@/content/resume';
import { services } from '@/content/services';
import { owner, ownerName, socials } from '@/content/site';
import ar from '@/i18n/messages/ar.json';
import en from '@/i18n/messages/en.json';
import { bookingHref, hasScheduler } from '@/lib/booking';
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

describe('identity', () => {
  /**
   * The name exists in two scripts and neither can be derived from the other,
   * so each form is written out by hand in content/site.ts. These hold the
   * hand-written copies to one another.
   */
  it('spells the name one way per script, however it is split', () => {
    for (const locale of ['en', 'ar'] as const) {
      const { first, last } = owner.displayName[locale];

      expect(ownerName.short[locale]).toBe(`${first} ${last}`);
      expect(ownerName.full[locale].startsWith(`${first} `)).toBe(true);
      expect(ownerName.full[locale].endsWith(` ${last}`)).toBe(true);
    }
  });

  it('never carries one script in the other one’s slot', () => {
    // A Latin string left in the Arabic slot is how an Arabic spelling goes
    // missing from a page without anything failing.
    for (const form of ['full', 'short'] as const) {
      expect(ownerName[form].ar).toMatch(/^[؀-ۿ ]+$/);
      expect(ownerName[form].en).toMatch(/^[A-Za-z ]+$/);
    }
  });

  it('puts both spellings in the home page title of both locales', () => {
    // The title is the first line of the page an assistant is handed, and the
    // one field every reader of the page keeps.
    for (const catalogue of [en, ar]) {
      expect(catalogue.meta.titleDefault).toContain(ownerName.short.en);
      expect(catalogue.meta.titleDefault).toContain(ownerName.short.ar);
    }
  });

  it('gives the résumé the same name as the rest of the site', () => {
    expect(resume.name).toEqual(ownerName.full);
  });
});

describe('experience', () => {
  /**
   * How long and how much are each stated in several places — the hero, the
   * About stats, the CV profile, the page description, the social card — and
   * they had drifted: six years in one, seven in another, 28 systems against
   * 40+. Both now come from `owner`, and these keep the hand-written copy in
   * the catalogues agreeing with it.
   */
  it('counts the years from one start year', () => {
    expect(owner.yearsExperience).toBe(new Date().getFullYear() - owner.since);
    expect(resume.profile.en).toContain(`${owner.yearsExperience} years`);
    expect(resume.profile.en).not.toMatch(/\b(six|6) years\b/i);
  });

  it('states one number of shipped systems', () => {
    const claim = `${owner.systemsShipped}+`;

    for (const text of [resume.profile.en, en.meta.description, en.work.lead]) {
      expect(text).toContain(claim);
    }
    for (const text of [ar.meta.description, ar.work.lead]) {
      expect(text).toContain(`أكثر من ${owner.systemsShipped}`);
    }
  });

  it('adds up on the CV, which lists a few and points at the rest', () => {
    const rest = `${owner.systemsShipped - resume.selectedProjects.length}+`;

    expect(en.cv.moreOnSite).toContain(rest);
    expect(ar.cv.moreOnSite).toContain(rest);
  });
});

describe('profiles', () => {
  it('link to real addresses on the services they name', () => {
    expect(new URL(socials.github).hostname).toBe('github.com');
    expect(new URL(socials.x).hostname).toBe('x.com');
    if (socials.linkedin) {
      expect(socials.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\/[a-z0-9-]+\/$/);
    }
  });
});

describe('booking', () => {
  it('leads to an absolute https destination', () => {
    const message = 'مرحباً أسامة، أرغب في حجز استشارة.';
    const url = new URL(bookingHref(message));

    expect(url.protocol).toBe('https:');

    if (hasScheduler) {
      expect(url.hostname).toBe('cal.com');
    } else {
      // The fallback: a chat with the account's own digits, opened with the
      // visitor's sentence intact — Arabic, comma and full stop included.
      expect(url.hostname).toBe('wa.me');
      expect(url.pathname).toBe(`/${owner.whatsapp.e164}`);
      expect(url.searchParams.get('text')).toBe(message);
    }
  });

  it('has a label and an opening message in both locales', () => {
    for (const catalogue of [en, ar]) {
      expect(catalogue.booking.cta.trim()).not.toBe('');
      expect(catalogue.booking.whatsappMessage.trim()).not.toBe('');
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
