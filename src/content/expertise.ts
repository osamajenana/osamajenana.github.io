import type { Localized } from '@/lib/schemas';

/**
 * Expertise topics — one landing page each, under /expertise.
 *
 * The site already says what was built, project by project. These pages say it
 * the other way round: by technology and by kind of problem, which is how a
 * client, a recruiter or a search actually asks. "Who has shipped WhatsApp
 * Cloud API integrations?" has an answer here that the project list only
 * implies.
 *
 * A topic makes no claim of its own. It is a heading, two sentences, and a rule
 * for finding the projects that prove it — so a topic can never outrun the
 * evidence, and tests/unit/content.test.ts refuses one with fewer than two
 * projects behind it.
 *
 * `tags` are matched against a project's `stack`. `also` names projects that
 * belong although no stack tag says so; each one is there because the project's
 * own name or summary states it, not because it probably applies.
 */
export type Expertise = {
  slug: string;
  /** The page heading: the service, as a client would name it. */
  title: Localized;
  /** The same thing as a job title — the phrase that gets typed into a search. */
  role: Localized;
  lead: Localized;
  tags: RegExp[];
  also?: string[];
};

export const expertise: Expertise[] = [
  {
    slug: 'laravel',
    title: { en: 'Laravel development', ar: 'تطوير Laravel' },
    role: { en: 'Laravel developer', ar: 'مطوّر Laravel' },
    lead: {
      en: 'Laravel is the backbone of most of what I ship: multi-tenant platforms, back-office systems and the APIs behind mobile apps, on versions 8 through 13. These are the systems on this site that run on it.',
      ar: 'Laravel هو العمود الفقري لأغلب ما أشحنه: منصات multi-tenant وأنظمة إدارة داخلية وواجهات API خلف تطبيقات الموبايل، على الإصدارات من 8 إلى 13. هذه هي الأنظمة التي تعمل عليه في هذا الموقع.',
    },
    tags: [/^Laravel(?: \d+)?$/],
  },
  {
    slug: 'vue',
    title: { en: 'Vue.js & Nuxt front ends', ar: 'واجهات Vue.js و Nuxt' },
    role: { en: 'Vue.js developer', ar: 'مطوّر Vue.js' },
    lead: {
      en: 'Vue 3, Inertia and Nuxt for the dashboards and storefronts that sit on top of those back ends — including bilingual interfaces that switch cleanly between Arabic RTL and English LTR.',
      ar: 'Vue 3 و Inertia و Nuxt للوحات التحكم والمتاجر التي تعلو تلك الأنظمة الخلفية — ومنها واجهات ثنائية اللغة تتبدّل بسلاسة بين العربية RTL والإنجليزية LTR.',
    },
    tags: [/^Vue\b/, /^Nuxt\b/, /^Pinia$/, /^vue-i18n$/],
  },
  {
    slug: 'whatsapp-cloud-api',
    title: {
      en: 'WhatsApp Business & Cloud API integration',
      ar: 'تكامل WhatsApp Business و Cloud API',
    },
    role: { en: 'WhatsApp Cloud API developer', ar: 'مطوّر WhatsApp Cloud API' },
    lead: {
      en: 'Ordering, registration, reminders and invoices delivered inside WhatsApp. Stateful conversation engines on the Meta WhatsApp Cloud API, built around the 24-hour window and the template rules so the business number is never put at risk.',
      ar: 'طلبات وتسجيل وتذكيرات وفواتير تصل داخل واتساب. محرّكات محادثة بحالة على Meta WhatsApp Cloud API، مبنية حول نافذة الـ24 ساعة وقواعد القوالب حتى لا يتعرّض رقم النشاط التجاري للخطر.',
    },
    tags: [/WhatsApp Cloud API$/],
    // Named a WhatsApp messaging platform; its stack lists the queue and
    // delivery services rather than the channel.
    also: ['whatsapp-messaging-platform'],
  },
  {
    slug: 'ai-assistants',
    title: {
      en: 'AI assistants & LLM integration',
      ar: 'مساعدو الذكاء الاصطناعي وتكامل نماذج LLM',
    },
    role: { en: 'AI integration engineer', ar: 'مهندس تكامل ذكاء اصطناعي' },
    lead: {
      en: 'Conversational assistants and speech pipelines placed behind a provider interface, so the model is a swappable adapter rather than a dependency — with the slow, expensive calls moved onto queues.',
      ar: 'مساعدون محادثون وخطوط معالجة صوت خلف واجهة مزوّد، فيصبح الموديل مُهايئاً قابلاً للتبديل لا اعتماداً ثابتاً — مع نقل الاستدعاءات البطيئة والمكلفة إلى الطوابير.',
    },
    tags: [/^OpenAI\b/, /^SpeechRecognition$/, /^Translation API$/],
    // Its summary lists an AI chat service among what it runs.
    also: ['whatsapp-messaging-platform'],
  },
  {
    slug: 'payment-gateways',
    title: { en: 'Payment gateway integration', ar: 'تكامل بوابات الدفع' },
    role: { en: 'Payment integration developer', ar: 'مطوّر تكاملات الدفع' },
    lead: {
      en: 'Checkout, recurring donations and subscription invoicing on real payment rails, with every transaction verified server-side so the books reconcile. Thawani is in production on several of the systems below.',
      ar: 'دفع عند الشراء وتبرعات متكررة وفواتير اشتراكات على بوابات دفع حقيقية، مع التحقق من كل عملية من جهة السيرفر حتى تتطابق الحسابات. بوابة Thawani تعمل في الإنتاج على عدد من الأنظمة أدناه.',
    },
    tags: [/^Payments$/, /^Thawani$/, /^Subscriptions$/],
  },
  {
    slug: 'nodejs',
    title: { en: 'Node.js services & webhook gateways', ar: 'خدمات Node.js وبوابات webhook' },
    role: { en: 'Node.js developer', ar: 'مطوّر Node.js' },
    lead: {
      en: 'Node where it earns its place: webhook gateways that verify signatures and translate a platform’s protocol, and a multi-tenant messaging back end on Express and MongoDB.',
      ar: 'Node حيث يستحق مكانه: بوابات webhook تتحقق من التواقيع وتترجم بروتوكول المنصة، ونظام مراسلة خلفي متعدد المستأجرين على Express و MongoDB.',
    },
    tags: [/^Node\.js$/, /^Express$/, /^Fastify$/],
  },
  {
    slug: 'python',
    title: { en: 'Python automation & services', ar: 'أتمتة وخدمات Python' },
    role: { en: 'Python developer', ar: 'مطوّر Python' },
    lead: {
      en: 'Python for the jobs it is best at: a FastAPI speech service, a map-scraping pipeline built on an adaptive quadtree, and a desktop application packaged to a single executable.',
      ar: 'Python للمهام التي يُجيدها: خدمة صوت على FastAPI، وخط جمع بيانات خرائط مبني على quadtree تكيّفي، وتطبيق سطح مكتب محزوم في ملف تنفيذي واحد.',
    },
    tags: [/^Python$/, /^FastAPI$/, /^PySide6$/],
  },
  {
    slug: 'flutter',
    title: { en: 'Flutter mobile apps', ar: 'تطبيقات Flutter للموبايل' },
    role: { en: 'Flutter developer', ar: 'مطوّر Flutter' },
    lead: {
      en: 'Flutter apps that go below the framework when they have to: native Bluetooth Low Energy on Android and iOS bridged through Pigeon channels, and a staff app wired to a Laravel back end.',
      ar: 'تطبيقات Flutter تنزل تحت إطار العمل حين يلزم: BLE أصلي على Android و iOS موصول عبر قنوات Pigeon، وتطبيق للموظفين مربوط بنظام خلفي على Laravel.',
    },
    tags: [/^Flutter$/, /^Dart$/],
  },
  {
    slug: 'realtime-websockets',
    title: { en: 'Real-time dashboards with WebSockets', ar: 'لوحات فورية عبر WebSockets' },
    role: { en: 'Real-time systems developer', ar: 'مطوّر أنظمة فورية' },
    lead: {
      en: 'Live operator screens on Laravel Reverb: orders, appointments and status changes pushed to every open dashboard as they happen, rather than a page somebody has to refresh.',
      ar: 'شاشات تشغيل حيّة على Laravel Reverb: الطلبات والمواعيد وتغيّرات الحالة تُدفع إلى كل لوحة مفتوحة لحظة حدوثها، بدلاً من صفحة يحتاج أحدهم إلى تحديثها.',
    },
    tags: [/Reverb|WebSockets/],
  },
  {
    slug: 'deployment-devops',
    title: { en: 'Deployment & DevOps on your own servers', ar: 'النشر و DevOps على سيرفراتك' },
    role: { en: 'DevOps engineer', ar: 'مهندس DevOps' },
    lead: {
      en: 'Docker and nginx on plain VPS boxes — TLS, queues, backups and a deploy you can run without me. The systems below have run that way in production for years.',
      ar: 'Docker و nginx على سيرفرات VPS عادية — TLS وطوابير ونسخ احتياطية ونشر تستطيع تشغيله بدوني. الأنظمة أدناه تعمل بهذه الطريقة في الإنتاج منذ سنوات.',
    },
    tags: [/^Docker$/, /^nginx$/],
  },
  {
    slug: 'erp-integration',
    title: { en: 'ERP integration — Odoo and SmartLife', ar: 'تكامل أنظمة ERP — Odoo و SmartLife' },
    role: { en: 'ERP integration developer', ar: 'مطوّر تكاملات ERP' },
    lead: {
      en: 'Storefronts and portals kept in step with the ERP behind them: stock, accounting and invoices synchronised with Odoo and SmartLife, built so the two sides cannot quietly drift apart.',
      ar: 'متاجر وبوابات تبقى متطابقة مع نظام الـERP خلفها: مخزون ومحاسبة وفواتير تتزامن مع Odoo و SmartLife، مبنية بحيث لا ينحرف الطرفان عن بعضهما بصمت.',
    },
    tags: [/ERP$/],
  },
  {
    slug: 'arabic-rtl',
    title: { en: 'Arabic & RTL web development', ar: 'تطوير واجهات عربية و RTL' },
    role: { en: 'Arabic RTL web developer', ar: 'مطوّر واجهات عربية RTL' },
    lead: {
      en: 'Interfaces designed right-to-left from the first screen rather than mirrored afterwards: Arabic typography, bidirectional text, and bilingual products that switch direction cleanly.',
      ar: 'واجهات مصمَّمة من اليمين إلى اليسار من أول شاشة، لا معكوسة لاحقاً: خطوط عربية ونص ثنائي الاتجاه ومنتجات ثنائية اللغة تبدّل اتجاهها بسلاسة.',
    },
    tags: [/^Arabic RTL$/, /^vue-i18n$/],
    // Its tagline is "Arabic RTL throughout".
    also: ['school-management-system'],
  },
  {
    slug: 'e-commerce',
    title: {
      en: 'E-commerce & multi-vendor marketplaces',
      ar: 'متاجر إلكترونية وأسواق متعددة التجّار',
    },
    role: { en: 'E-commerce developer', ar: 'مطوّر متاجر إلكترونية' },
    lead: {
      en: 'Custom storefronts and marketplaces — vendor onboarding, order routing, commission models, product variants and payments — for the cases where an off-the-shelf shop almost fits and does not.',
      ar: 'متاجر وأسواق مبنية خصيصاً — تسجيل التجّار وتوجيه الطلبات ونماذج العمولة ومتغيّرات المنتجات والدفع — للحالات التي «يكاد» المتجر الجاهز يناسبها ولا يناسبها.',
    },
    tags: [/^E-commerce$/, /^Multi-vendor$/],
    // Each of these is described as a storefront or an ordering system.
    also: ['whatsapp-commerce', 'sharaa-dates', 'deli-pizza', 'multi-surface-retail'],
  },
  {
    slug: 'multi-tenant-saas',
    title: { en: 'Multi-tenant SaaS platforms', ar: 'منصات SaaS متعددة المستأجرين' },
    role: { en: 'SaaS developer', ar: 'مطوّر منصات SaaS' },
    lead: {
      en: 'Turning one working system into a product many customers subscribe to: tenant isolation, plans and feature gating, subscription invoicing and an audit trail.',
      ar: 'تحويل نظام واحد يعمل إلى منتج يشترك فيه عملاء كثيرون: عزل المستأجرين، وخطط وتفعيل ميزات، وفواتير اشتراكات، وسجل تدقيق.',
    },
    tags: [/^Multi-tenancy$/, /^Subscriptions$/],
    // Multi-tenant by name: many client accounts served from one deployment.
    also: ['whatsapp-messaging-platform'],
  },
  {
    slug: 'clinic-software',
    title: { en: 'Clinic & dental practice software', ar: 'أنظمة العيادات ومراكز الأسنان' },
    role: { en: 'Healthcare software developer', ar: 'مطوّر أنظمة صحية' },
    lead: {
      en: 'Clinic systems where the hard part is the money rather than the forms: appointments, per-tooth treatment charts, billing, payment allocation and doctor earnings that have to add up exactly.',
      ar: 'أنظمة عيادات يكمن صعبها في المال لا في النماذج: مواعيد، ومخططات علاج لكل سن، وفوترة، وتوزيع مدفوعات، وأرباح أطباء يجب أن تتطابق بدقة.',
    },
    // A kind of client rather than a technology, so there is no tag to match.
    tags: [],
    also: ['dental-center-platform', 'multi-tenant-clinic-saas', 'clinic-systems-suite'],
  },
];
