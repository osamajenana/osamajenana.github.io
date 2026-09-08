import type { Localized } from '@/lib/schemas';

/**
 * The product page's content.
 *
 * This is a product page, not a case study: it describes what the platform
 * does today for anyone who buys it, in the present tense, without the
 * problem/architecture/trade-off narrative that /work is for. The case study
 * for the system this grew out of lives in the project registry and is linked
 * from the foot of the page for anyone who wants the engineering account.
 *
 * Every claim here has to be one the platform actually makes good on — a
 * platform reviewer reads this page next to the App Review submission, and a
 * capability described here that the product does not have is a rejection.
 */

export type PlatformEntry = {
  title: Localized;
  body: Localized;
};

/** What the platform does. Ordered by what a buyer asks about first. */
export const capabilities: PlatformEntry[] = [
  {
    title: { en: 'One inbox for every conversation', ar: 'صندوق وارد واحد لكل المحادثات' },
    body: {
      en: 'Every WhatsApp conversation the business has, in one shared inbox — assigned, tagged, searchable, with the full history attached to the customer rather than to whoever answered last time.',
      ar: 'كل محادثة واتساب لدى العمل في صندوق وارد واحد مشترك — مُسنَدة ومُوسَّمة وقابلة للبحث، وسجلّها الكامل مرتبط بالعميل لا بمن ردّ عليه آخر مرة.',
    },
  },
  {
    title: { en: 'Replies that know the business', ar: 'ردود تعرف العمل' },
    body: {
      en: 'The assistant answers from your catalogue, prices, policies and working hours — not from general knowledge. It reads and writes Arabic and English, and answers in the language the customer wrote in.',
      ar: 'يجيب المساعد من كتالوجك وأسعارك وسياساتك وساعات عملك — لا من معرفة عامة. ويقرأ العربية والإنجليزية ويكتبهما، ويردّ باللغة التي كتب بها العميل.',
    },
  },
  {
    title: { en: 'Handover to a human, by design', ar: 'التحويل إلى إنسان بالتصميم' },
    body: {
      en: 'The model steps aside when it is unsure, when the customer asks for a person, or when the topic is on your escalation list — complaints, refunds, anything with money or health in it. Silence is never the answer a customer gets.',
      ar: 'يتنحّى الموديل حين لا يكون واثقاً، أو حين يطلب العميل شخصاً، أو حين يكون الموضوع ضمن قائمة التحويل لديك — الشكاوى والمبالغ المستردّة وكل ما فيه مال أو صحة. ولا يكون الصمت أبداً هو ما يتلقاه العميل.',
    },
  },
  {
    title: { en: 'Guided flows instead of forms', ar: 'مسارات موجَّهة بدل النماذج' },
    body: {
      en: 'Ordering, booking and complaint intake run as stateful WhatsApp flows. A customer who abandons an order halfway and comes back three hours later carries on from the step they stopped at.',
      ar: 'يجري الطلب والحجز واستقبال الشكاوى كمسارات واتساب ذات حالة. والعميل الذي يترك طلبه في منتصفه ويعود بعد ثلاث ساعات يكمل من الخطوة التي توقف عندها.',
    },
  },
  {
    title: { en: 'Catalogue, orders and branches', ar: 'الكتالوج والطلبات والفروع' },
    body: {
      en: 'Products, prices, stock and hours per branch, with orders recorded as records that have a status — not as messages someone has to scroll back to find.',
      ar: 'منتجات وأسعار ومخزون وساعات عمل لكل فرع، مع تسجيل الطلبات كسجلات لها حالة — لا كرسائل يضطر أحدهم للعودة في المحادثة ليجدها.',
    },
  },
  {
    title: { en: 'The 24-hour window, handled in code', ar: 'نافذة الـ٢٤ ساعة، مُدارة في الكود' },
    body: {
      en: 'Meta allows free-form replies only inside 24 hours of the customer’s last message. The platform tracks that window per conversation and picks a free-form message or an approved template automatically, so nobody on your team has to remember the rule.',
      ar: 'لا تسمح Meta بالردود الحرة إلا خلال ٢٤ ساعة من آخر رسالة للعميل. وتتابع المنصة تلك النافذة لكل محادثة وتختار تلقائياً بين رسالة حرة وقالب معتمد، فلا يحتاج أحد في فريقك إلى تذكّر القاعدة.',
    },
  },
  {
    title: { en: 'Broadcasts that respect opt-in', ar: 'رسائل جماعية تحترم الموافقة' },
    body: {
      en: 'Segmented sends against templates Meta has approved, with opt-in recorded and opt-out honoured on the first request. The number stays healthy because the sending is disciplined, not because it is lucky.',
      ar: 'إرسال مقسَّم بالشرائح عبر قوالب اعتمدتها Meta، مع تسجيل الموافقة وتنفيذ طلب الإيقاف من أول مرة. ويبقى الرقم سليماً لأن الإرسال منضبط، لا لأنه محظوظ.',
    },
  },
  {
    title: { en: 'Numbers you can act on', ar: 'أرقام يمكن التصرف بناءً عليها' },
    body: {
      en: 'Response time, message volume, how much the assistant handled without a human, and order value by branch — on one board, live, without polling a report.',
      ar: 'زمن الاستجابة وحجم الرسائل وكم عالج المساعد دون إنسان وقيمة الطلبات حسب الفرع — على لوحة واحدة، فورية، دون انتظار تقرير.',
    },
  },
];

