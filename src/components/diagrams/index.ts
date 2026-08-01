import type { DiagramSpec } from './ArchDiagram';

/**
 * Architecture diagrams, keyed by the `diagram` field on a project.
 *
 * Each one describes a system that was actually built, at the level of detail a
 * reviewer can check: named technologies, real boundaries, and dashed lines
 * wherever the hop is asynchronous.
 */

const mesh: DiagramSpec = {
  caption: {
    en: 'One device, top to bottom. Flutter owns routing and storage; the BLE radio work is native per platform behind a single generated interface. The peer link is the only transport — there is no server anywhere in this picture.',
    ar: 'جهاز واحد من الأعلى للأسفل. Flutter يملك التوجيه والتخزين؛ وعمل راديو BLE أصلي لكل منصة خلف واجهة مولّدة واحدة. الرابط بين الأجهزة هو وسيلة النقل الوحيدة — ولا يوجد سيرفر في هذه الصورة إطلاقاً.',
  },
  nodes: [
    {
      id: 'flutter',
      label: 'Flutter / Dart',
      sub: { en: 'UI · store · routing', ar: 'واجهة · تخزين · توجيه' },
      col: 0,
      row: 0,
      tone: 'brand',
    },
    {
      id: 'pigeon',
      label: 'Pigeon channels',
      sub: { en: 'generated, type-safe', ar: 'مولّدة وآمنة الأنواع' },
      col: 1,
      row: 0,
      tone: 'ai',
    },
    {
      id: 'android',
      label: 'Kotlin · BLE',
      sub: { en: 'GATT + advertising', ar: 'GATT وإعلان' },
      col: 2,
      row: 0,
      tone: 'neutral',
    },
    {
      id: 'ios',
      label: 'Swift · BLE',
      sub: { en: 'CoreBluetooth', ar: 'CoreBluetooth' },
      col: 2,
      row: 1,
      tone: 'neutral',
    },
    {
      id: 'peer',
      label: 'Peer device',
      sub: { en: 'relays onward', ar: 'يُرحّل للتالي' },
      col: 3,
      row: 0,
      tone: 'edge',
    },
  ],
  edges: [
    { from: 'flutter', to: 'pigeon' },
    { from: 'pigeon', to: 'android' },
    { from: 'pigeon', to: 'ios' },
    { from: 'android', to: 'peer', label: { en: 'multi-hop', ar: 'قفزات متعددة' } },
    { from: 'ios', to: 'peer', async: true },
  ],
};

const whatsappCommerce: DiagramSpec = {
  caption: {
    en: 'Two services with an HMAC-signed boundary. The gateway speaks Meta and nothing else; Laravel holds the business. Meta protocol changes stop at the gateway, and pricing changes never reach it.',
    ar: 'خدمتان بحدّ موقّع بـ HMAC. البوابة تتحدث مع Meta ولا شيء غير ذلك؛ و Laravel يحمل الأعمال. تغيّرات بروتوكول Meta تتوقف عند البوابة، وتغيّرات التسعير لا تصل إليها أبداً.',
  },
  nodes: [
    {
      id: 'wa',
      label: 'WhatsApp',
      sub: { en: 'the whole storefront', ar: 'الواجهة بالكامل' },
      col: 0,
      row: 0,
      tone: 'ai',
    },
    {
      id: 'gw',
      label: 'Fastify gateway',
      sub: { en: 'verify · decrypt', ar: 'تحقّق · فكّ تشفير' },
      col: 1,
      row: 0,
      tone: 'brand',
    },
    {
      id: 'flow',
      label: 'Flow engine',
      sub: { en: 'state machine', ar: 'آلة حالة' },
      col: 2,
      row: 0,
      tone: 'brand',
    },
    { id: 'mysql', label: 'MySQL', col: 3, row: 0, tone: 'neutral' },
    {
      id: 'queue',
      label: 'Redis + Queue',
      sub: { en: 'campaigns · sync', ar: 'حملات · مزامنة' },
      col: 2,
      row: 1,
      tone: 'neutral',
    },
    {
      id: 'pay',
      label: 'Thawani',
      sub: { en: 'payments', ar: 'المدفوعات' },
      col: 3,
      row: 1,
      tone: 'neutral',
    },
    {
      id: 'reverb',
      label: 'Reverb (WS)',
      sub: { en: 'live order board', ar: 'لوحة طلبات حية' },
      col: 1,
      row: 2,
      tone: 'brand',
    },
    {
      id: 'dash',
      label: 'Vue dashboards',
      sub: { en: 'HQ + per branch', ar: 'الإدارة وكل فرع' },
      col: 0,
      row: 2,
      tone: 'neutral',
    },
  ],
  edges: [
    { from: 'wa', to: 'gw' },
    { from: 'gw', to: 'flow', label: { en: 'HMAC', ar: 'HMAC' } },
    { from: 'flow', to: 'mysql' },
    { from: 'flow', to: 'queue', async: true },
    { from: 'queue', to: 'pay', async: true },
    { from: 'flow', to: 'reverb' },
    { from: 'reverb', to: 'dash' },
  ],
};

