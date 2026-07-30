import { parseOrThrow, projectRegistry } from '@/lib/schemas';
import type { ProjectInput } from '@/lib/schemas';

/**
 * The single source of truth for every project on this site. The homepage,
 * /work grid, case study pages, archive, sitemap, OG images and the generated
 * CV all read from here.
 *
 * Ground rules:
 *  - Every number in `metrics` is a fact measured from the codebase (models,
 *    migrations, test files, commits). Business figures — users, orders/day,
 *    revenue — are owner-supplied and are added only once confirmed, never
 *    estimated.
 *  - `visibility: 'anonymized'` projects are real systems whose client is
 *    withheld. The schema forbids them from carrying a live or repo URL.
 *  - `status: 'live'` means the URL returned HTTP 200 when last checked.
 */

const raw: ProjectInput[] = [
  // ===========================================================================
  // FEATURED — the flagship six. Tier 1 means the case study is written;
  // the rest hold a featured slot and get promoted as each one is finished.
  // ===========================================================================
  {
    slug: 'sila',
    tier: 1,
    featuredOrder: 1,
    name: { en: 'Sila', ar: 'صِلة' },
    tagline: {
      en: 'Peer-to-peer messaging with no internet, no servers and no SIM',
      ar: 'مراسلة بين الأجهزة بدون إنترنت ولا سيرفرات ولا شريحة',
    },
    summary: {
      en: 'An offline-first messenger built on a self-healing Bluetooth Low Energy mesh of ordinary phones. Every device is a relay: messages hop device to device until they reach their recipient. Native BLE on both platforms is bridged into Flutter through Pigeon-generated platform channels, and the whole design is documented down to a written threat model.',
      ar: 'تطبيق مراسلة offline-first مبني على شبكة BLE mesh ذاتية الإصلاح من هواتف عادية. كل جهاز يعمل كمُرحِّل: الرسالة تنتقل من جهاز لجهاز حتى تصل صاحبها. طبقة BLE الأصلية على المنصتين موصولة بـ Flutter عبر platform channels مولّدة بـ Pigeon، والتصميم موثّق بالكامل وصولاً إلى نموذج تهديد مكتوب.',
    },
    period: { from: 2025, to: null },
    pillars: ['infra', 'web'],
    stack: [
      'Flutter',
      'Dart',
      'Bluetooth Low Energy',
      'Pigeon platform channels',
      'Kotlin',
      'Swift',
      'Mesh routing',
    ],
    role: {
      en: 'Sole architect and engineer — protocol, native layer, app and docs',
      ar: 'المهندس والمعماري الوحيد — البروتوكول وطبقة native والتطبيق والوثائق',
    },
    status: 'wip',
    visibility: 'named',
    metrics: [
      { label: { en: 'Dart source files', ar: 'ملفات Dart' }, value: '69' },
      { label: { en: 'Test files', ar: 'ملفات اختبار' }, value: '15' },
      {
        label: { en: 'Architecture documents', ar: 'وثائق معمارية' },
        value: '9',
        hint: {
          en: 'Including a security threat model and native BLE spec',
          ar: 'تشمل نموذج تهديد أمني ومواصفة BLE على مستوى native',
        },
      },
      {
        label: { en: 'Backend servers required', ar: 'سيرفرات مطلوبة' },
        value: '0',
        hint: {
          en: 'By design — there is no backend to take down',
          ar: 'بالتصميم — لا يوجد باكإند يمكن إسقاطه',
        },
      },
    ],
    diagram: 'mesh',
    hasCaseStudy: true,
    onCv: true,
  },
  {
    slug: 'whatsapp-commerce',
    tier: 1,
    featuredOrder: 2,
    name: {
      en: 'WhatsApp-Native Commerce Platform',
      ar: 'منصة تجارة تعمل داخل واتساب',
    },
    tagline: {
      en: 'A multi-branch store where the entire storefront is a WhatsApp conversation',
      ar: 'متجر متعدد الفروع، واجهته بالكامل محادثة واتساب',
    },
    summary: {
      en: 'Customers order exclusively through WhatsApp — there is no app and no website to visit. A stateful flow engine drives the conversation, a separate Node gateway handles Meta protocol translation and signature verification, and two Laravel dashboards give head office and each branch live control over orders, catalog and working hours.',
      ar: 'العملاء يطلبون عبر واتساب فقط — لا تطبيق ولا موقع يزورونه. محرّك flow بحالة (state machine) يقود المحادثة، وبوابة Node منفصلة تتولى ترجمة بروتوكول Meta والتحقق من التواقيع، ولوحتان بـ Laravel تعطيان الإدارة وكل فرع تحكماً فورياً بالطلبات والكتالوج وساعات العمل.',
    },
    period: { from: 2025, to: null },
    pillars: ['web', 'ai', 'infra'],
    stack: [
      'Laravel 13',
      'Vue 3 + Inertia',
      'Laravel Reverb (WebSockets)',
      'Meta WhatsApp Cloud API',
      'Fastify',
      'Redis',
      'MySQL',
      'Thawani',
      'Pest',
    ],
    role: {
      en: 'Full-stack — both services, dashboards, flow engine and deployment',
      ar: 'Full-stack — الخدمتان واللوحات ومحرّك الـ flow والنشر',
    },
    status: 'shipped',
    visibility: 'named',
    metrics: [
      { label: { en: 'PHP files in app/', ar: 'ملفات PHP في app/' }, value: '176' },
      { label: { en: 'Eloquent models', ar: 'موديلات Eloquent' }, value: '23' },
      { label: { en: 'Migrations', ar: 'Migrations' }, value: '44' },
      {
        label: { en: 'Pest test files', ar: 'ملفات اختبار Pest' },
        value: '53',
        hint: {
          en: 'Payment and flow-engine paths are the most heavily covered',
          ar: 'مسارات الدفع ومحرّك الـ flow هي الأكثر تغطية',
        },
      },
      { label: { en: 'Vue components', ar: 'مكوّنات Vue' }, value: '74' },
      {
        label: { en: 'Gateway source files', ar: 'ملفات بوابة Node' },
        value: '14',
        hint: {
          en: 'Deliberately tiny: protocol translation only, zero business logic',
          ar: 'صغيرة بالقصد: ترجمة بروتوكول فقط، بدون أي منطق أعمال',
        },
      },
    ],
    diagram: 'whatsapp-commerce',
    hasCaseStudy: true,
    onCv: true,
  },
  {
    slug: 'dental-center-platform',
    tier: 2,
    featuredOrder: 3,
    name: {
      en: 'Dental Center Management Platform',
      ar: 'منصة إدارة مركز أسنان',
    },
    tagline: {
      en: '78 models of clinical and financial domain, and a doctor-earnings engine that has to be exactly right',
      ar: '٧٨ موديلاً من النطاق الطبي والمالي، ومحرّك أرباح أطباء لا يحتمل الخطأ',
    },
    summary: {
      en: 'A full clinic operation: patients, appointments, treatments, prescriptions, inventory, billing and payroll. The hard part is not CRUD — it is payment allocation and the doctor-earnings algorithm, where a rounding mistake becomes a real dispute between a clinic and its staff. Arabic RTL throughout, with real-time updates over WebSockets.',
      ar: 'تشغيل عيادة كامل: المرضى والمواعيد والعلاجات والوصفات والمخزون والفواتير والرواتب. الجزء الصعب ليس الـ CRUD — بل توزيع الدفعات وخوارزمية أرباح الأطباء، حيث خطأ تقريب واحد يتحول إلى خلاف حقيقي بين العيادة وطاقمها. عربي RTL بالكامل، مع تحديثات فورية عبر WebSockets.',
    },
    period: { from: 2025, to: null },
    pillars: ['web', 'infra'],
    stack: [
      'Laravel 12',
      'Blade + Alpine.js',
      'Tailwind 4',
      'Laravel Reverb (WebSockets)',
      'MySQL',
      'Arabic RTL',
    ],
    role: {
      en: 'Full-stack — domain modelling, financial logic, deployment and backups',
      ar: 'Full-stack — نمذجة النطاق والمنطق المالي والنشر والنسخ الاحتياطي',
    },
    status: 'internal',
    visibility: 'anonymized',
    metrics: [
      {
        label: { en: 'Eloquent models', ar: 'موديلات Eloquent' },
        value: '78',
        hint: {
          en: 'Clinical, financial and scheduling domains kept separate',
          ar: 'النطاقات الطبية والمالية والجدولة مفصولة عن بعضها',
        },
      },
      { label: { en: 'Migrations', ar: 'Migrations' }, value: '138' },
      { label: { en: 'PHP files in app/', ar: 'ملفات PHP في app/' }, value: '252' },
      { label: { en: 'Blade views', ar: 'قوالب Blade' }, value: '303' },
      { label: { en: 'Commits', ar: 'Commits' }, value: '185' },
    ],
    diagram: 'clinic',
    hasCaseStudy: false,
    onCv: true,
  },
  {
    slug: 'omnichannel-ai-assistant',
    tier: 2,
    featuredOrder: 4,
    name: {
      en: 'Omnichannel AI Assistant',
      ar: 'مساعد ذكاء اصطناعي متعدد القنوات',
    },
    tagline: {
      en: 'One webhook, one app, every channel — WhatsApp, Messenger and Instagram',
      ar: 'Webhook واحد وتطبيق واحد لكل القنوات — واتساب وماسنجر وإنستغرام',
    },
    summary: {
      en: 'An automated reply system serving every page and every WhatsApp number a company owns from a single deployment. The AI layer is abstracted behind a provider interface, so the model can be swapped without touching conversation logic — and the Meta app-review surface (privacy policy, terms, data deletion) ships with it.',
      ar: 'نظام رد آلي يخدم كل صفحات الشركة وكل أرقام الواتساب من نشر واحد. طبقة الذكاء الاصطناعي مجرّدة خلف واجهة مزوّد، فيمكن تبديل الموديل دون المساس بمنطق المحادثة — ومعه أصول مراجعة تطبيق Meta كاملة (سياسة الخصوصية والشروط وحذف البيانات).',
    },
    period: { from: 2026, to: null },
    pillars: ['ai', 'infra'],
    stack: [
      'Node.js',
      'Express',
      'OpenAI SDK',
      'Meta Graph API',
      'WhatsApp Cloud API',
      'Instagram Messaging',
    ],
    role: {
      en: 'Sole engineer — AI abstraction, channel routing and Meta review',
      ar: 'المهندس الوحيد — تجريد الـ AI وتوجيه القنوات ومراجعة Meta',
    },
    status: 'shipped',
    visibility: 'named',
    metrics: [
      {
        label: { en: 'Channels from one webhook', ar: 'قنوات من webhook واحد' },
        value: '3',
      },
      {
        label: { en: 'AI providers swappable', ar: 'مزوّدو AI قابلون للتبديل' },
        value: 'Any',
        hint: {
          en: 'Conversation logic never imports a vendor SDK directly',
          ar: 'منطق المحادثة لا يستورد SDK أي مزوّد مباشرة',
        },
      },
    ],
    diagram: 'ai-router',
    hasCaseStudy: false,
    onCv: true,
  },
  {
    slug: 'realtime-voice-translation',
    tier: 2,
    featuredOrder: 5,
    name: {
      en: 'Real-Time Voice Translation',
      ar: 'ترجمة صوتية فورية',
    },
    tagline: {
      en: 'Speech in, translated speech out — with the slow parts pushed off the request',
      ar: 'صوت يدخل وصوت مترجم يخرج — والأجزاء البطيئة مُخرَجة من الطلب',
    },
    summary: {
      en: 'A Python speech service handles recognition and translation while a Laravel control plane manages speakers, subscriptions and quotas. Everything expensive runs through Redis-backed queues, so a slow model response never blocks a request — the same asynchronous pattern that carries the translation workload on the Bulum platform.',
      ar: 'خدمة Python تتولى التعرف على الكلام والترجمة، ولوحة تحكم Laravel تدير المتحدثين والاشتراكات والحصص. كل ما هو مُكلف يمر عبر طوابير Redis، فلا يُعطّل ردٌّ بطيء من الموديل أي طلب — وهو نفس النمط غير المتزامن الذي يحمل حِمل الترجمة في منصة Bulum.',
    },
    period: { from: 2024, to: 2025 },
    pillars: ['ai', 'infra'],
    stack: [
      'FastAPI',
      'OpenAI',
      'SpeechRecognition',
      'PyAudio',
      'NumPy',
      'Laravel',
      'Redis queues',
    ],
    role: {
      en: 'Full-stack — speech service, queueing model and admin control plane',
      ar: 'Full-stack — خدمة الصوت ونموذج الطوابير ولوحة التحكم',
    },
    status: 'shipped',
    visibility: 'named',
    metrics: [
      {
        label: { en: 'Services', ar: 'خدمات' },
        value: '2',
        hint: {
          en: 'Python for inference, Laravel for control — deployed independently',
          ar: 'Python للاستدلال و Laravel للتحكم — تُنشران بشكل مستقل',
        },
      },
    ],
    diagram: 'voice-pipeline',
    hasCaseStudy: false,
    onCv: true,
  },
  {
    slug: 'zakat-welfare-platform',
    tier: 2,
    featuredOrder: 6,
    name: {
      en: 'Zakat & Social Welfare Platform',
      ar: 'منصة زكاة ومساعدات اجتماعية',
    },
    tagline: {
      en: 'Six years of continuous ownership: 600+ commits across two deployments',
      ar: 'ست سنوات من الملكية المتواصلة: أكثر من ٦٠٠ commit على نشرتين',
    },
    summary: {
      en: 'Donation collection, beneficiary casework and orphan sponsorship for charitable organisations. Recurring donations, money boxes, family assessments, chronic-illness and disability records, and committee decisions — a domain where the data model has to mirror how real caseworkers think, not how a developer wishes they did.',
      ar: 'جمع التبرعات وإدارة حالات المستفيدين ورعاية الأيتام لمؤسسات خيرية. تبرعات متكررة وصناديق مال وتقييمات أسرية وسجلات أمراض مزمنة وإعاقات وقرارات لجان — نطاق يجب أن يحاكي فيه نموذج البيانات كيف يفكر الأخصائي الاجتماعي فعلاً، لا كيف يتمنى المبرمج أن يفكر.',
    },
    period: { from: 2021, to: null },
    pillars: ['web', 'infra'],
    stack: ['Laravel', 'Vue', 'Blade', 'MySQL', 'Docker', 'Thawani', 'SMS OTP', 'ImageMagick'],
    role: {
      en: 'Lead developer across both deployments — long-term product ownership',
      ar: 'المطوّر الرئيسي للنشرتين — ملكية منتج طويلة الأمد',
    },
    status: 'internal',
    visibility: 'anonymized',
    metrics: [
      {
        label: { en: 'Commits', ar: 'Commits' },
        value: '607',
        hint: {
          en: '427 on the first deployment, 180 on the second',
          ar: '٤٢٧ على النشرة الأولى و١٨٠ على الثانية',
        },
      },
      { label: { en: 'Eloquent models', ar: 'موديلات Eloquent' }, value: '96' },
      { label: { en: 'Migrations', ar: 'Migrations' }, value: '119' },
      { label: { en: 'Vue components', ar: 'مكوّنات Vue' }, value: '198' },
    ],
    diagram: 'welfare',
    hasCaseStudy: false,
    onCv: true,
  },

  // ===========================================================================
  // TIER 2 — rich cards
  // ===========================================================================
  {
    slug: 'deli-pizza',
    tier: 2,
    name: { en: 'Deli Pizza', ar: 'ديلي بيتزا' },
    tagline: {
      en: 'Restaurant platform: storefront, admin, customer app and driver app',
      ar: 'منصة مطعم: متجر ولوحة إدارة وتطبيق عميل وتطبيق مندوب',
    },
    summary: {
      en: 'A complete restaurant operation — online ordering, live order tracking, payments and inventory — spanning a public site, an admin panel and two mobile apps for customers and delivery drivers.',
      ar: 'تشغيل مطعم كامل — طلب أونلاين وتتبع فوري للطلبات ودفع ومخزون — يمتد على موقع عام ولوحة إدارة وتطبيقَي موبايل للعملاء والمندوبين.',
    },
    period: { from: 2023, to: 2024 },
    pillars: ['web'],
    stack: ['Laravel', 'Vue.js', 'REST API', 'Mobile apps', 'MySQL'],
    role: { en: 'Full-stack and API', ar: 'Full-stack و API' },
    status: 'live',
    visibility: 'named',
    liveUrl: 'https://delipizza.online',
    metrics: [],
    cover: {
      src: '/work/deli-pizza/cover',
      alt: {
        en: 'The Deli Pizza storefront: an Arabic headline beside a pizza photo, with App Store and Google Play badges.',
        ar: 'واجهة متجر ديلي بيتزا: عنوان عربي بجانب صورة بيتزا، مع شعارَي App Store و Google Play.',
      },
      width: 1440,
      height: 600,
    },
    hasCaseStudy: false,
    onCv: true,
  },
  {
    slug: 'souqly',
    tier: 2,
    name: { en: 'Souqly Marketplace', ar: 'سوقلي' },
    tagline: {
      en: 'Multi-vendor marketplace with three separate operator surfaces',
      ar: 'سوق متعدد التجّار بثلاث واجهات تشغيل منفصلة',
    },
    summary: {
      en: 'Admin dashboard, merchant panel and customer app over one catalog. Includes vendor onboarding, order routing, a commission model and payment gateway integration.',
      ar: 'لوحة إدارة ولوحة تاجر وتطبيق عميل فوق كتالوج واحد. تشمل تسجيل التجّار وتوجيه الطلبات ونموذج عمولة وتكامل بوابة دفع.',
    },
    period: { from: 2022, to: 2024 },
    pillars: ['web'],
    stack: ['Laravel', 'Vue.js', 'MySQL', 'Multi-vendor', 'Payments'],
    role: { en: 'Full-stack and API', ar: 'Full-stack و API' },
    status: 'live',
    visibility: 'named',
    liveUrl: 'https://lksouqly.com',
    metrics: [],
    cover: {
      src: '/work/souqly/cover',
      alt: {
        en: 'The Souqly marketplace home page: a red category bar over a photographic hero, all right-to-left Arabic.',
        ar: 'الصفحة الرئيسية لسوق سوقلي: شريط أقسام أحمر فوق صورة رئيسية، بالعربية من اليمين لليسار.',
      },
      width: 1440,
      height: 600,
    },
    hasCaseStudy: false,
    onCv: true,
  },
  {
    slug: 'bulum',
    tier: 2,
    name: { en: 'Bulum Platform', ar: 'منصة بلوم' },
    tagline: {
      en: 'Social platform with a queue-driven translation pipeline',
      ar: 'منصة اجتماعية بخط ترجمة يعمل بالطوابير',
    },
    summary: {
      en: 'Real-time voice processing and multi-language support built on Redis-backed queues, so heavy translation work runs asynchronously instead of holding requests open.',
      ar: 'معالجة صوت فورية ودعم متعدد اللغات مبنيان على طوابير Redis، فيعمل حِمل الترجمة الثقيل بشكل غير متزامن بدل إبقاء الطلبات مفتوحة.',
    },
    period: { from: 2024, to: 2025 },
    pillars: ['web', 'ai'],
    stack: ['Laravel', 'Redis', 'Queue workers', 'Translation API', 'REST API'],
    role: { en: 'Backend and infrastructure', ar: 'الباكإند والبنية التحتية' },
    status: 'live',
    visibility: 'named',
    liveUrl: 'https://bulumplatform.com',
    metrics: [],
    cover: {
      src: '/work/bulum/cover',
      alt: {
        en: 'The Bulum landing page: a phone mockup beside Arabic copy, with App Store and Google Play buttons.',
        ar: 'صفحة بولوم: هاتف معروض بجانب نص عربي، مع أزرار App Store و Google Play.',
      },
      width: 1440,
      height: 600,
    },
    hasCaseStudy: false,
    onCv: false,
  },
  {
    /**
     * Formerly two registry entries — "Al Shara Store" and "Dates Retailer +
     * Odoo ERP" — until screenshotting the live site showed both were the same
     * client (alsharashoping.com is titled "Sharaa Dates"). Merged: listing one
     * project twice inflates the portfolio.
     */
    slug: 'sharaa-dates',
    tier: 2,
    name: { en: 'Sharaa Dates', ar: 'مطاحن وتمور الشرع' },
    tagline: {
      en: 'Storefront wired into an ERP, ordered over WhatsApp, invoiced over WhatsApp',
      ar: 'متجر موصول بنظام ERP، الطلب عبر واتساب والفاتورة عبر واتساب',
    },
    summary: {
      en: 'A bilingual storefront for a dates and mills company, integrated with Odoo for stock and accounting, Thawani for payments, and WhatsApp for both ordering and invoice delivery. Includes a custom orders reporting module and a batch image-fetching pipeline for the catalog.',
      ar: 'متجر ثنائي اللغة لشركة تمور ومطاحن، موصول بـ Odoo للمخزون والحسابات، و Thawani للدفع، وواتساب للطلب وتسليم الفواتير معاً. يشمل وحدة تقارير طلبات مخصّصة وخط جلب صور مجمّع للكتالوج.',
    },
    period: { from: 2022, to: null },
    pillars: ['web', 'ai', 'infra'],
    stack: ['Laravel', 'Odoo ERP', 'Thawani', 'WhatsApp Cloud API', 'Docker', 'nginx', 'Tailwind'],
    role: { en: 'Full-stack and integrations', ar: 'Full-stack والتكاملات' },
    status: 'live',
    visibility: 'named',
    liveUrl: 'https://alsharashoping.com',
    metrics: [
      { label: { en: 'Commits', ar: 'Commits' }, value: '268' },
      { label: { en: 'Migrations', ar: 'Migrations' }, value: '127' },
    ],
    cover: {
      src: '/work/sharaa-dates/cover',
      alt: {
        en: 'The Sharaa Dates storefront: an Arabic navigation bar over a hero of handmade soap packaging.',
        ar: 'واجهة متجر تمور الشرع: شريط تنقّل عربي فوق صورة رئيسية لعلب صابون مصنوع يدوياً.',
      },
      width: 1440,
      height: 600,
    },
    hasCaseStudy: false,
    onCv: true,
  },
  {
    slug: 'rekan-store',
    tier: 2,
    name: { en: 'Rekan Store', ar: 'متجر ريكان' },
    tagline: {
      en: 'Multi-vendor commerce for the Omani market',
      ar: 'تجارة متعددة التجّار للسوق العماني',
    },
    summary: {
      en: 'Vendor registration, per-seller catalogs, order management and reporting, built for local payment and delivery expectations.',
      ar: 'تسجيل التجّار وكتالوجات لكل بائع وإدارة طلبات وتقارير، مبنية على توقعات الدفع والتوصيل المحلية.',
    },
    period: { from: 2023, to: 2024 },
    pillars: ['web'],
    stack: ['Laravel', 'Multi-vendor', 'MySQL', 'Payments'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'live',
    visibility: 'named',
    liveUrl: 'https://rekan.om',
    metrics: [],
    cover: {
      src: '/work/rekan-store/cover',
      alt: {
        en: 'The Rekan Store home page: a dark brown Arabic navigation bar above a product search panel.',
        ar: 'الصفحة الرئيسية لمتجر ريكان: شريط تنقّل عربي بنّي غامق فوق لوحة بحث عن المنتجات.',
      },
      width: 1440,
      height: 600,
    },
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'skin-treat',
    tier: 2,
    name: { en: 'Skin Treat', ar: 'سكين تريت' },
    tagline: {
      en: 'Cosmetics retail with deep product variation handling',
      ar: 'متجر مستحضرات تجميل بمعالجة عميقة لتنويعات المنتج',
    },
    summary: {
      en: 'A fully custom storefront: variant matrices, cart, secure payment processing, customer accounts and order tracking.',
      ar: 'متجر مخصّص بالكامل: مصفوفات تنويعات وسلة ومعالجة دفع آمنة وحسابات عملاء وتتبع طلبات.',
    },
    period: { from: 2023, to: 2024 },
    pillars: ['web'],
    stack: ['Laravel', 'E-commerce', 'Payments', 'MySQL'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'live',
    visibility: 'named',
    liveUrl: 'https://skintreat-oman.com',
    metrics: [],
    cover: {
      src: '/work/skin-treat/cover',
      alt: {
        en: 'The Skin Treat storefront: a line illustration of a face beside the brand mark and Arabic headline.',
        ar: 'واجهة متجر سكين تريت: رسم خطّي لوجه بجانب شعار العلامة وعنوان عربي.',
      },
      width: 1440,
      height: 600,
    },
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'multi-surface-retail',
    tier: 2,
    name: {
      en: 'Multi-Surface Retail Platform',
      ar: 'منصة تجزئة متعددة الواجهات',
    },
    tagline: {
      en: 'Four products on one codebase, including a separately authenticated portal',
      ar: 'أربعة منتجات على قاعدة كود واحدة، منها بوابة بمصادقة مستقلة',
    },
    summary: {
      en: 'A storefront, a permission-gated admin panel, a showroom portal with its own auth talking to a different ERP account, and a scheduled WhatsApp reminder pipeline — all sharing one deployment.',
      ar: 'متجر، ولوحة إدارة محمية بالصلاحيات، وبوابة معرض بمصادقة خاصة تتصل بحساب ERP مختلف، وخط تذكيرات واتساب مجدول — كلها على نشر واحد.',
    },
    period: { from: 2022, to: 2025 },
    pillars: ['web', 'infra'],
    stack: [
      'Laravel',
      'SmartLife ERP',
      'WhatsApp Cloud API',
      'Spatie Permissions',
      'Docker',
      'nginx',
    ],
    role: { en: 'Full-stack and integrations', ar: 'Full-stack والتكاملات' },
    status: 'shipped',
    visibility: 'named',
    metrics: [
      { label: { en: 'Migrations', ar: 'Migrations' }, value: '127' },
      { label: { en: 'Blade views', ar: 'قوالب Blade' }, value: '270' },
    ],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'multi-tenant-clinic-saas',
    tier: 2,
    name: {
      en: 'Multi-Tenant Clinic SaaS',
      ar: 'SaaS عيادات متعدد المستأجرين',
    },
    tagline: {
      en: 'One clinic system turned into a subscription product',
      ar: 'نظام عيادة واحد تحوّل إلى منتج اشتراكات',
    },
    summary: {
      en: 'Tenants with their own domains, plan and feature gating, subscription invoicing, a super-admin surface and an audit log — the transformation of a single-tenant clinic system into a sellable platform.',
      ar: 'مستأجرون بنطاقاتهم الخاصة، وتحكم بالخطط والمزايا، وفواتير اشتراك، وواجهة super-admin، وسجل تدقيق — تحويل نظام عيادة أحادي المستأجر إلى منصة قابلة للبيع.',
    },
    period: { from: 2025, to: null },
    pillars: ['web'],
    stack: ['Laravel 12', 'Multi-tenancy', 'Subscriptions', 'MySQL', 'Audit logging'],
    role: { en: 'Architect and developer', ar: 'المعماري والمطوّر' },
    status: 'internal',
    visibility: 'anonymized',
    metrics: [
      { label: { en: 'Eloquent models', ar: 'موديلات Eloquent' }, value: '21' },
      { label: { en: 'Migrations', ar: 'Migrations' }, value: '26' },
    ],
    hasCaseStudy: false,
    onCv: true,
  },
  {
    slug: 'pilgrimage-registration',
    tier: 2,
    name: {
      en: 'Pilgrimage Registration & Payments',
      ar: 'تسجيل ودفع الحج',
    },
    tagline: {
      en: 'Seasonal pricing, companion groups and registration by WhatsApp',
      ar: 'أسعار موسمية ومجموعات مرافقين وتسجيل عبر واتساب',
    },
    summary: {
      en: 'Multi-step registration with document management, delegate and companion relationships, transfers between groups, and dynamic seasonal pricing applied at invoice generation. Pilgrims can register and follow up entirely through WhatsApp.',
      ar: 'تسجيل متعدد الخطوات مع إدارة مستندات وعلاقات مندوبين ومرافقين وتحويلات بين المجموعات وأسعار موسمية ديناميكية تُطبَّق عند إنشاء الفاتورة. يمكن للحجّاج التسجيل والمتابعة عبر واتساب بالكامل.',
    },
    period: { from: 2024, to: 2026 },
    pillars: ['web', 'ai'],
    stack: ['Laravel 10', 'WhatsApp Cloud API', 'Payments', 'MySQL'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'internal',
    visibility: 'anonymized',
    metrics: [
      { label: { en: 'Commits', ar: 'Commits' }, value: '128' },
      { label: { en: 'Migrations', ar: 'Migrations' }, value: '37' },
    ],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'whatsapp-messaging-platform',
    tier: 2,
    name: {
      en: 'Multi-Tenant WhatsApp Messaging Platform',
      ar: 'منصة رسائل واتساب متعددة المستأجرين',
    },
    tagline: {
      en: 'Campaigns, scheduling and AI replies across many client accounts',
      ar: 'حملات وجدولة وردود AI عبر حسابات عملاء متعددة',
    },
    summary: {
      en: 'A messaging platform serving multiple client accounts from one deployment: webhook ingestion, template management, scheduled jobs, an AI chat service, push notifications and invoice generation.',
      ar: 'منصة رسائل تخدم حسابات عملاء متعددة من نشر واحد: استقبال webhooks وإدارة قوالب ومهام مجدولة وخدمة محادثة AI وإشعارات دفع وإنشاء فواتير.',
    },
    period: { from: 2024, to: null },
    pillars: ['ai', 'infra'],
    stack: ['Node.js', 'Express', 'MongoDB', 'Agenda', 'Firebase', 'OneSignal', 'SendGrid'],
    role: { en: 'Backend engineer', ar: 'مهندس باكإند' },
    status: 'shipped',
    visibility: 'named',
    metrics: [
      { label: { en: 'Commits', ar: 'Commits' }, value: '113' },
      { label: { en: 'Mongoose models', ar: 'موديلات Mongoose' }, value: '18' },
    ],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'places-data-harvester',
    tier: 2,
    name: {
      en: 'Places Data Harvester',
      ar: 'أداة حصد بيانات الأماكن',
    },
    tagline: {
      en: 'Country-scale map scraping with an adaptive quadtree — and no API key',
      ar: 'حصد بيانات خرائط بحجم دولة عبر quadtree تكيفي — وبدون مفتاح API',
    },
    summary: {
      en: 'Map search caps results per query, so blanket grids miss dense areas. This tool subdivides its search grid adaptively where results saturate, deduplicates across overlapping cells, and exports to Excel and JSON. Ships with both a CLI and a desktop GUI.',
      ar: 'بحث الخرائط يحدّ عدد النتائج لكل استعلام، فالشِبكات الثابتة تُفوّت المناطق الكثيفة. هذه الأداة تُقسّم شبكة البحث تكيفياً حيث تتشبّع النتائج، وتُزيل التكرار بين الخلايا المتقاطعة، وتُصدّر إلى Excel و JSON. تأتي بواجهة سطر أوامر وواجهة سطح مكتب.',
    },
    period: { from: 2026, to: 2026 },
    pillars: ['ai', 'infra'],
    stack: ['Python', 'Playwright', 'Adaptive quadtree', 'openpyxl', 'NiceGUI'],
    role: { en: 'Sole author', ar: 'المؤلف الوحيد' },
    status: 'shipped',
    visibility: 'named',
    metrics: [
      {
        label: { en: 'API keys required', ar: 'مفاتيح API مطلوبة' },
        value: '0',
      },
    ],
    hasCaseStudy: false,
    onCv: true,
  },
  {
    slug: 'media-downloader-desktop',
    tier: 2,
    name: {
      en: 'Social Media Downloader',
      ar: 'أداة تحميل الوسائط',
    },
    tagline: {
      en: 'A shipped Windows desktop app, not a script',
      ar: 'تطبيق سطح مكتب ويندوز مشحون فعلاً، وليس سكربتاً',
    },
    summary: {
      en: 'A native-feeling desktop client over yt-dlp: real progress with speed and ETA, cancellable background downloads, browser-cookie support, automatic audio/video merging, and light and dark modes. Packaged to a single Windows executable.',
      ar: 'عميل سطح مكتب فوق yt-dlp: تقدّم حقيقي بالسرعة والوقت المتوقع، وتحميلات خلفية قابلة للإلغاء، ودعم كوكيز المتصفح، ودمج صوت/فيديو تلقائي، ووضع فاتح وغامق. مُحزَّم إلى ملف تنفيذي واحد لويندوز.',
    },
    period: { from: 2026, to: 2026 },
    pillars: ['infra'],
    stack: ['Python', 'PySide6', 'yt-dlp', 'FFmpeg', 'PyInstaller'],
    role: { en: 'Sole author', ar: 'المؤلف الوحيد' },
    status: 'shipped',
    visibility: 'named',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'hosting-billing-panel',
    tier: 2,
    name: {
      en: 'Hosting Billing & Provisioning Panel',
      ar: 'لوحة فواتير وتجهيز استضافة',
    },
    tagline: {
      en: 'Plans, subscriptions, servers and automated credential delivery',
      ar: 'خطط واشتراكات وسيرفرات وتسليم بيانات دخول آلي',
    },
    summary: {
      en: 'A billing and provisioning panel for web hosting: plans and add-ons, subscription invoicing, server inventory, queued provisioning tasks, credential delivery and a knowledge base with support requests.',
      ar: 'لوحة فواتير وتجهيز لاستضافة الويب: خطط وإضافات، وفواتير اشتراك، ومخزون سيرفرات، ومهام تجهيز مُجدولة، وتسليم بيانات دخول، وقاعدة معرفة مع طلبات دعم.',
    },
    period: { from: 2026, to: null },
    pillars: ['web', 'infra'],
    stack: ['Laravel 13', 'Queues', 'Subscriptions', 'MySQL', 'Pest'],
    role: { en: 'Architect and developer', ar: 'المعماري والمطوّر' },
    status: 'wip',
    visibility: 'named',
    metrics: [
      { label: { en: 'Eloquent models', ar: 'موديلات Eloquent' }, value: '18' },
      { label: { en: 'Test files', ar: 'ملفات اختبار' }, value: '12' },
    ],
    hasCaseStudy: false,
    onCv: false,
  },

  // ===========================================================================
  // TIER 3 — archive
  // ===========================================================================
  {
    slug: 'school-management-system',
    tier: 3,
    name: { en: 'School Management System', ar: 'نظام إدارة مدرسة' },
    tagline: {
      en: 'Students, staff, classes and results — Arabic RTL throughout',
      ar: 'طلاب وموظفون وصفوف ونتائج — عربي RTL بالكامل',
    },
    summary: {
      en: 'A school operations system covering enrolment, staff, timetables and results, with a fully right-to-left Arabic interface.',
      ar: 'نظام تشغيل مدرسي يغطي التسجيل والموظفين والجداول والنتائج، بواجهة عربية من اليمين لليسار بالكامل.',
    },
    period: { from: 2026, to: 2026 },
    pillars: ['web'],
    stack: ['Laravel 12', 'Livewire', 'Tailwind', 'MySQL'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'shipped',
    visibility: 'named',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'clinic-systems-suite',
    tier: 3,
    name: { en: 'Clinic Systems (×3)', ar: 'أنظمة عيادات (×٣)' },
    tagline: {
      en: 'Three separate clinic platforms, including per-tooth charting and a PWA',
      ar: 'ثلاث منصات عيادات منفصلة، منها تخطيط لكل ضرس وتطبيق PWA',
    },
    summary: {
      en: 'Three independent dental and medical clinic systems: appointment and patient management, per-tooth treatment charting, x-ray records, expenses, and role-separated portals for admin, doctor and secretary.',
      ar: 'ثلاثة أنظمة عيادات أسنان وطبية مستقلة: إدارة مواعيد ومرضى، وتخطيط علاج لكل ضرس، وسجلات أشعة، ومصاريف، وبوابات مفصولة بالأدوار للإدارة والطبيب والسكرتارية.',
    },
    period: { from: 2025, to: 2026 },
    pillars: ['web'],
    stack: ['Laravel 12', 'Blade', 'PWA', 'MySQL', 'Arabic RTL'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'internal',
    visibility: 'anonymized',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'umrah-travel-booking',
    tier: 3,
    name: { en: 'Umrah Travel Booking', ar: 'حجز رحلات عمرة' },
    tagline: {
      en: 'Flights, hotels, pilgrims and child documentation',
      ar: 'رحلات وفنادق وحجّاج ومستندات أطفال',
    },
    summary: {
      en: 'A travel agency booking system handling pilgrim records, flight and hotel reservations, child documentation, OTP verification and payments.',
      ar: 'نظام حجز لوكالة سفر يتعامل مع سجلات الحجّاج وحجوزات الطيران والفنادق ومستندات الأطفال والتحقق بـ OTP والدفع.',
    },
    period: { from: 2025, to: 2026 },
    pillars: ['web'],
    stack: ['Laravel 12', 'Payments', 'OTP', 'MySQL'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'shipped',
    visibility: 'named',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'service-directory-marketplace',
    tier: 3,
    name: { en: 'Service Directory Marketplace', ar: 'دليل خدمات وسوق' },
    tagline: {
      en: 'Providers, branches, reviews and subscription packages',
      ar: 'مزوّدون وفروع وتقييمات وحزم اشتراك',
    },
    summary: {
      en: 'A local business and service directory with provider profiles, branch listings, reviews, working hours, banners, subscription packages and push notifications, plus a companion mobile app.',
      ar: 'دليل أعمال وخدمات محلية بملفات مزوّدين وقوائم فروع وتقييمات وساعات عمل ولافتات وحزم اشتراك وإشعارات دفع، مع تطبيق موبايل مرافق.',
    },
    period: { from: 2024, to: 2025 },
    pillars: ['web'],
    stack: ['Laravel', 'Vue', 'Vite', 'Mobile app', 'Push notifications'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'shipped',
    visibility: 'named',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'government-services-whatsapp',
    tier: 3,
    name: {
      en: 'Government Services over WhatsApp',
      ar: 'خدمات حكومية عبر واتساب',
    },
    tagline: {
      en: 'Multilingual service requests with a stateful conversation pipeline',
      ar: 'طلبات خدمة متعددة اللغات بخط محادثة بحالة',
    },
    summary: {
      en: 'A three-part system — stateless Node gateway, Laravel request pipeline and a Flutter employee app — letting citizens file and track government service requests through WhatsApp in their own language.',
      ar: 'نظام ثلاثي — بوابة Node عديمة الحالة، وخط طلبات Laravel، وتطبيق موظفين بـ Flutter — يتيح للمواطنين تقديم طلبات الخدمات الحكومية ومتابعتها عبر واتساب بلغتهم.',
    },
    period: { from: 2025, to: 2026 },
    pillars: ['ai', 'infra'],
    stack: ['Node.js', 'Laravel', 'Flutter', 'WhatsApp Cloud API'],
    role: { en: 'Full-stack across all three services', ar: 'Full-stack على الخدمات الثلاث' },
    status: 'internal',
    visibility: 'anonymized',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'luxury-auctions-frontend',
    tier: 3,
    name: { en: 'Luxury Auctions Front End', ar: 'واجهة مزادات فاخرة' },
    tagline: {
      en: 'Bilingual RTL/LTR auction interface with simulated live bidding',
      ar: 'واجهة مزادات ثنائية RTL/LTR بمزايدة حية محاكاة',
    },
    summary: {
      en: 'A front-end demo for a rare-art auction platform: full Arabic RTL and English LTR toggling, curated bilingual type pairing, countdown timers and simulated live bidding with auto-bids.',
      ar: 'نموذج واجهة لمنصة مزادات فنية نادرة: تبديل كامل بين العربية RTL والإنجليزية LTR، واقتران خطوط ثنائي منتقى، ومؤقتات تنازلية، ومزايدة حية محاكاة بمزايدات آلية.',
    },
    period: { from: 2026, to: 2026 },
    pillars: ['web'],
    stack: ['Vue 3', 'Vite', 'Pinia', 'vue-i18n', 'Tailwind'],
    role: { en: 'Front end and design system', ar: 'الواجهة ونظام التصميم' },
    status: 'shipped',
    visibility: 'named',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'home-services-marketing-site',
    tier: 3,
    name: { en: 'Home Services Product Site', ar: 'موقع منتج خدمات منزلية' },
    tagline: {
      en: 'Nuxt 4 with GSAP and Lenis-driven scroll choreography',
      ar: 'Nuxt 4 مع GSAP وحركة تمرير مبنية على Lenis',
    },
    summary: {
      en: 'A heavily animated marketing site: GSAP timelines, Lenis smooth scrolling, embla carousels, and validated forms with vee-validate and Zod.',
      ar: 'موقع تسويقي غني بالحركة: خطوط زمنية GSAP، وتمرير سلس بـ Lenis، وكاروسيلات embla، ونماذج مُتحقَّقة بـ vee-validate و Zod.',
    },
    period: { from: 2026, to: 2026 },
    pillars: ['web'],
    stack: ['Nuxt 4', 'Vue 3', 'GSAP', 'Lenis', 'Tailwind 4', 'Zod'],
    role: { en: 'Front end', ar: 'الواجهة' },
    status: 'shipped',
    visibility: 'named',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'project-management-tools',
    tier: 3,
    name: {
      en: 'Team & Time-Banking Tools',
      ar: 'أدوات فرق ومقايضة وقت',
    },
    tagline: {
      en: 'A task tracker and a skill-exchange platform',
      ar: 'متتبّع مهام ومنصة تبادل مهارات',
    },
    summary: {
      en: 'Two smaller Laravel products: a departmental project and task tracker with comments and attachments, and a time-banking platform where members exchange skills and settle in time credits.',
      ar: 'منتجان Laravel أصغر: متتبّع مشاريع ومهام للأقسام مع تعليقات ومرفقات، ومنصة مقايضة وقت يتبادل فيها الأعضاء المهارات ويسدّدون بأرصدة وقت.',
    },
    period: { from: 2026, to: 2026 },
    pillars: ['web'],
    stack: ['Laravel 12', 'Blade', 'Tailwind', 'MySQL'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'shipped',
    visibility: 'named',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
  {
    slug: 'promotional-raffle-system',
    tier: 3,
    name: { en: 'Invoice Raffle System', ar: 'نظام سحب على الفواتير' },
    tagline: {
      en: 'Upload an invoice, receive a coupon, enter the draw',
      ar: 'ارفع فاتورة، خُذ كوبوناً، ادخل السحب',
    },
    summary: {
      en: 'A promotional draw platform where customers upload purchase invoices to receive raffle coupons, with verification and prize-draw administration.',
      ar: 'منصة سحب ترويجية يرفع فيها العملاء فواتير الشراء للحصول على كوبونات سحب، مع تحقّق وإدارة سحب الجوائز.',
    },
    period: { from: 2025, to: 2025 },
    pillars: ['web'],
    stack: ['Laravel 11', 'Tailwind', 'MySQL'],
    role: { en: 'Full-stack', ar: 'Full-stack' },
    status: 'archived',
    visibility: 'named',
    metrics: [],
    hasCaseStudy: false,
    onCv: false,
  },
];

/**
 * Validated at module load. A malformed entry — missing Arabic, a tier-1 project
 * without a case study, an anonymized project carrying a client URL — fails
 * `next build` instead of reaching production.
 */
export const projects = parseOrThrow(projectRegistry, raw, 'project registry');