/** Who it is for. Written as situations, not industry labels. */
export const audience: PlatformEntry[] = [
  {
    title: { en: 'Businesses already selling on WhatsApp', ar: 'أعمال تبيع على واتساب أصلاً' },
    body: {
      en: 'Orders arrive by message, staff type prices from memory, and nobody can answer what a branch sold yesterday without reading chats. The channel works; it is just not being recorded.',
      ar: 'الطلبات تصل بالرسائل، والموظفون يكتبون الأسعار من الذاكرة، ولا أحد يعرف ماذا باع فرعٌ أمس دون قراءة المحادثات. القناة ناجحة؛ لكنها فقط غير مسجَّلة.',
    },
  },
  {
    title: { en: 'Clinics, salons and service teams', ar: 'العيادات والصالونات وفرق الخدمات' },
    body: {
      en: 'Bookings, reminders and rescheduling all happen in a chat thread. The appointment book and the conversation are two different places, and they disagree.',
      ar: 'الحجوزات والتذكيرات وإعادة الجدولة تجري كلها في محادثة. ودفتر المواعيد والمحادثة مكانان مختلفان، وهما لا يتفقان.',
    },
  },
  {
    title: { en: 'Multi-branch operations', ar: 'عمليات متعددة الفروع' },
    body: {
      en: 'Each branch has its own catalogue, stock and hours, and head office needs one consolidated view without taking the branches’ autonomy away.',
      ar: 'لكل فرع كتالوجه ومخزونه وساعاته، والإدارة تحتاج رؤية موحّدة دون أن تسلب الفروع استقلالها.',
    },
  },
  {
    title: { en: 'Teams answering the same questions', ar: 'فرق تجيب على الأسئلة نفسها' },
    body: {
      en: 'Most of the day goes on price, availability, location and delivery time. Those answers exist already — they just have to be typed by a person every single time.',
      ar: 'يذهب معظم اليوم في السعر والتوفر والموقع ووقت التوصيل. وهذه الإجابات موجودة أصلاً — لكن على شخص أن يكتبها في كل مرة.',
    },
  },
];

/** How it works, in the order a customer actually goes through it. */
export const steps: PlatformEntry[] = [
  {
    title: { en: 'Connect your WhatsApp Business Account', ar: 'اربط حساب واتساب للأعمال' },
    body: {
      en: 'You keep ownership of the number and the account. We are added as a technology provider on your Meta Business Manager, on the official WhatsApp Cloud API — no unofficial client, no shared number, and you can remove our access yourself at any time.',
      ar: 'تبقى ملكية الرقم والحساب لك. ونُضاف كمزوّد تقنية على Meta Business Manager الخاص بك، عبر WhatsApp Cloud API الرسمية — بلا عميل غير رسمي، وبلا رقم مشترك، ويمكنك إزالة وصولنا بنفسك في أي وقت.',
    },
  },
  {
    title: { en: 'Teach it the business', ar: 'علّمها العمل' },
    body: {
      en: 'Catalogue, price list, branches, working hours, delivery rules, refund policy and the list of topics that must always reach a person. This is the part that decides whether the answers are right.',
      ar: 'الكتالوج وقائمة الأسعار والفروع وساعات العمل وقواعد التوصيل وسياسة الاسترجاع وقائمة المواضيع التي يجب أن تصل إلى إنسان دائماً. وهذا هو الجزء الذي يحدّد صحة الإجابات.',
    },
  },
  {
    title: { en: 'Design the conversations', ar: 'صمّم المحادثات' },
    body: {
      en: 'We build the flows for what your customers actually do — place an order, book a slot, check a status, raise a complaint — and the templates Meta needs to approve for anything sent outside the 24-hour window.',
      ar: 'نبني المسارات لما يفعله عملاؤك فعلاً — طلب، حجز موعد، متابعة حالة، تقديم شكوى — والقوالب التي تحتاج Meta اعتمادها لكل ما يُرسَل خارج نافذة الـ٢٤ ساعة.',
    },
  },
  {
    title: { en: 'Go live with a human in the loop', ar: 'ابدأ التشغيل بوجود إنسان' },
    body: {
      en: 'You start in suggest mode: the assistant drafts, an operator reads and sends. Autonomous replies are switched on one flow at a time, once you have watched that flow behave. Nobody is asked to trust a model on day one.',
      ar: 'تبدأ بوضع الاقتراح: المساعد يصوغ، والمشغّل يقرأ ويُرسل. ثم تُفعَّل الردود المستقلة مساراً تلو الآخر، بعد أن تكون قد رأيت ذلك المسار يتصرّف. ولا يُطلب من أحد أن يثق بموديل من اليوم الأول.',
    },
  },
  {
    title: { en: 'Tune it with what you see', ar: 'اضبطها بما تراه' },
    body: {
      en: 'Every conversation is reviewable, every escalation is a signal, and the answers, flows and escalation rules change as the business does. This is where the deflection rate actually comes from.',
      ar: 'كل محادثة قابلة للمراجعة، وكل تحويل إشارة، وتتغير الإجابات والمسارات وقواعد التحويل مع تغيّر العمل. ومن هنا تأتي فعلياً نسبة المعالجة دون إنسان.',
    },
  },
];

/** The stack, named as it runs. Same technologies as the case study. */
export const platformStack = [
  'Meta WhatsApp Cloud API',
  'Meta Graph API',
  'Node.js / Fastify gateway',
  'Laravel',
  'Redis queues',
  'WebSockets',
  'Vue 3 + Inertia',
  'Docker + nginx',
] as const;

/** Case study on the system this grew out of, linked at the foot of the page. */
export const platformProofSlug = 'whatsapp-commerce';
