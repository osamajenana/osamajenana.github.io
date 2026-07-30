import type { Localized, Pillar } from '@/lib/schemas';

/**
 * Service offerings, one per pillar.
 *
 * No prices. A number without a scope is either an underquote you regret or an
 * overquote that loses the enquiry — and rates that make sense for a Gulf client
 * and a European one are not the same number. `engagement` sets the expectation
 * instead.
 */

export type Service = {
  pillar: Pillar;
  headline: Localized;
  /** The situation this is for, in the client's words rather than mine. */
  forWhom: Localized;
  /** Concrete things that get handed over. Vague deliverables lose trust. */
  deliverables: Localized[];
  /** A real project on this site that demonstrates it. */
  proofSlug: string;
};

export const services: Service[] = [
  {
    pillar: 'web',
    headline: {
      en: 'Build the system your operation actually runs on',
      ar: 'ابنِ النظام الذي يعمل عليه تشغيلك فعلاً',
    },
    forWhom: {
      en: 'You have outgrown spreadsheets and an off-the-shelf tool that almost fits. The work is real, the rules are specific, and nobody sells software shaped like your business.',
      ar: 'تجاوزت مرحلة الإكسل وأداة جاهزة «تكاد» تناسبك. العمل حقيقي والقواعد خاصة بك، ولا أحد يبيع برمجيات على شكل عملك.',
    },
    deliverables: [
      {
        en: 'A domain model that mirrors how your team actually works, not how software wishes they did',
        ar: 'نموذج نطاق يحاكي كيف يعمل فريقك فعلاً، لا كيف تتمنى البرمجيات أن يعمل',
      },
      {
        en: 'Operator surfaces separated by role, with permissions that hold',
        ar: 'واجهات تشغيل مفصولة بالأدوار، بصلاحيات تصمد',
      },
      {
        en: 'A documented REST API, so a mobile app or a partner integration is not a rewrite',
        ar: 'واجهة REST موثّقة، فلا يكون تطبيق موبايل أو تكامل شريك إعادة كتابة',
      },
      {
        en: 'Reporting that answers the questions you are asking now, and room for the next ones',
        ar: 'تقارير تجيب أسئلتك الحالية، ومساحة للأسئلة التالية',
      },
    ],
    proofSlug: 'dental-center-platform',
  },
  {
    pillar: 'ai',
    headline: {
      en: 'Put a model behind your operations without betting the business on one vendor',
      ar: 'ضَع موديلاً خلف عملياتك دون أن ترهن العمل لمزوّد واحد',
    },
    forWhom: {
      en: 'Customers are already talking to you — on WhatsApp, on Instagram, by voice — and a person answers every message by hand. Or you need data that no API will hand over.',
      ar: 'عملاؤك يحدّثونك أصلاً — على واتساب وإنستغرام وبالصوت — وشخصٌ يردّ على كل رسالة يدوياً. أو تحتاج بيانات لن تسلّمها لك أي واجهة API.',
    },
    deliverables: [
      {
        en: 'A provider-agnostic AI layer: the model is an adapter, so swapping it later is a config change',
        ar: 'طبقة AI مستقلة عن المزوّد: الموديل مُهايئ، فتبديله لاحقاً تغيير إعدادات',
      },
      {
        en: 'Channel integrations that survive platform policy — WhatsApp Cloud API, Messenger, Instagram',
        ar: 'تكاملات قنوات تصمد أمام سياسات المنصات — WhatsApp Cloud API و Messenger و Instagram',
      },
      {
        en: 'Guardrails and cost controls, so an unexpected month is not an unexpected invoice',
        ar: 'حدود وضوابط تكلفة، فلا يكون شهرٌ غير متوقع فاتورةً غير متوقعة',
      },
      {
        en: 'Escalation to a human where the model should not be deciding',
        ar: 'تحويل لإنسان في الحالات التي لا يجب أن يقرر فيها الموديل',
      },
    ],
    proofSlug: 'omnichannel-ai-assistant',
  },
  {
    pillar: 'infra',
    headline: {
      en: 'Make it run, and keep it running',
      ar: 'شغّله، وأبقِه شغّالاً',
    },
    forWhom: {
      en: 'The application exists but deploying it is a ritual, nobody knows if the backups restore, and the integration everyone needs is the one nobody volunteers for.',
      ar: 'التطبيق موجود لكن نشره طقسٌ مرهق، ولا أحد يعرف إن كانت النسخ الاحتياطية تُستعاد، والتكامل الذي يحتاجه الجميع هو الذي لا يتطوّع له أحد.',
    },
    deliverables: [
      {
        en: 'Docker or PM2 behind nginx on your own server, with TLS and a deploy you can run without me',
        ar: 'Docker أو PM2 خلف nginx على سيرفرك، مع TLS ونشر تستطيع تشغيله بدوني',
      },
      {
        en: 'Queues and WebSockets where they belong, so slow work leaves the request path',
        ar: 'طوابير و WebSockets في مواضعها، فيخرج العمل البطيء من مسار الطلب',
      },
      {
        en: 'Payment rails that reconcile: Thawani, JawwalPay, Apple Pay — verified server-side',
        ar: 'بوابات دفع تتطابق حساباتها: Thawani و JawwalPay و Apple Pay — مُتحقَّقة من جهة السيرفر',
      },
      {
        en: 'ERP synchronisation that does not silently drift — Odoo and SmartLife in production today',
        ar: 'مزامنة ERP لا تنحرف بصمت — Odoo و SmartLife في الإنتاج اليوم',
      },
    ],
    proofSlug: 'sharaa-dates',
  },
];
