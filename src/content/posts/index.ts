import { parseOrThrow, postRegistry } from '@/lib/schemas';
import type { Post, PostInput } from '@/lib/schemas';

/**
 * Blog posts. Each entry must have `<slug>/en.mdx` and `<slug>/ar.mdx` beside
 * this file; lib/posts.ts fails the build if either is missing.
 *
 * The nav link to /blog stays disabled in content/site.ts until there are at
 * least two published posts — a blog with one entry reads as abandoned.
 */

const raw: PostInput[] = [
  {
    slug: 'stateful-whatsapp-flow-engine',
    title: {
      en: 'A stateful flow engine for WhatsApp, in Laravel',
      ar: 'محرّك flow بحالة لواتساب، في Laravel',
    },
    description: {
      en: 'Parsing the chat log to work out where a customer is looks flexible and is a trap. Here is the state machine I used instead, and what it bought.',
      ar: 'تحليل سجل المحادثة لمعرفة موضع العميل يبدو مرناً وهو فخ. هذه آلة الحالة التي استخدمتها بدلاً منه، وما الذي كسبته.',
    },
    publishedAt: '2026-07-30',
    tags: ['Laravel', 'WhatsApp Cloud API', 'State machines', 'Architecture'],
    relatedProject: 'whatsapp-commerce',
    readingMinutes: 6,
  },
];

export const posts: Post[] = parseOrThrow(postRegistry, raw, 'post registry');
