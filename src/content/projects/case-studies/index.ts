import { caseStudy, parseOrThrow } from '@/lib/schemas';
import type { CaseStudy } from '@/lib/schemas';

import { sila } from './sila';
import { whatsappCommerce } from './whatsapp-commerce';

/**
 * Case studies keyed by project slug. A project's `hasCaseStudy` flag and its
 * presence here must agree — lib/projects.ts throws at module load otherwise, so
 * a mismatch fails the build instead of 404-ing in production.
 *
 * Still to write (their projects sit at tier 2 with a featured slot until then):
 *   dental-center-platform, omnichannel-ai-assistant,
 *   realtime-voice-translation, zakat-welfare-platform
 */
const raw: Record<string, CaseStudy> = {
  sila,
  'whatsapp-commerce': whatsappCommerce,
};

export const caseStudies: Record<string, CaseStudy> = Object.fromEntries(
  Object.entries(raw).map(([slug, study]) => [
    slug,
    parseOrThrow(caseStudy, study, `case study "${slug}"`),
  ]),
);
