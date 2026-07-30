import { z } from 'zod';

/**
 * Every piece of content in this site is validated against these schemas at
 * module-load time, which means `next build` fails loudly on bad or incomplete
 * data rather than shipping a half-rendered page.
 */

// --- primitives -------------------------------------------------------------

/** A string that must exist in both locales. Missing Arabic = build failure. */
export const localized = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});
export type Localized = z.infer<typeof localized>;

/** Optional prose that, if present at all, must be present in both locales. */
export const localizedOptional = localized.optional();

export const pillar = z.enum(['web', 'ai', 'infra']);
export type Pillar = z.infer<typeof pillar>;

/**
 * `live`     — publicly reachable and linked from here (URL verified).
 * `shipped`  — delivered and publicly branded, but not linked from here.
 * `internal` — back-office system; client identity withheld.
 * `archived` — no longer running.
 * `wip`      — in active development.
 */
export const projectStatus = z.enum(['live', 'shipped', 'internal', 'archived', 'wip']);
export type ProjectStatus = z.infer<typeof projectStatus>;

/**
 * `named` — the client agreed, or the site is publicly branded already.
 * `anonymized` — real system, client identity withheld; described by shape and
 * scale only, and never linked. Enforced by a refinement below.
 */
export const visibility = z.enum(['named', 'anonymized']);
export type Visibility = z.infer<typeof visibility>;

export const metric = z.object({
  /** Short label, e.g. "Merchants" / "التجّار". */
  label: localized,
  /** Pre-formatted so the source of truth stays human-readable: "40+", "p95 180 ms". */
  value: z.string().min(1),
  /** Optional footnote clarifying how the number was measured. */
  hint: localizedOptional,
});
export type Metric = z.infer<typeof metric>;

export const image = z.object({
  /**
   * Path WITHOUT an extension, e.g. `/work/deli-pizza/cover`. Both `.avif` and
   * `.webp` must exist at that path — scripts/process-shots.mjs writes the pair,
   * and the component renders them as a <picture> so the browser picks.
   */
  src: z.string().startsWith('/'),
  alt: localized,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ProjectImage = z.infer<typeof image>;

// --- projects ---------------------------------------------------------------

export const project = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case'),

    /**
     * 1 — full case study page.
     * 2 — rich card with screenshots and links.
     * 3 — archive row: name, stack, year.
     */
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),

    /**
     * Sort key for the homepage featured grid. Lower shows first. Independent
     * of tier: a project can earn a featured slot before its case study is
     * written, in which case the card links to /work instead.
     */
    featuredOrder: z.number().int().positive().optional(),

    name: localized,
    /** One line, under ~70 chars — used on cards and in OG images. */
    tagline: localized,
    /** 2–4 sentences. Shown on the card back and at the top of the case study. */
    summary: localized,

    /** `to: null` means ongoing. */
    period: z.object({
      from: z.number().int().min(2018).max(2100),
      to: z.number().int().min(2018).max(2100).nullable(),
    }),

    pillars: z.array(pillar).min(1),
    /** Display order matters — lead with what is most impressive. */
    stack: z.array(z.string().min(1)).min(1),
    role: localized,

    status: projectStatus,
    visibility,

    liveUrl: z.url().optional(),
    repoUrl: z.url().optional(),

    metrics: z.array(metric).default([]),

    cover: image.optional(),
    shots: z.array(image).default([]),
    /**
     * Key of a React SVG architecture diagram in components/diagrams. Used
     * instead of screenshots for anonymized systems.
     */
    diagram: z.string().optional(),

    /** Whether content/projects/<slug>/{en,ar}.mdx exists. */
    hasCaseStudy: z.boolean().default(false),
    /** Include in the generated CV's selected-projects section. */
    onCv: z.boolean().default(false),
  })
  .refine((p) => p.tier !== 1 || p.hasCaseStudy, {
    message: 'tier 1 projects must have a case study (hasCaseStudy: true)',
    path: ['hasCaseStudy'],
  })
  .refine((p) => p.tier !== 1 || p.featuredOrder !== undefined, {
    message: 'tier 1 projects must set featuredOrder',
    path: ['featuredOrder'],
  })
  .refine((p) => p.visibility !== 'anonymized' || p.liveUrl === undefined, {
    message: 'anonymized projects must not expose a liveUrl — that identifies the client',
    path: ['liveUrl'],
  })
  .refine((p) => p.visibility !== 'anonymized' || p.repoUrl === undefined, {
    message: 'anonymized projects must not expose a repoUrl — that identifies the client',
    path: ['repoUrl'],
  })
  .refine((p) => p.status !== 'live' || p.liveUrl !== undefined || p.visibility === 'anonymized', {
    message: 'a named live project should link to its live URL',
    path: ['liveUrl'],
  });

/** Validated project, defaults applied. This is what the app consumes. */
export type Project = z.infer<typeof project>;

/**
 * Shape authored by hand in the registry — fields with schema defaults
 * (`metrics`, `shots`, `hasCaseStudy`, `onCv`) are optional here.
 */
export type ProjectInput = z.input<typeof project>;

/** Validates the whole registry and guarantees slugs and orders are unique. */
export const projectRegistry = z
  .array(project)
  .min(1)
  .superRefine((list, ctx) => {
    const seenSlugs = new Set<string>();
    const seenOrders = new Set<number>();

    for (const [index, p] of list.entries()) {
      if (seenSlugs.has(p.slug)) {
        ctx.addIssue({
          code: 'custom',
          message: `duplicate slug "${p.slug}"`,
          path: [index, 'slug'],
        });
      }
      seenSlugs.add(p.slug);

      if (p.featuredOrder !== undefined) {
        if (seenOrders.has(p.featuredOrder)) {
          ctx.addIssue({
            code: 'custom',
            message: `duplicate featuredOrder ${p.featuredOrder}`,
            path: [index, 'featuredOrder'],
          });
        }
        seenOrders.add(p.featuredOrder);
      }
    }
  });

