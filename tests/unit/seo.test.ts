import { describe, expect, it } from 'vitest';

import { expertise } from '@/content/expertise';
import { faq } from '@/content/faq';
import { posts } from '@/content/posts';
import { projects } from '@/content/projects';
import { caseStudies } from '@/content/projects/case-studies';
import { resume } from '@/content/resume';
import { services } from '@/content/services';
import { owner, ownerName, pillars, seoKeywords } from '@/content/site';
import ar from '@/i18n/messages/ar.json';
import en from '@/i18n/messages/en.json';
import { getExpertiseFor, getProjectsFor, getRelatedExpertise } from '@/lib/expertise';
import { buildLlmsFull, buildLlmsIndex } from '@/lib/llms';
import {
  caseStudyNode,
  expertiseNodes,
  faqNode,
  knownTopics,
  PERSON_ID,
  personNode,
  postNode,
  profilePageNode,
  serviceNode,
  WEBSITE_ID,
  websiteNode,
} from '@/lib/structured-data';

/**
 * What the site tells a search engine or an assistant about itself: the
 * expertise pages, the structured data and the two llms files. All of it is
 * derived from the content registries, and these tests hold the derivation to
 * the two promises it makes — every claim has projects behind it, and nothing
 * published states a place.
 */

const LOCALES = ['en', 'ar'] as const;

/** Every string reachable from a value. Patterns are matchers, not content. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (value instanceof RegExp) return out;
  else if (Array.isArray(value)) for (const item of value) strings(item, out);
  else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) strings(item, out);
  }
  return out;
}

describe('expertise topics', () => {
  it('have unique, URL-safe slugs', () => {
    const slugs = expertise.map((topic) => topic.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  /**
   * The rule that keeps these pages honest. A topic with one project behind it
   * is an anecdote, and one with none is a claim — neither earns a page.
   */
  it('are each backed by at least two projects', () => {
    const thin = expertise
      .map((topic) => `${topic.slug}: ${getProjectsFor(topic).length}`)
      .filter((entry) => Number(entry.split(': ')[1]) < 2);

    expect(thin).toEqual([]);
  });

  it('name only projects that exist', () => {
    const known = new Set(projects.map((project) => project.slug));
    const unknown = expertise.flatMap((topic) =>
      (topic.also ?? []).filter((slug) => !known.has(slug)).map((slug) => `${topic.slug}: ${slug}`),
    );

    expect(unknown).toEqual([]);
  });

  it('carry no pattern that has stopped matching anything', () => {
    // A stack tag gets renamed in the registry and the pattern quietly matches
    // nothing; the page keeps rendering, a project short.
    const tags = projects.flatMap((project) => project.stack);
    const dead = expertise.flatMap((topic) =>
      topic.tags
        .filter((pattern) => !tags.some((tag) => pattern.test(tag)))
        .map((pattern) => `${topic.slug}: ${pattern}`),
    );

    expect(dead).toEqual([]);
  });

  it('are written in both languages, and not the same text twice', () => {
    for (const topic of expertise) {
      for (const field of ['title', 'role', 'lead'] as const) {
        expect(topic[field].en.trim(), `${topic.slug}.${field}.en`).not.toBe('');
        expect(topic[field].ar.trim(), `${topic.slug}.${field}.ar`).not.toBe('');
        expect(topic[field].ar, `${topic.slug}.${field} is untranslated`).not.toBe(topic[field].en);
      }
    }
  });

  it('link to one another only through shared projects', () => {
    for (const topic of expertise) {
      const own = new Set(getProjectsFor(topic).map((project) => project.slug));

      for (const other of getRelatedExpertise(topic)) {
        expect(other.slug).not.toBe(topic.slug);
        expect(getProjectsFor(other).some((project) => own.has(project.slug))).toBe(true);
      }
    }
  });

  it('agree with the reverse lookup', () => {
    for (const project of projects) {
      for (const topic of getExpertiseFor(project)) {
        expect(getProjectsFor(topic)).toContain(project);
      }
    }
  });
});

describe('questions and answers', () => {
  it('have unique ids and both languages', () => {
    const ids = faq.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of faq) {
      for (const locale of LOCALES) {
        expect(item.question[locale].trim(), `${item.id} question (${locale})`).not.toBe('');
        expect(item.answer[locale].trim(), `${item.id} answer (${locale})`).not.toBe('');
      }
    }
  });
});

