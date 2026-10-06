import { expertise } from '@/content/expertise';
import type { Expertise } from '@/content/expertise';
import type { Faq } from '@/content/faq';
import { resume, RESUME_UPDATED } from '@/content/resume';
import type { Service } from '@/content/services';
import { owner, pillars, SITE_URL, socials } from '@/content/site';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import type { Post, Project } from '@/lib/schemas';

/**
 * schema.org nodes for the site's JSON-LD.
 *
 * One person and one website, each with a stable `@id`, and every other node —
 * a service, a case study, a post — pointing back at them by reference. That is
 * what lets a crawler read thirty pages and come away with one entity rather
 * than thirty near-duplicates of it.
 *
 * Two rules hold for everything built here:
 *
 *  - Nothing is stated that the page does not also show. Structured data that
 *    says more than the visible text is the kind search engines discount.
 *  - No node carries a place. There is no `address`, no `workLocation`, no
 *    `nationality`; where a service area is required it is "Worldwide". The site
 *    publishes no location and its metadata must not be the exception.
 */

export type JsonLdNode = Record<string, unknown>;

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const person = { '@id': PERSON_ID };
const website = { '@id': WEBSITE_ID };

/** Absolute URL of a localized route. `path` is '' or starts with a slash. */
export function pageUrl(locale: Locale, path = ''): string {
  return `${SITE_URL}/${locale}${path}`;
}

/** Several nodes as one document, so they can reference each other by `@id`. */
export function graph(...nodes: JsonLdNode[]): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/**
 * Everything the owner demonstrably works with: the CV's skill groups, then the
 * expertise topics as phrases. This is the honest home for a long keyword list
 * — `knowsAbout` exists to be one, and every entry is backed by a page.
 */
export function knownTopics(): string[] {
  const skills = resume.skills.flatMap((group) => group.items);
  const topics = expertise.map((topic) => topic.title.en);

  return [...new Set([...skills, ...topics])];
}

export function personNode(locale: Locale): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: owner.fullName,
    // The Arabic spellings as well as the short Latin one: the machine-readable
    // statement that these are one person's name. See `owner.arabicName`.
    alternateName: [owner.shortName, owner.arabicName.full, owner.arabicName.short],
    givenName: owner.displayName.en.first,
    familyName: owner.displayName.en.last,
    url: SITE_URL,
    image: `${SITE_URL}/me/portrait-1280.jpg`,
    email: `mailto:${owner.email}`,
    jobTitle: owner.role.en,
    description: resume.profile[locale],
    knowsAbout: knownTopics(),
    knowsLanguage: [...routing.locales],
    sameAs: [socials.github, socials.githubOrg, socials.x, socials.linkedin].filter(
      (link): link is string => Boolean(link),
    ),
  };
}

export function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: owner.shortName,
    alternateName: [owner.arabicName.short, new URL(SITE_URL).host],
    inLanguage: [...routing.locales],
    publisher: person,
  };
}

/** The home page: a page whose subject is the person. */
export function profilePageNode(locale: Locale): JsonLdNode {
  const url = pageUrl(locale);

  return {
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    inLanguage: locale,
    isPartOf: website,
    mainEntity: person,
    dateModified: RESUME_UPDATED,
  };
}

export function breadcrumbNode(
  locale: Locale,
  trail: { name: string; path: string }[],
): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: pageUrl(locale, crumb.path),
    })),
  };
}

export function serviceNode(locale: Locale, service: Service): JsonLdNode {
  const pillar = pillars[service.pillar];
  const url = pageUrl(locale, '/services');

  return {
    '@type': 'Service',
    '@id': `${url}#${service.pillar}`,
    name: pillar.label[locale],
    serviceType: pillar.label.en,
    description: `${service.headline[locale]} — ${service.forWhom[locale]}`,
    provider: person,
    areaServed: 'Worldwide',
    url,
  };
}

export function faqNode(locale: Locale, items: Faq[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl(locale, '/services')}#faq`,
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question[locale],
      acceptedAnswer: { '@type': 'Answer', text: item.answer[locale] },
    })),
  };
}

/**
 * A project as a piece of work, linked only where it has a page of its own.
 *
 * No `creator`: some of these were built alone and some as one engineer on a
 * team, and the registry records that as a role, not as authorship. The page
 * says which; a blanket claim in the markup would say more than the page does.
 */
function workNode(locale: Locale, project: Project): JsonLdNode {
  return {
    '@type': 'CreativeWork',
    name: project.name[locale],
    description: project.tagline[locale],
    keywords: project.stack.join(', '),
    ...(project.hasCaseStudy ? { url: pageUrl(locale, `/work/${project.slug}`) } : {}),
  };
}

/**
 * An expertise page: the service it describes, and the collection of work that
 * backs it. A CollectionPage rather than an ItemList, because the entries have
 * no URL of their own unless a case study exists.
 */
export function expertiseNodes(locale: Locale, topic: Expertise, list: Project[]): JsonLdNode[] {
  const url = pageUrl(locale, `/expertise/${topic.slug}`);
  const service = { '@id': `${url}#service` };

  return [
    {
      '@type': 'Service',
      ...service,
      name: topic.title[locale],
      serviceType: topic.title.en,
      description: topic.lead[locale],
      provider: person,
      areaServed: 'Worldwide',
      url,
    },
    {
      '@type': 'CollectionPage',
      '@id': url,
      url,
      name: topic.title[locale],
      description: topic.lead[locale],
      inLanguage: locale,
      isPartOf: website,
      about: service,
      hasPart: list.map((project) => workNode(locale, project)),
    },
  ];
}

export function caseStudyNode(locale: Locale, project: Project): JsonLdNode {
  const url = pageUrl(locale, `/work/${project.slug}`);

  return {
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: project.name[locale],
    description: project.summary[locale],
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    author: person,
    publisher: person,
    isPartOf: website,
    keywords: project.stack.join(', '),
  };
}

export function postNode(locale: Locale, post: Post): JsonLdNode {
  const url = pageUrl(locale, `/blog/${post.slug}`);

  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title[locale],
    description: post.description[locale],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    author: person,
    publisher: person,
    isPartOf: website,
    keywords: post.tags.join(', '),
  };
}