// --- résumé -----------------------------------------------------------------

export const resumeRole = z.object({
  title: localized,
  org: localized,
  /** Omitted on purpose for remote-only positioning — no country is published. */
  period: localized,
  bullets: z.array(localized).min(1),
});

export const resumeEducation = z.object({
  degree: localized,
  field: localized,
  org: localized,
  period: localized,
  ongoing: z.boolean().default(false),
});

export const resumeSkillGroup = z.object({
  group: localized,
  items: z.array(z.string().min(1)).min(1),
});

export const resume = z.object({
  name: localized,
  headline: localized,
  /** 3–5 sentences. The one paragraph a recruiter actually reads. */
  profile: localized,
  email: z.email(),
  whatsapp: z.string().min(6),
  website: z.url(),
  location: localized,
  links: z.array(z.object({ label: z.string().min(1), url: z.url() })),
  skills: z.array(resumeSkillGroup).min(1),
  experience: z.array(resumeRole).min(1),
  education: z.array(resumeEducation).min(1),
  /** Slugs from the project registry, in CV display order. */
  selectedProjects: z.array(z.string()).min(1),
});
export type Resume = z.infer<typeof resume>;
/** Authored shape — fields with defaults (`ongoing`) are optional. */
export type ResumeInput = z.input<typeof resume>;

// --- case studies -----------------------------------------------------------

/**
 * Case studies are structured data, not MDX. That is deliberate: the schema
 * forces every one of them through the same rigour — problem, constraints,
 * architecture, named trade-offs, outcome — and makes a missing Arabic
 * translation a build failure rather than a silent English fallback.
 *
 * MDX stays reserved for blog posts, where freeform prose is the point.
 */

/** Multi-paragraph prose, required in both locales. */
export const localizedProse = z.object({
  en: z.array(z.string().min(1)).min(1),
  ar: z.array(z.string().min(1)).min(1),
});
export type LocalizedProse = z.infer<typeof localizedProse>;

export const architectureLayer = z.object({
  /** Technology as written in the codebase, e.g. "Laravel Reverb". */
  name: z.string().min(1),
  role: localized,
});

/**
 * The shape senior interviewers actually probe for: what you picked, what you
 * rejected, and why. Every case study must name at least one real trade-off.
 */
export const designDecision = z.object({
  title: localized,
  chose: z.string().min(1),
  over: z.string().min(1),
  because: localizedProse,
});

export const caseStudy = z.object({
  /** The situation before any code existed. */
  problem: localizedProse,
  /** Hard limits that shaped the solution — budget, offline, compliance, legacy. */
  constraints: z.array(localized).min(1),
  architecture: z.object({
    summary: localizedProse,
    layers: z.array(architectureLayer).min(2),
    /** Key of a React SVG diagram in components/diagrams. */
    diagram: z.string().optional(),
  }),
  decisions: z.array(designDecision).min(1),
  /**
   * What shipping it changed. Business numbers live in the project's `metrics`;
   * this is the narrative around them.
   */
  outcome: localizedProse,
  lessons: z.array(localized).default([]),
});
export type CaseStudy = z.infer<typeof caseStudy>;
/** Authored shape — `lessons` is optional before defaults are applied. */
export type CaseStudyInput = z.input<typeof caseStudy>;

// --- blog -------------------------------------------------------------------

/**
 * Post metadata lives in a typed registry, not in MDX frontmatter: Zod then
 * guarantees both languages exist and the build fails on a half-translated post,
 * which YAML frontmatter cannot do.
 */
export const post = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case'),
  title: localized,
  description: z.object({
    en: z.string().min(1).max(220),
    ar: z.string().min(1).max(220),
  }),
  publishedAt: z.iso.date(),
  updatedAt: z.iso.date().optional(),
  tags: z.array(z.string().min(1)).min(1).max(6),
  /** Slug of the project this grew out of, linked at the foot of the post. */
  relatedProject: z.string().optional(),
  /** Rounded up from the English word count at 200 wpm. */
  readingMinutes: z.number().int().positive().max(60),
  /** Drafts are excluded from the index, the sitemap and the RSS feed. */
  draft: z.boolean().default(false),
});
export type Post = z.infer<typeof post>;
export type PostInput = z.input<typeof post>;

export const postRegistry = z.array(post).superRefine((list, ctx) => {
  const seen = new Set<string>();
  for (const [index, entry] of list.entries()) {
    if (seen.has(entry.slug)) {
      ctx.addIssue({
        code: 'custom',
        message: `duplicate slug "${entry.slug}"`,
        path: [index, 'slug'],
      });
    }
    seen.add(entry.slug);
  }
});

// --- helpers ----------------------------------------------------------------

/**
 * Parses with a readable error. Zod's default message is a JSON blob; this
 * keeps build failures diagnosable at a glance.
 */
export function parseOrThrow<T extends z.ZodType>(
  schema: T,
  value: unknown,
  label: string,
): z.output<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    const lines = result.error.issues.map(
      (issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`,
    );
    throw new Error(`Invalid ${label}:\n${lines.join('\n')}`);
  }
  return result.data;
}
