import { owner, SITE_URL, socials } from '@/content/site';
import { parseOrThrow, resume as resumeSchema } from '@/lib/schemas';
import type { ResumeInput } from '@/lib/schemas';

/**
 * The only place résumé content is authored. It drives:
 *   - the /cv page (screen + print stylesheet)
 *   - the About page's experience and education sections
 *
 * It does NOT drive the downloadable PDF: that is the designed document in
 * public/cv, kept by hand. Keep this in step with it when either changes.
 *
 * Selected projects are referenced by slug from the project registry, so a
 * project's name, period and stack can never drift between site and CV.
 */

const raw: ResumeInput = {
  name: { en: owner.fullName, ar: 'أسامة رائد جنينة' },
  headline: {
    en: 'Full-Stack Product Engineer · AI-Powered Systems',
    ar: 'مهندس منتجات Full-Stack · أنظمة مدعومة بالذكاء الاصطناعي',
  },
  profile: {
    en: 'Full-stack engineer who takes products from an empty repository to a running production system — interface, API, database, mobile client and the server it all runs on. Six years and 40+ shipped systems across commerce, healthcare, charity operations and messaging automation, most of them Arabic-first and RTL. Deep experience with the integrations other people avoid: Meta WhatsApp Cloud API, Gulf payment rails, and ERP synchronisation. Recent work centres on AI-powered automation — provider-agnostic assistant layers, real-time voice translation, and conversational commerce.',
    ar: 'مهندس full-stack يأخذ المنتج من مستودع فارغ إلى نظام إنتاج يعمل — الواجهة و API وقاعدة البيانات وتطبيق الموبايل والسيرفر الذي يشغّلها كلها. ست سنوات وأكثر من ٤٠ نظاماً مشحوناً في التجارة والرعاية الصحية وإدارة العمل الخيري وأتمتة المراسلة، معظمها عربي أولاً و RTL. خبرة عميقة في التكاملات التي يتهرب منها غيري: Meta WhatsApp Cloud API وبوابات الدفع الخليجية ومزامنة أنظمة ERP. العمل الأحدث يتمركز حول الأتمتة المدعومة بالذكاء الاصطناعي — طبقات مساعدين مستقلة عن المزوّد، وترجمة صوتية فورية، وتجارة محادثية.',
  },
  email: owner.email,
  whatsapp: owner.whatsapp.display,
  website: SITE_URL,
  location: owner.location,
  links: [
    { label: 'GitHub', url: socials.github },
    { label: 'Portfolio', url: SITE_URL },
  ],

  skills: [
    {
      group: { en: 'Backend', ar: 'الباكإند' },
      items: [
        'PHP 8',
        'Laravel 8–13',
        'Node.js',
        'Express',
        'Fastify',
        'Python',
        'FastAPI',
        'REST API design',
        'Queue workers',
      ],
    },
    {
      group: { en: 'Frontend', ar: 'الواجهة' },
      items: [
        'Vue 3',
        'Inertia.js',
        'Nuxt',
        'React',
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Alpine.js',
        'Livewire',
      ],
    },
    {
      group: { en: 'Mobile', ar: 'الموبايل' },
      items: ['Flutter', 'Dart', 'Pigeon platform channels', 'Kotlin', 'Swift', 'PWA'],
    },
    {
      group: { en: 'AI & Automation', ar: 'الذكاء الاصطناعي والأتمتة' },
      items: [
        'OpenAI SDK',
        'Provider-agnostic AI layers',
        'Speech recognition',
        'Conversational flow engines',
        'Playwright automation',
      ],
    },
    {
      group: { en: 'Data', ar: 'البيانات' },
      items: [
        'MySQL',
        'MongoDB',
        'Redis',
        'Multi-tenant schema design',
        'Large migration sets',
        'Reporting & analytics',
      ],
    },
    {
      group: { en: 'Infrastructure', ar: 'البنية التحتية' },
      items: [
        'Docker',
        'nginx',
        'Ubuntu VPS',
        'PM2',
        'Laravel Reverb / WebSockets',
        'Let’s Encrypt',
        'CI/CD',
      ],
    },
    {
      group: { en: 'Integrations', ar: 'التكاملات' },
      items: [
        'Meta WhatsApp Cloud API',
        'Thawani',
        'JawwalPay',
        'Apple Pay',
        'Odoo ERP',
        'SmartLife ERP',
        'Firebase',
        'OneSignal',
      ],
    },
    {
      group: { en: 'Practices', ar: 'الممارسات' },
      items: [
        'Pest / PHPUnit',
        'Playwright',
        'Git & code review',
        'Arabic RTL & i18n',
        'Threat modelling',
        'Technical documentation',
      ],
    },
  ],

  experience: [
    {
      title: { en: 'Full-Stack Developer', ar: 'مطوّر Full-Stack' },
      org: { en: 'Muscat Apps', ar: 'مسقط أبس' },
      period: { en: '2022 — Present', ar: '2022 — حتى الآن' },
      bullets: [
        {
          en: 'Own products end to end: domain modelling, Laravel and Vue implementation, mobile APIs, server provisioning and ongoing operation.',
          ar: 'أملك المنتجات من البداية للنهاية: نمذجة النطاق، وتنفيذ Laravel و Vue، وواجهات الموبايل، وتجهيز السيرفرات، والتشغيل المستمر.',
        },
        {
          en: 'Built the WhatsApp-native commerce platform: a stateful flow engine, an HMAC-signed Node gateway for Meta protocol handling, and role-separated dashboards backed by 53 test files.',
          ar: 'بنيت منصة التجارة داخل واتساب: محرّك flow بحالة، وبوابة Node موقّعة بـ HMAC للتعامل مع بروتوكول Meta، ولوحات مفصولة بالأدوار مدعومة بـ٥٣ ملف اختبار.',
        },
        {
          en: 'Delivered integrations across payment rails (Thawani, JawwalPay, Apple Pay) and ERP systems (Odoo, SmartLife), including invoice delivery over WhatsApp.',
          ar: 'سلّمت تكاملات عبر بوابات دفع (Thawani و JawwalPay و Apple Pay) وأنظمة ERP (Odoo و SmartLife)، بما فيها تسليم الفواتير عبر واتساب.',
        },
        {
          en: 'Maintain long-lived platforms in production — one charity system has passed 400 commits under continuous ownership.',
          ar: 'أُصين منصات طويلة العمر في الإنتاج — أحد أنظمة العمل الخيري تجاوز ٤٠٠ commit تحت ملكية متواصلة.',
        },
      ],
    },
    {
      title: { en: 'Backend Developer', ar: 'مطوّر باكإند' },
      org: { en: 'Muscat Apps', ar: 'مسقط أبس' },
      period: { en: '2021 — 2022', ar: '2021 — 2022' },
      bullets: [
        {
          en: 'Built Laravel backends and REST APIs for multi-vendor marketplaces and e-commerce platforms serving web and mobile clients.',
          ar: 'بنيت باكإند Laravel وواجهات REST لأسواق متعددة التجّار ومنصات تجارة إلكترونية تخدم عملاء ويب وموبايل.',
        },
        {
          en: 'Introduced Redis-backed queue workers to move heavy work off the request path, and took on VPS provisioning and deployment.',
          ar: 'أدخلت طوابير Redis لنقل العمل الثقيل خارج مسار الطلب، وتوليت تجهيز السيرفرات والنشر.',
        },
      ],
    },
    {
      title: { en: 'Backend Developer — Freelance', ar: 'مطوّر باكإند — عمل حر' },
      org: { en: 'Independent', ar: 'مستقل' },
      period: { en: '2019 — 2021', ar: '2019 — 2021' },
      bullets: [
        {
          en: 'Delivered Laravel applications for clients across retail, clinics and education, handling requirements, build and deployment single-handedly.',
          ar: 'سلّمت تطبيقات Laravel لعملاء في التجزئة والعيادات والتعليم، متولياً المتطلبات والبناء والنشر بشكل منفرد.',
        },
      ],
    },
  ],

  education: [
    {
      degree: { en: "Master's", ar: 'ماجستير' },
      field: { en: 'Computer Engineering', ar: 'هندسة الحاسوب' },
      org: { en: 'Islamic University of Gaza', ar: 'الجامعة الإسلامية بغزة' },
      period: { en: '2023 — Present', ar: '2023 — حتى الآن' },
      ongoing: true,
    },
    {
      degree: { en: "Bachelor's", ar: 'بكالوريوس' },
      field: { en: 'Software Development', ar: 'تطوير البرمجيات' },
      org: { en: 'Islamic University of Gaza', ar: 'الجامعة الإسلامية بغزة' },
      period: { en: '2019 — 2023', ar: '2019 — 2023' },
    },
  ],

  /**
   * Five, deliberately. A CV that lists everything lists nothing; the rest of
   * the 40+ live on the site, which the CV links to.
   */
  selectedProjects: [
    'sila',
    'whatsapp-commerce',
    'dental-center-platform',
    'omnichannel-ai-assistant',
    'zakat-welfare-platform',
  ],
};

export const resume = parseOrThrow(resumeSchema, raw, 'resume');

/** Bumped whenever résumé content changes; shown on /cv and in the PDF. */
export const RESUME_UPDATED = '2026-07-30';
