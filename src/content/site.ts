import type { Localized, Pillar } from '@/lib/schemas';

/**
 * Single source of truth for identity, navigation and SEO defaults.
 *
 * PENDING owner input (tracked in the project plan, section 13):
 *   - `linkedin` is null until the profile URL is supplied.
 *   - `email` may move to hello@osamajenana.com once the mailbox exists.
 *   - a second (Gulf) WhatsApp number may be added alongside the current one.
 */

/**
 * Public origin, no trailing slash. Drives canonical URLs, hreflang alternates,
 * OG image URLs, the sitemap and the RSS feed.
 *
 * Read from the environment so a preview deployment or a local Lighthouse run
 * emits canonicals for the origin it is actually served from — a canonical
 * pointing at a different host is treated as invalid, which is exactly what
 * Lighthouse flagged when this was a hardcoded constant.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://osamajenana.com').replace(
  /\/+$/,
  '',
);

export const owner = {
  /** Legal name — used in JSON-LD, the CV, and the copyright line. */
  fullName: 'Osama Raed Jenana',
  /** Display name — navbar, OG images. */
  shortName: 'Osama Jenana',
  /**
   * The hero sets the name two lines deep at display size, so it needs the
   * split rather than a string it would have to guess a break point in. The
   * Arabic form is the short one — the full three-part name is on the CV.
   */
  displayName: {
    en: { first: 'Osama', last: 'Jenana' },
    ar: { first: 'أسامة', last: 'جنينة' },
  },
  role: {
    en: 'Full-Stack Product Engineer',
    ar: 'مهندس منتجات Full-Stack',
  } satisfies Localized,
  /** Second line of the positioning statement. */
  specialism: {
    en: 'AI-Powered Systems',
    ar: 'أنظمة مدعومة بالذكاء الاصطناعي',
  } satisfies Localized,
  /** Remote-first by choice: no country is published anywhere on the site. */
  location: {
    en: 'Remote · Worldwide',
    ar: 'عن بُعد · حول العالم',
  } satisfies Localized,
  email: 'ojenana11@gmail.com',
  whatsapp: {
    /** E.164 digits only, for wa.me links. */
    e164: '972592903278',
    display: '+972 59 290 3278',
  },
  yearsExperience: 6,
  /** Year the first paid project shipped — drives the "since" copy. */
  since: 2019,
} as const;

/**
 * The CV.
 *
 * `file` is the designed PDF that ships in public/ — the document Osama hands
 * to a client, not something generated from this repo's data. It is the only
 * thing a "Download CV" control may point at; /api/cv redirects here so older
 * links keep working.
 */
export const cv = {
  file: '/cv/Osama-Jenana-CV.pdf',
  /** Filename the browser saves it as, via the anchor's `download` attribute. */
  downloadName: 'Osama-Jenana-CV.pdf',
} as const;

export const socials = {
  github: 'https://github.com/osamajenana',
  githubOrg: 'https://github.com/Muscat-Apps',
  linkedin: null as string | null,
  x: 'https://x.com/OsamaJenana',
} as const;

/**
 * Booking. While `calUsername` is null the services page routes enquiries to
 * the contact form and WhatsApp instead — a scheduling button that leads
 * nowhere is worse than no scheduling button.
 */
export const booking = {
  calUsername: null as string | null,
  /** Cal.com event slug, e.g. "intro" for cal.com/<user>/intro. */
  calEvent: 'intro',
} as const;

/**
 * The three service pillars. Order is deliberate: `web` is the deepest
 * evidence base, `ai` is the fastest-growing demand, `infra` is the
 * differentiator that lets one engineer ship and operate a whole product.
 */
export const pillars: Record<
  Pillar,
  { label: Localized; blurb: Localized; accent: 'brand' | 'ai' | 'ink' }
> = {
  web: {
    label: { en: 'Web Systems', ar: 'أنظمة الويب' },
    blurb: {
      en: 'Multi-tenant platforms, admin panels and real-time dashboards on Laravel, Vue and Next.js — the kind with 70+ models and money moving through them.',
      ar: 'منصات multi-tenant ولوحات إدارة ولوحات معلومات فورية على Laravel و Vue و Next.js — من النوع اللي فيه 70+ موديل وأموال حقيقية تتحرك داخله.',
    },
    accent: 'brand',
  },
  ai: {
    label: { en: 'AI & Automation', ar: 'الذكاء الاصطناعي والأتمتة' },
    blurb: {
      en: 'Provider-agnostic AI layers, conversational assistants across channels, real-time voice translation, and scraping pipelines that beat rate limits by design.',
      ar: 'طبقات AI مستقلة عن المزوّد، مساعدون محادثون عبر عدة قنوات، ترجمة صوتية فورية، وخطوط جمع بيانات تتجاوز حدود المعدل بالتصميم.',
    },
    accent: 'ai',
  },
  infra: {
    label: { en: 'Infra & Integrations', ar: 'البنية التحتية والتكاملات' },
    blurb: {
      en: 'Docker, nginx, Redis queues and WebSockets on bare VPS boxes — plus the integrations nobody volunteers for: payment rails, ERPs and Meta Cloud API.',
      ar: 'Docker و nginx و طوابير Redis و WebSockets على سيرفرات VPS مباشرة — مع التكاملات اللي ما حد يتطوّع لها: بوابات الدفع وأنظمة ERP و Meta Cloud API.',
    },
    accent: 'ink',
  },
};

/**
 * Primary navigation.
 *
 * `minPosts` gates a route behind a content threshold rather than a hand-flipped
 * flag, so the nav can never advertise a section with nothing in it. The layout
 * resolves this against the real post count and passes the result to the header.
 */
export const navItems = [
  { key: 'work', href: '/work' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'blog', href: '/blog', minPosts: 1 },
  { key: 'contact', href: '/contact' },
] as const;

export type NavItem = { key: string; href: string };
export type NavKey = (typeof navItems)[number]['key'];

/** Nav entries whose content threshold is met. */
export function resolveNavItems(publishedPosts: number): NavItem[] {
  return navItems
    .filter((item) => !('minPosts' in item) || publishedPosts >= item.minPosts)
    .map((item) => ({ key: item.key, href: item.href }));
}

/**
 * Keyword set for metadata. Deliberately dense with the terms recruiters and
 * ATS filters actually search for, regardless of the poetic H1 above it.
 */
export const seoKeywords = [
  'Full-Stack Engineer',
  'Product Engineer',
  'Laravel Developer',
  'Vue.js Developer',
  'Next.js Developer',
  'React Developer',
  'Node.js Developer',
  'Flutter Developer',
  'Python FastAPI',
  'AI Integration Engineer',
  'OpenAI API',
  'Multi-tenant SaaS',
  'Redis',
  'WebSockets',
  'Docker',
  'DevOps',
  'REST API Design',
  'Payment Gateway Integration',
  'Arabic RTL',
  'Remote Software Engineer',
  'Osama Jenana',
];
