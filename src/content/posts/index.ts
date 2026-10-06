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
  {
    slug: 'provider-agnostic-ai-layer',
    title: {
      en: 'A provider-agnostic AI layer: put the model behind an interface',
      ar: 'طبقة AI مستقلة عن المزوّد: ضَع الموديل خلف واجهة',
    },
    description: {
      en: 'An assistant that calls one vendor’s SDK from its conversation code is tied to that vendor. The seam I put between the two, what belongs on each side of it, and what it makes cheap later.',
      ar: 'المساعد الذي يستدعي SDK مزوّد واحد من كود المحادثة مرتبط بذلك المزوّد. الحدّ الذي أضعه بين الاثنين، وما ينتمي إلى كل جهة منه، وما يجعله رخيصاً لاحقاً.',
    },
    publishedAt: '2026-10-06',
    tags: ['AI', 'LLM', 'OpenAI', 'Node.js', 'Architecture'],
    relatedProject: 'omnichannel-ai-assistant',
    readingMinutes: 6,
  },
  {
    slug: 'verifying-meta-webhooks-raw-body',
    title: {
      en: 'Verifying WhatsApp webhooks: why the raw body matters',
      ar: 'التحقق من webhooks واتساب: لماذا يهمّ الـ body الخام',
    },
    description: {
      en: 'Meta signs the exact bytes it sent. Verify the signature after your framework has parsed the request and you are checking a different message. Where the check belongs, and why it got its own service.',
      ar: 'Meta توقّع البايتات التي أرسلتها بالضبط. إذا تحققت من التوقيع بعد أن حلّل الإطار الطلب فأنت تفحص رسالة مختلفة. أين ينتمي التحقق، ولماذا حصل على خدمة خاصة به.',
    },
    publishedAt: '2026-10-06',
    tags: ['WhatsApp Cloud API', 'Webhooks', 'Node.js', 'Fastify', 'HMAC', 'Laravel'],
    relatedProject: 'whatsapp-commerce',
    readingMinutes: 5,
  },
  {
    slug: 'flutter-ble-pigeon-platform-channels',
    title: {
      en: 'Flutter BLE with Pigeon instead of method channels',
      ar: 'Flutter و BLE عبر Pigeon بدل method channels',
    },
    description: {
      en: 'A Bluetooth mesh app has native radio code on two platforms and a wide border into Dart. Hand-written method channels made that border a runtime gamble; generating it with Pigeon made it a compile error.',
      ar: 'تطبيق mesh عبر البلوتوث فيه كود راديو أصلي على منصتين وحدّ عريض مع Dart. قنوات method channels اليدوية جعلت ذلك الحدّ مقامرة في وقت التشغيل؛ وتوليده بـ Pigeon جعله خطأ تصريف.',
    },
    publishedAt: '2026-10-06',
    tags: ['Flutter', 'Dart', 'Pigeon', 'Bluetooth Low Energy', 'Kotlin', 'Swift'],
    relatedProject: 'sila',
    readingMinutes: 5,
  },
];

export const posts: Post[] = parseOrThrow(postRegistry, raw, 'post registry');