const clinic: DiagramSpec = {
  caption: {
    en: 'The interesting part is not the CRUD, it is the earnings engine: every payment has to be allocated across treatments and doctors correctly, because the output is what people get paid.',
    ar: 'الجزء المثير ليس الـ CRUD، بل محرّك الأرباح: كل دفعة يجب أن تُوزَّع على العلاجات والأطباء بشكل صحيح، لأن الناتج هو ما يستلمه الناس كرواتب.',
  },
  nodes: [
    {
      id: 'ui',
      label: 'Blade + Alpine',
      sub: { en: 'Arabic RTL', ar: 'عربي RTL' },
      col: 0,
      row: 0,
      tone: 'neutral',
    },
    {
      id: 'app',
      label: 'Laravel 12',
      sub: { en: '78 models', ar: '78 موديلاً' },
      col: 1,
      row: 0,
      tone: 'brand',
    },
    {
      id: 'earnings',
      label: 'Earnings engine',
      sub: { en: 'payment allocation', ar: 'توزيع الدفعات' },
      col: 2,
      row: 0,
      tone: 'ai',
    },
    {
      id: 'db',
      label: 'MySQL',
      sub: { en: '138 migrations', ar: '138 migration' },
      col: 3,
      row: 0,
      tone: 'neutral',
    },
    {
      id: 'reverb',
      label: 'Reverb (WS)',
      sub: { en: 'live schedule', ar: 'جدول حي' },
      col: 1,
      row: 1,
      tone: 'brand',
    },
    {
      id: 'bot',
      label: 'Bot gateway',
      sub: { en: 'appointment reminders', ar: 'تذكير بالمواعيد' },
      col: 2,
      row: 1,
      tone: 'neutral',
    },
  ],
  edges: [
    { from: 'ui', to: 'app' },
    { from: 'app', to: 'earnings' },
    { from: 'earnings', to: 'db' },
    { from: 'app', to: 'reverb' },
    { from: 'app', to: 'bot', async: true },
  ],
};

const aiRouter: DiagramSpec = {
  caption: {
    en: 'Three channels, one webhook, one deployment. The conversation layer never imports a vendor SDK — swapping the model touches one adapter and nothing else.',
    ar: 'ثلاث قنوات و webhook واحد ونشر واحد. طبقة المحادثة لا تستورد SDK أي مزوّد — وتبديل الموديل يمسّ مُهايئاً واحداً ولا شيء غيره.',
  },
  nodes: [
    { id: 'wa', label: 'WhatsApp', col: 0, row: 0, tone: 'ai' },
    { id: 'msg', label: 'Messenger', col: 0, row: 1, tone: 'ai' },
    { id: 'ig', label: 'Instagram', col: 0, row: 2, tone: 'ai' },
    {
      id: 'hook',
      label: 'Express webhook',
      sub: { en: 'one endpoint', ar: 'نقطة واحدة' },
      col: 1,
      row: 1,
      tone: 'brand',
    },
    {
      id: 'iface',
      label: 'AI interface',
      sub: { en: 'provider-agnostic', ar: 'مستقلة عن المزوّد' },
      col: 2,
      row: 1,
      tone: 'brand',
    },
    {
      id: 'model',
      label: 'OpenAI',
      sub: { en: 'swappable adapter', ar: 'مُهايئ قابل للتبديل' },
      col: 3,
      row: 1,
      tone: 'edge',
    },
  ],
  edges: [
    { from: 'wa', to: 'hook' },
    { from: 'msg', to: 'hook' },
    { from: 'ig', to: 'hook' },
    { from: 'hook', to: 'iface' },
    { from: 'iface', to: 'model', async: true },
  ],
};

