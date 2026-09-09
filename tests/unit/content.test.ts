import { describe, expect, it } from 'vitest';

import { diagrams } from '@/components/diagrams';
import { dataDeletionPolicy, legalDocuments, privacyPolicy } from '@/content/legal';
import { posts } from '@/content/posts';
import { projects } from '@/content/projects';
import { caseStudies } from '@/content/projects/case-studies';
import { resume } from '@/content/resume';
import { services } from '@/content/services';
import { company, owner } from '@/content/site';
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

  it('publishes the company locality rather than a remote-only line', () => {
    // Inverted deliberately in September 2026: the site now fronts a registered
    // entity, so a location has to be published and has to agree with `company`.
    expect(resume.location).toEqual(company.locality);
    expect(resume.email).toBe(company.email);
  });
});

describe('registered entity', () => {
  /**
   * A second, independent copy of the commercial registration certificate.
   *
   * This is duplication on purpose. Meta's Business Verification compares the
   * site against that certificate literally, and the failure mode is somebody
   * "tidying up" a legal name or translating a street — a change that looks
   * like an improvement in a diff and is a rejection in review. Changing
   * `company` alone can no longer do that silently: it has to be changed here
   * too, which is the moment to go and re-read the certificate.
   */
  const certificate = {
    legalName: {
      en: 'Osama Raed Jenana Technology Company',
      ar: 'شركة أسامة رائد جنينة للتقنية',
    },
    address: {
      en: 'Gaza – Al-Rimal Al-Shamali – near Palestine Stadium, Palestine',
      ar: 'غزة – الرمال الشمالي – بالقرب من ملعب فلسطين، فلسطين',
    },
    companyNumber: '563493311',
    registrationNumber: '39679',
    phone: '+970 59 290 3278',
    email: 'info@osamajenana.com',
  };

  it('transcribes the certificate verbatim', () => {
    expect(company.legalName).toEqual(certificate.legalName);
    expect(company.address).toEqual(certificate.address);
    expect(company.companyNumber).toBe(certificate.companyNumber);
    expect(company.registrationNumber).toBe(certificate.registrationNumber);
    expect(company.phone.display).toBe(certificate.phone);
    expect(company.email).toBe(certificate.email);
  });

  it('keeps the split postal address in step with the written one', () => {
    // The JSON-LD PostalAddress is assembled from parts; those parts have to be
    // the same words a reviewer reads in the footer. Only the separator is
    // allowed to differ — structured data commas the street line where the
    // written address dashes it — so both sides are compared with separators
    // flattened. A translated or reworded street still fails.
    const separators = /[–—,-]/g;
    const flatten = (value: string) => value.replace(separators, ' ').replace(/\s+/g, ' ').trim();

    const { streetAddress, addressLocality } = company.postalAddress;
    expect(flatten(company.address.en)).toContain(flatten(streetAddress));
    expect(company.address.en).toContain(addressLocality);
    expect(company.postalAddress.addressCountry).toBe('PS');
  });

  it('publishes one phone number, whatever route it is reached by', () => {
    // The WhatsApp account was issued under +972 and wa.me will resolve nothing
    // else, but a footer showing both codes for one business is a verification
    // rejection. The link keeps the account's digits; every visible string is
    // the registered line.
    expect(owner.whatsapp.display).toBe(company.phone.display);
    expect(owner.whatsapp.display).toContain('+970');
    expect(owner.whatsapp.e164).toBe('972592903278');
  });

  it('publishes no personal address as the contact route', () => {
    // The old personal Gmail address must not survive anywhere in the identity
    // surface — it is not the address on the certificate.
    const surfaces = [company.email, resume.email, JSON.stringify(resume.links)];
    for (const surface of surfaces) {
      expect(surface).not.toContain('gmail.com');
    }
  });
});

describe('legal documents', () => {
  it('publishes all three policies Meta looks for', () => {
    expect(legalDocuments.map((doc) => doc.slug).sort()).toEqual([
      'data-deletion',
      'privacy',
      'terms',
    ]);
  });

  it('names the registered entity in every document', () => {
    for (const doc of legalDocuments) {
      const text = JSON.stringify(doc);
      expect(text, `${doc.slug} does not name the company`).toContain(company.legalName.en);
      expect(text, `${doc.slug} does not name the company in Arabic`).toContain(
        company.legalName.ar,
      );
      expect(text, `${doc.slug} gives no contact address`).toContain(company.email);
    }
  });

  it('states a deletion route and a deadline on the data deletion page', () => {
    const text = JSON.stringify(dataDeletionPolicy);
    // App Review rejects a data deletion URL that does not say how or by when.
    expect(text).toContain('30 calendar days');
    expect(text).toContain(company.email);
    expect(dataDeletionPolicy.sections.map((section) => section.id)).toContain('how-to-request');
  });

  it('discloses Meta as a recipient in the privacy policy', () => {
    // The one disclosure a WhatsApp Business Platform provider cannot omit.
    const sharing = privacyPolicy.sections.find((section) => section.id === 'sharing');
    expect(sharing).toBeDefined();
    expect(JSON.stringify(sharing)).toContain('Meta Platforms');
  });

  it('is dated no later than today', () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const doc of legalDocuments) {
      expect(doc.updatedAt <= today, `${doc.slug} is dated in the future`).toBe(true);
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
