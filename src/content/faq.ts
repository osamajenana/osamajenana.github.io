import type { Localized } from '@/lib/schemas';

/**
 * The questions that get asked before a first message.
 *
 * Nothing here is new information. Each answer restates a commitment the site
 * already makes somewhere else — the engagement terms on the services page, the
 * skills on the CV, the availability line in the hero — as the direct reply to
 * the question a person, or an assistant answering on their behalf, actually
 * types. If one of those commitments changes, change it here too.
 *
 * Rendered on the services page and published as FAQPage structured data.
 */
export type Faq = {
  /** Stable fragment id — the question's wording can change without breaking links. */
  id: string;
  question: Localized;
  answer: Localized;
};

export const faq: Faq[] = [
  {
    id: 'scope',
    question: {
      en: 'What kind of work do you take on?',
      ar: 'ما نوع العمل الذي تأخذه؟',
    },
    answer: {
      en: 'Fixed-scope builds and monthly retainers in three areas: web systems, AI and automation, and infrastructure and integrations. Recent work includes a WhatsApp-native commerce platform, clinic and charity systems, AI assistants, and payment and ERP integrations.',
      ar: 'مشاريع بنطاق محدد واتفاقات شهرية في ثلاثة مجالات: أنظمة الويب، والذكاء الاصطناعي والأتمتة، والبنية التحتية والتكاملات. من الأعمال الأخيرة: منصة تجارة تعمل داخل واتساب، وأنظمة عيادات وعمل خيري، ومساعدون بالذكاء الاصطناعي، وتكاملات دفع و ERP.',
    },
  },
  {
    id: 'remote',
    question: {
      en: 'Do you work remotely with clients in other countries?',
      ar: 'هل تعمل عن بُعد مع عملاء في دول أخرى؟',
    },
    answer: {
      en: 'Yes. I work remotely with clients worldwide, and I am available for remote roles and selected freelance projects.',
      ar: 'نعم. أعمل عن بُعد مع عملاء حول العالم، ومتاح لوظائف عن بُعد ولمشاريع حرة مختارة.',
    },
  },
  {
    id: 'pricing',
    question: {
      en: 'How is a project priced?',
      ar: 'كيف يُسعَّر المشروع؟',
    },
    answer: {
      en: 'There is no price list, because a number without a scope means nothing. Tell me the problem and what it currently costs you, and you get a real figure within two working days.',
      ar: 'لا توجد قائمة أسعار، فالرقم بلا نطاق لا يعني شيئاً. احكِ لي المشكلة وكم تكلّفك حالياً، وتحصل على رقم حقيقي خلال يومَي عمل.',
    },
  },
  {
    id: 'stack',
    question: {
      en: 'Which technologies do you work with?',
      ar: 'ما التقنيات التي تعمل بها؟',
    },
    answer: {
      en: 'Laravel and PHP on the back end; Vue, Nuxt, React and Next.js on the front end; Flutter for mobile; Node.js and Python for services; MySQL, MongoDB and Redis for data — deployed with Docker and nginx on Linux servers.',
      ar: 'Laravel و PHP في الباكإند؛ Vue و Nuxt و React و Next.js في الواجهة؛ Flutter للموبايل؛ Node.js و Python للخدمات؛ MySQL و MongoDB و Redis للبيانات — وتُنشر عبر Docker و nginx على سيرفرات Linux.',
    },
  },
  {
    id: 'integrations',
    question: {
      en: 'Can you add WhatsApp, payments or an ERP to a system we already have?',
      ar: 'هل تستطيع إضافة واتساب أو الدفع أو ERP إلى نظام موجود عندنا؟',
    },
    answer: {
      en: 'Yes — those are the integrations I do most: the Meta WhatsApp Cloud API, payment gateways such as Thawani and Apple Pay, and ERP systems such as Odoo and SmartLife.',
      ar: 'نعم — هذه أكثر التكاملات التي أنفّذها: Meta WhatsApp Cloud API، وبوابات دفع مثل Thawani و Apple Pay، وأنظمة ERP مثل Odoo و SmartLife.',
    },
  },
  {
    id: 'arabic',
    question: {
      en: 'Do you build Arabic and right-to-left interfaces?',
      ar: 'هل تبني واجهات عربية ومن اليمين إلى اليسار؟',
    },
    answer: {
      en: 'Yes. Most of the systems on this site are Arabic-first and RTL, and several are fully bilingual.',
      ar: 'نعم. معظم الأنظمة في هذا الموقع عربية أولاً و RTL، وعدد منها ثنائي اللغة بالكامل.',
    },
  },
  {
    id: 'maintenance',
    question: {
      en: 'Will you keep the system running after launch?',
      ar: 'هل تُبقي النظام شغّالاً بعد الإطلاق؟',
    },
    answer: {
      en: 'Yes, on a monthly retainer. One of the platforms on this site has been under my continuous ownership since 2021.',
      ar: 'نعم، باتفاق شهري. إحدى المنصات في هذا الموقع تحت ملكيتي المتواصلة منذ 2021.',
    },
  },
  {
    id: 'start',
    question: {
      en: 'How do I start?',
      ar: 'كيف أبدأ؟',
    },
    answer: {
      en: 'Book a consultation or send the details through the contact form. The most useful first message is what is going wrong and what it costs you — I reply within a day.',
      ar: 'احجز استشارة أو أرسل التفاصيل عبر نموذج التواصل. أنفع رسالة أولى هي ما الذي يسير بشكل خاطئ وكم يكلّفك — وأردّ خلال يوم.',
    },
  },
];