const voicePipeline: DiagramSpec = {
  caption: {
    en: 'Inference and control are separate services, deployed independently. Everything slow runs through a queue, so a long model response never holds a request open.',
    ar: 'الاستدلال والتحكم خدمتان منفصلتان تُنشران بشكل مستقل. وكل ما هو بطيء يمر عبر طابور، فلا يُبقي ردٌّ طويل من الموديل أي طلب مفتوحاً.',
  },
  nodes: [
    {
      id: 'client',
      label: 'Client audio',
      sub: { en: 'speech in', ar: 'صوت داخل' },
      col: 0,
      row: 0,
      tone: 'edge',
    },
    {
      id: 'api',
      label: 'FastAPI',
      sub: { en: 'Python service', ar: 'خدمة Python' },
      col: 1,
      row: 0,
      tone: 'brand',
    },
    {
      id: 'asr',
      label: 'Recognition',
      sub: { en: 'speech → text', ar: 'صوت ← نص' },
      col: 2,
      row: 0,
      tone: 'ai',
    },
    {
      id: 'translate',
      label: 'OpenAI',
      sub: { en: 'text → text', ar: 'نص ← نص' },
      col: 3,
      row: 0,
      tone: 'ai',
    },
    {
      id: 'queue',
      label: 'Redis queue',
      sub: { en: 'off the request', ar: 'خارج الطلب' },
      col: 2,
      row: 1,
      tone: 'neutral',
    },
    {
      id: 'control',
      label: 'Laravel',
      sub: { en: 'quotas · billing', ar: 'الحصص والفواتير' },
      col: 1,
      row: 1,
      tone: 'brand',
    },
  ],
  edges: [
    { from: 'client', to: 'api' },
    { from: 'api', to: 'asr' },
    { from: 'asr', to: 'translate' },
    { from: 'api', to: 'queue', async: true },
    { from: 'queue', to: 'control', async: true },
  ],
};

const welfare: DiagramSpec = {
  caption: {
    en: 'Two halves that must not leak into each other: public donation collection, and confidential caseworker records. Recurring donations run on a schedule; assessments never touch the payment path.',
    ar: 'نصفان يجب ألّا يتسرّب أحدهما للآخر: جمع التبرعات العام، وسجلات الأخصائيين السرّية. التبرعات المتكررة تعمل بجدول، والتقييمات لا تلمس مسار الدفع أبداً.',
  },
  nodes: [
    {
      id: 'donor',
      label: 'Donor',
      sub: { en: 'web + money boxes', ar: 'ويب وصناديق مال' },
      col: 0,
      row: 0,
      tone: 'edge',
    },
    {
      id: 'app',
      label: 'Laravel',
      sub: { en: '96 models', ar: '96 موديلاً' },
      col: 1,
      row: 0,
      tone: 'brand',
    },
    {
      id: 'recurring',
      label: 'Recurring jobs',
      sub: { en: 'scheduled charges', ar: 'خصومات مجدولة' },
      col: 2,
      row: 0,
      tone: 'neutral',
    },
    {
      id: 'pay',
      label: 'Thawani',
      sub: { en: 'payments', ar: 'المدفوعات' },
      col: 3,
      row: 0,
      tone: 'neutral',
    },
    {
      id: 'staff',
      label: 'Caseworker',
      sub: { en: 'separate auth', ar: 'مصادقة منفصلة' },
      col: 0,
      row: 1,
      tone: 'edge',
    },
    {
      id: 'records',
      label: 'Beneficiaries',
      sub: { en: 'families · orphans', ar: 'أسر · أيتام' },
      col: 2,
      row: 1,
      tone: 'ai',
    },
  ],
  edges: [
    { from: 'donor', to: 'app' },
    { from: 'app', to: 'recurring', async: true },
    { from: 'recurring', to: 'pay', async: true },
    { from: 'staff', to: 'app' },
    { from: 'app', to: 'records' },
  ],
};