describe('structured data', () => {
  it('gives the person no place', () => {
    for (const locale of LOCALES) {
      const node = personNode(locale);

      for (const key of [
        'address',
        'location',
        'workLocation',
        'homeLocation',
        'birthPlace',
        'nationality',
      ]) {
        expect(node, `Person.${key}`).not.toHaveProperty(key);
      }
    }
  });

  it('states both spellings of the name', () => {
    expect(personNode('en').alternateName).toEqual(
      expect.arrayContaining([ownerName.short.en, ownerName.full.ar, ownerName.short.ar]),
    );
  });

  it('lists what the person works with, once each', () => {
    const topics = knownTopics();

    expect(topics.length).toBeGreaterThan(20);
    expect(new Set(topics).size).toBe(topics.length);
    // Every expertise page is represented, so no topic exists only as a URL.
    for (const topic of expertise) expect(topics).toContain(topic.title.en);
  });

  /**
   * Page nodes point at the person and the website by `@id` instead of
   * restating them. A reference to an id that no node defines is a dangling
   * pointer a validator reports and a crawler silently drops.
   */
  it('references only ids that are defined', () => {
    const [firstService] = services;
    const [firstPost] = posts;
    const withStudy = projects.find((project) => project.hasCaseStudy);
    if (!firstService || !firstPost || !withStudy) throw new Error('registries are empty');

    for (const locale of LOCALES) {
      const nodes = [
        personNode(locale),
        websiteNode(),
        profilePageNode(locale),
        serviceNode(locale, firstService),
        faqNode(locale, faq),
        caseStudyNode(locale, withStudy),
        postNode(locale, firstPost),
        ...expertise.flatMap((topic) => expertiseNodes(locale, topic, getProjectsFor(topic))),
      ];

      const defined = new Set([PERSON_ID, WEBSITE_ID]);
      const referenced: string[] = [];

      const walk = (value: unknown) => {
        if (Array.isArray(value)) return value.forEach(walk);
        if (!value || typeof value !== 'object') return;

        const node = value as Record<string, unknown>;
        const id = node['@id'];
        if (typeof id === 'string') {
          // A bare `{ "@id": … }` is a reference; anything more is a definition.
          if (Object.keys(node).length === 1) referenced.push(id);
          else defined.add(id);
        }
        Object.values(node).forEach(walk);
      };
      nodes.forEach(walk);

      expect(referenced.filter((id) => !defined.has(id))).toEqual([]);
    }
  });
});

describe('llms files', () => {
  const index = buildLlmsIndex();
  const full = buildLlmsFull();

  it('open on the name in both scripts', () => {
    for (const body of [index, full]) {
      expect(body.startsWith(`# ${ownerName.short.en} (${ownerName.short.ar})`)).toBe(true);
      expect(body).toContain(ownerName.full.ar);
    }
  });

  it('index every expertise page', () => {
    for (const topic of expertise) {
      expect(index).toContain(`/expertise/${topic.slug})`);
      expect(full).toContain(`### ${topic.title.en}`);
    }
  });

  it('carry every project in the full document', () => {
    for (const project of projects) expect(full).toContain(`### ${project.name.en}`);
  });

  it('never double a full stop where two fields were joined', () => {
    expect(index).not.toMatch(/\.\.(?!\.)/);
    expect(full).not.toMatch(/\.\.(?!\.)/);
  });
});

describe('location', () => {
  /**
   * The site is positioned as remote and worldwide, and publishes no place: the
   * owner works wherever the client is. That holds for everything a reader or a
   * crawler can reach — page copy, the CV data, structured data, the llms
   * files — and it is the kind of rule a single careless sentence breaks, so
   * the whole content layer is scanned rather than one field of it.
   */
  const PLACES = [/palestin/i, /gaza/i, /فلسطين/, /غز[ةه]/];

  const sources: Record<string, unknown> = {
    'messages (en)': en,
    'messages (ar)': ar,
    owner,
    pillars,
    seoKeywords,
    resume,
    services,
    projects,
    caseStudies,
    posts,
    expertise,
    faq,
    'llms.txt': buildLlmsIndex(),
    'llms-full.txt': buildLlmsFull(),
    'Person node (en)': personNode('en'),
    'Person node (ar)': personNode('ar'),
  };

  it('is named nowhere in the content', () => {
    const found = Object.entries(sources).flatMap(([name, source]) =>
      strings(source)
        .filter((text) => PLACES.some((place) => place.test(text)))
        .map((text) => `${name}: ${text.slice(0, 90)}`),
    );

    expect(found).toEqual([]);
  });
});