/**
 * The production stack, for the home page section.
 *
 * Not tied to one project: this is the shape every system on this site ends up
 * having, which is the claim the section makes.
 */
export const stack: DiagramSpec = {
  caption: {
    en: 'A request arrives at nginx, the application answers it, and everything that would make the answer slow — queued jobs, model calls — happens off to the side. The WebSocket layer pushes the result back without the client asking again.',
    ar: 'الطلب يصل إلى nginx، والتطبيق يجيبه، وكل ما قد يُبطئ الجواب — المهام في الطابور ونداءات الموديل — يجري جانباً. وطبقة WebSocket تدفع النتيجة للعميل دون أن يسأل مرة أخرى.',
  },
  nodes: [
    {
      id: 'client',
      label: 'Client',
      sub: { en: 'web · mobile · WhatsApp', ar: 'ويب · موبايل · واتساب' },
      col: 0,
      row: 0,
      tone: 'edge',
    },
    {
      id: 'nginx',
      label: 'nginx',
      sub: { en: 'TLS · reverse proxy', ar: 'TLS · بروكسي عكسي' },
      col: 1,
      row: 0,
      tone: 'neutral',
    },
    {
      id: 'app',
      label: 'Laravel / Next.js',
      sub: { en: 'application layer', ar: 'طبقة التطبيق' },
      col: 2,
      row: 0,
      tone: 'brand',
    },
    {
      id: 'mysql',
      label: 'MySQL',
      sub: { en: '78 models, one system', ar: '78 موديلاً في نظام واحد' },
      col: 3,
      row: 0,
      tone: 'neutral',
    },
    {
      id: 'redis',
      label: 'Redis + Queue',
      sub: { en: 'off the request path', ar: 'خارج مسار الطلب' },
      col: 2,
      row: 1,
      tone: 'neutral',
    },
    {
      id: 'ai',
      label: 'AI layer',
      sub: { en: 'provider-agnostic', ar: 'مستقلة عن المزوّد' },
      col: 3,
      row: 1,
      tone: 'ai',
    },
    {
      id: 'reverb',
      label: 'Reverb (WS)',
      sub: { en: 'server push', ar: 'دفع من السيرفر' },
      col: 1,
      row: 2,
      tone: 'brand',
    },
    {
      id: 'board',
      label: 'Operator board',
      sub: { en: 'live, no refresh', ar: 'حيّة بلا تحديث' },
      col: 0,
      row: 2,
      tone: 'edge',
    },
  ],
  edges: [
    { from: 'client', to: 'nginx' },
    { from: 'nginx', to: 'app', label: { en: 'HTTPS', ar: 'HTTPS' } },
    { from: 'app', to: 'mysql' },
    { from: 'app', to: 'redis', async: true },
    { from: 'redis', to: 'ai', async: true },
    { from: 'app', to: 'reverb' },
    { from: 'reverb', to: 'board' },
  ],
};

export const diagrams: Record<string, DiagramSpec> = {
  mesh,
  'whatsapp-commerce': whatsappCommerce,
  clinic,
  'ai-router': aiRouter,
  'voice-pipeline': voicePipeline,
  welfare,
};

export function getDiagram(key: string | undefined): DiagramSpec | undefined {
  return key ? diagrams[key] : undefined;
}
