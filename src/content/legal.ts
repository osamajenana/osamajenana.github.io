import { company, SITE_URL } from '@/content/site';
import { legalDocument, parseOrThrow } from '@/lib/schemas';
import type { LegalDocument, LegalDocumentInput } from '@/lib/schemas';

/**
 * The three documents a platform reviewer looks for before anything else: a
 * privacy policy, terms of service, and standalone data deletion instructions.
 *
 * They are authored here rather than as MDX because they are structured, not
 * literary: a numbered section list with stable anchors, a term/detail table
 * for the data categories, and both languages mandatory. Zod refuses a
 * half-translated clause at build time.
 *
 * Company identity is interpolated from `company` rather than retyped, so the
 * legal name, address and registration numbers can only ever be wrong in one
 * place — and that place is the one transcribed from the certificate.
 *
 * These documents describe how the platform actually behaves. If the
 * behaviour changes — a new subprocessor, a different retention window — the
 * change belongs here on the same day it ships, and `updatedAt` moves with it.
 */

/** Bumped whenever any clause changes. Reviewers check for a stale policy. */
const EFFECTIVE = '2026-09-08';

const contactBlock = {
  en: [
    `${company.legalName.en}`,
    `${company.address.en}`,
    `Email: ${company.email} · Phone: ${company.phone.display}`,
    `Commercial registration ${company.registrationNumber} · Company number ${company.companyNumber}`,
  ].join('\n'),
  ar: [
    `${company.legalName.ar}`,
    `${company.address.ar}`,
    `البريد الإلكتروني: ${company.email} · الهاتف: ${company.phone.display}`,
    `السجل التجاري ${company.registrationNumber} · رقم الشركة ${company.companyNumber}`,
  ].join('\n'),
};

// --- privacy policy ---------------------------------------------------------

const privacyInput: LegalDocumentInput = {
  slug: 'privacy',
  title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  lead: {
    en: `How ${company.legalName.en} collects, uses, shares and retains personal data — on this website, and in the WhatsApp conversation platform we operate for business customers.`,
    ar: `كيف تجمع ${company.legalName.ar} البيانات الشخصية وتستخدمها وتشاركها وتحتفظ بها — على هذا الموقع، وداخل منصة محادثات واتساب التي نشغّلها لعملائنا من الأعمال.`,
  },
  updatedAt: EFFECTIVE,
  sections: [
    {
      id: 'who-we-are',
      heading: { en: 'Who we are', ar: 'من نحن' },
      body: {
        en: [
          `${company.legalName.en} is a technology company registered in Palestine under commercial registration number ${company.registrationNumber}, company number ${company.companyNumber}, with its registered office at ${company.address.en}.`,
          'We build custom software and we operate an AI-assisted WhatsApp conversation platform for businesses. This policy explains what we do with personal data in both capacities.',
          'For questions about this policy, or to exercise any of the rights described below, contact us at the details in the final section.',
        ],
        ar: [
          `${company.legalName.ar} شركة تقنية مسجّلة في فلسطين تحت رقم السجل التجاري ${company.registrationNumber}، ورقم الشركة ${company.companyNumber}، ومقرها المسجّل في ${company.address.ar}.`,
          'نبني برمجيات مخصّصة، ونشغّل منصة محادثات واتساب مدعومة بالذكاء الاصطناعي للأعمال. تشرح هذه السياسة ما نفعله بالبيانات الشخصية في الحالتين.',
          'للأسئلة حول هذه السياسة، أو لممارسة أي من الحقوق الموضّحة أدناه، تواصل معنا عبر البيانات الواردة في القسم الأخير.',
        ],
      },
    },
    {
      id: 'two-roles',
      heading: {
        en: 'Two roles: controller and processor',
        ar: 'دوران: مراقب البيانات ومعالجها',
      },
      body: {
        en: [
          'The distinction matters, because it decides who you should contact about your data.',
          'We are the controller for data we decide the purposes of ourselves: visitors to this website, people who send us a message through the contact form, and the business customers who hold an account with us.',
          'We are a processor for the conversation data that flows through the platform. When a customer messages a business that uses our platform, that business decides why the conversation happens and what is done with it; we process it on that business’s documented instructions. Requests about those conversations are normally answered by the business, though we act on any request sent directly to us — see "If you messaged a business" below.',
        ],
        ar: [
          'هذا التمييز مهم، لأنه يحدد الجهة التي ينبغي مراسلتها بشأن بياناتك.',
          'نحن مراقب البيانات لما نحدّد نحن أغراضه: زوّار هذا الموقع، ومن يرسل إلينا رسالة عبر نموذج التواصل، وعملاء الأعمال الذين يملكون حساباً لدينا.',
          'ونحن معالج البيانات لبيانات المحادثات التي تمرّ عبر المنصة. فعندما يراسل شخصٌ عملاً يستخدم منصّتنا، يكون ذلك العمل هو من يقرّر سبب المحادثة وما يُفعل بها؛ ونحن نعالجها بناءً على تعليماته الموثّقة. الطلبات المتعلقة بتلك المحادثات يجيب عنها العمل عادةً، غير أننا ننفّذ أي طلب يصلنا مباشرة — راجع «إذا راسلتَ عملاً» أدناه.',
        ],
      },
    },
    {
      id: 'data-we-collect',
      heading: { en: 'Data we collect', ar: 'البيانات التي نجمعها' },
      body: {
        en: [
          'We collect only what a stated purpose below actually needs. We do not buy personal data, and we do not build advertising profiles.',
        ],
        ar: [
          'لا نجمع إلا ما يحتاجه فعلاً غرضٌ مذكور أدناه. لا نشتري بيانات شخصية، ولا نبني ملفات إعلانية.',
        ],
      },
      rows: [
        {
          term: { en: 'Website enquiries', ar: 'استفسارات الموقع' },
          detail: {
            en: 'Name, email address, subject and message text you type into the contact form, plus the time it was submitted.',
            ar: 'الاسم والبريد الإلكتروني والموضوع ونص الرسالة الذي تكتبه في نموذج التواصل، مع وقت الإرسال.',
          },
        },
        {
          term: { en: 'Server logs', ar: 'سجلات الخادم' },
          detail: {
            en: 'IP address, user agent, requested URL, response status and timestamp. Written by the web server for security and debugging, not linked to a profile.',
            ar: 'عنوان IP ونوع المتصفح والرابط المطلوب وحالة الاستجابة والطابع الزمني. يكتبها خادم الويب للأمان وتتبّع الأخطاء، وليست مرتبطة بملف تعريف.',
          },
        },
        {
          term: { en: 'Business account data', ar: 'بيانات حساب العمل' },
          detail: {
            en: 'Contact name, business name, email, phone number, the Meta business assets you connect (WhatsApp Business Account ID, phone number ID, display name), and billing records.',
            ar: 'اسم جهة الاتصال واسم العمل والبريد والهاتف، وأصول Meta التي تربطها (معرّف حساب واتساب للأعمال، ومعرّف رقم الهاتف، والاسم الظاهر)، وسجلات الفوترة.',
          },
        },
        {
          term: { en: 'Conversation data', ar: 'بيانات المحادثات' },
          detail: {
            en: 'The WhatsApp phone number and profile name of the person messaging the business, message content, any media or documents sent, delivery and read receipts, and message timestamps. Processed on behalf of the business.',
            ar: 'رقم واتساب واسم الملف الشخصي لمن يراسل العمل، ومحتوى الرسائل، وأي وسائط أو مستندات مُرسَلة، وإشعارات التسليم والقراءة، وطوابع وقت الرسائل. تُعالَج نيابةً عن العمل.',
          },
        },
        {
          term: { en: 'Order and catalogue data', ar: 'بيانات الطلبات والكتالوج' },
          detail: {
            en: 'Where the business uses the platform for commerce: items selected, quantities, delivery address if the customer provides one, order status and payment status.',
            ar: 'حين يستخدم العمل المنصة للتجارة: الأصناف المختارة والكميات وعنوان التوصيل إن قدّمه العميل، وحالة الطلب وحالة الدفع.',
          },
        },
        {
          term: { en: 'AI processing data', ar: 'بيانات معالجة الذكاء الاصطناعي' },
          detail: {
            en: 'The message text and the conversation context sent to a language model provider to draft or suggest a reply, and the reply returned.',
            ar: 'نص الرسالة وسياق المحادثة المُرسَلان إلى مزوّد نموذج لغوي لصياغة ردّ أو اقتراحه، والردّ العائد منه.',
          },
        },
        {
          term: { en: 'Operational telemetry', ar: 'بيانات التشغيل' },
          detail: {
            en: 'Error traces, queue and delivery metrics, and audit records of who in the business account viewed or sent what.',
            ar: 'آثار الأخطاء، ومقاييس الطوابير والتسليم، وسجلات تدقيق لمن اطّلع أو أرسل ماذا داخل حساب العمل.',
          },
        },
      ],
    },
    {
      id: 'cookies',
      heading: { en: 'Cookies and local storage', ar: 'ملفات الارتباط والتخزين المحلي' },
      body: {
        en: [
          'This website sets no advertising or analytics cookies and runs no third-party trackers. Your theme and language choices are kept in your own browser’s local storage and never leave your device.',
          'The platform application sets a session cookie that is strictly necessary to keep a signed-in operator signed in. It carries no tracking value and expires when the session ends.',
        ],
        ar: [
          'لا يضع هذا الموقع أي ملفات ارتباط إعلانية أو تحليلية، ولا يشغّل أي أدوات تتبّع خارجية. أما اختياراتك للمظهر واللغة فتُحفَظ في التخزين المحلي لمتصفحك ولا تغادر جهازك.',
          'ويضع تطبيق المنصة ملف ارتباط للجلسة، وهو ضروري تماماً لإبقاء المشغّل مسجّل الدخول. لا يحمل أي قيمة تتبّع وينتهي بانتهاء الجلسة.',
        ],
      },
    },
    {
      id: 'how-we-use',
      heading: { en: 'What we use it for', ar: 'فيمَ نستخدمها' },
      items: [
        {
          en: 'Answering enquiries sent through the contact form, and the correspondence that follows.',
          ar: 'الإجابة على الاستفسارات المُرسَلة عبر نموذج التواصل، والمراسلات التي تليها.',
        },
        {
          en: 'Creating and administering business accounts, and providing the platform they subscribed to.',
          ar: 'إنشاء حسابات الأعمال وإدارتها، وتقديم المنصة التي اشتركوا فيها.',
        },
        {
          en: 'Delivering messages to and from WhatsApp through the Meta WhatsApp Business Platform.',
          ar: 'تسليم الرسائل من واتساب وإليه عبر منصة واتساب للأعمال من Meta.',
        },
        {
          en: 'Generating or suggesting replies, classifying intent, and routing a conversation to a human when the model should not be deciding.',
          ar: 'توليد الردود أو اقتراحها، وتصنيف نية الرسالة، وتحويل المحادثة إلى إنسان حين لا يجوز أن يقرّر الموديل.',
        },
        {
          en: 'Recording orders and payment status where the business uses the platform for commerce.',
          ar: 'تسجيل الطلبات وحالة الدفع حين يستخدم العمل المنصة للتجارة.',
        },
        {
          en: 'Keeping the service secure and available: rate limiting, abuse prevention, backups and incident investigation.',
          ar: 'إبقاء الخدمة آمنة ومتاحة: تحديد المعدل، ومنع الإساءة، والنسخ الاحتياطي، والتحقيق في الحوادث.',
        },
        {
          en: 'Billing, accounting and meeting our tax and commercial record-keeping obligations.',
          ar: 'الفوترة والمحاسبة والوفاء بالتزاماتنا الضريبية وحفظ السجلات التجارية.',
        },
        {
          en: 'Complying with the WhatsApp Business Messaging Policy and other platform rules that bind us as a Meta technology provider.',
          ar: 'الالتزام بسياسة مراسلة الأعمال في واتساب وسائر قواعد المنصات المُلزِمة لنا بصفتنا مزوّد تقنية لدى Meta.',
        },
      ],
    },
    {
      id: 'legal-basis',
      heading: { en: 'Our basis for processing', ar: 'أساسنا في المعالجة' },
      rows: [
        {
          term: { en: 'Performance of a contract', ar: 'تنفيذ عقد' },
          detail: {
            en: 'Account data, conversation data and order data — we cannot provide the platform a customer signed up for without processing them.',
            ar: 'بيانات الحساب والمحادثات والطلبات — لا يمكننا تقديم المنصة التي اشترك فيها العميل دون معالجتها.',
          },
        },
        {
          term: { en: 'Consent', ar: 'الموافقة' },
          detail: {
            en: 'Messages you choose to send us through the contact form or WhatsApp. You can withdraw it at any time by asking us to delete the correspondence.',
            ar: 'الرسائل التي تختار إرسالها إلينا عبر نموذج التواصل أو واتساب. ويمكنك سحبها في أي وقت بطلب حذف المراسلة.',
          },
        },
        {
          term: { en: 'Legitimate interests', ar: 'المصالح المشروعة' },
          detail: {
            en: 'Server logs, security measures, abuse prevention and service improvement — balanced against your rights, and limited to what those purposes need.',
            ar: 'سجلات الخادم وإجراءات الأمان ومنع الإساءة وتحسين الخدمة — موازَنةً بحقوقك، ومحصورةً بما تحتاجه تلك الأغراض.',
          },
        },
        {
          term: { en: 'Legal obligation', ar: 'التزام قانوني' },
          detail: {
            en: 'Invoices, accounting records and anything a competent authority lawfully requires us to keep or produce.',
            ar: 'الفواتير والسجلات المحاسبية وكل ما تُلزمنا جهة مختصة قانوناً بحفظه أو تقديمه.',
          },
        },
        {
          term: { en: 'Documented instructions', ar: 'تعليمات موثّقة' },
          detail: {
            en: 'For conversation data we act as a processor, on the instructions of the business customer who is the controller of it.',
            ar: 'في بيانات المحادثات نتصرّف كمعالج، وفق تعليمات عميل الأعمال الذي هو مراقبها.',
          },
        },
      ],
    },
    {
      id: 'sharing',
      heading: { en: 'Who we share data with', ar: 'مع من نشارك البيانات' },
      body: {
        en: [
          'We do not sell personal data, we do not rent it, and we do not share it for anyone else’s advertising. The recipients below are the complete list, and each one receives only what its stated function requires.',
        ],
        ar: [
          'لا نبيع البيانات الشخصية ولا نؤجّرها ولا نشاركها لأغراض إعلانية لأي طرف. والجهات أدناه هي القائمة الكاملة، ولا تتلقى كل جهة إلا ما تتطلبه وظيفتها المذكورة.',
        ],
      },
      rows: [
        {
          term: { en: 'Meta Platforms, Inc.', ar: 'Meta Platforms, Inc.' },
          detail: {
            en: 'Unavoidable and central: WhatsApp messages are delivered through the Meta WhatsApp Business Platform (Cloud API) and business assets are managed through the Meta Graph API. Meta receives recipient phone numbers, message content and media, template submissions, and delivery status. Meta processes that data under its own terms and privacy policy, which we do not control. Nothing in the platform sends Meta anything beyond what delivering the message requires.',
            ar: 'لا مفرّ منها وهي محورية: تُسلَّم رسائل واتساب عبر منصة واتساب للأعمال من Meta (Cloud API)، وتُدار أصول العمل عبر Meta Graph API. تتلقى Meta أرقام هواتف المستلمين ومحتوى الرسائل والوسائط وطلبات اعتماد القوالب وحالة التسليم. وتعالج Meta تلك البيانات وفق شروطها وسياسة خصوصيتها، وهما خارج سيطرتنا. ولا ترسل المنصة إلى Meta أي شيء يتجاوز ما يتطلبه تسليم الرسالة.',
          },
        },
        {
          term: { en: 'Language model providers', ar: 'مزوّدو النماذج اللغوية' },
          detail: {
            en: 'Message text and conversation context are sent to the model provider configured for the customer’s account, solely to generate or suggest a reply. We use providers under business terms that exclude our data from model training, and we retain no copy at the provider beyond the request wherever the provider offers that setting. Customers are told which provider their account uses.',
            ar: 'يُرسَل نص الرسالة وسياق المحادثة إلى مزوّد النموذج المُهيّأ لحساب العميل، لغرض توليد ردّ أو اقتراحه فقط. ونستخدم مزوّدين بشروط أعمال تستثني بياناتنا من تدريب النماذج، ولا نُبقي نسخة لدى المزوّد بعد الطلب حيثما أتاح المزوّد ذلك الإعداد. ويُبلَّغ العملاء بالمزوّد الذي يستخدمه حسابهم.',
          },
        },
        {
          term: { en: 'Payment providers', ar: 'مزوّدو الدفع' },
          detail: {
            en: 'Where a business collects payment through the platform, the payment provider receives the amount, reference and whatever the provider itself requires to process the transaction. Card details are entered on the provider’s own page and never reach our servers.',
            ar: 'حين يحصّل العمل مدفوعات عبر المنصة، يتلقّى مزوّد الدفع المبلغ والمرجع وما يطلبه هو لإتمام العملية. أما بيانات البطاقة فتُدخَل على صفحة المزوّد نفسه ولا تصل خوادمنا إطلاقاً.',
          },
        },
        {
          term: { en: 'Email delivery provider', ar: 'مزوّد إرسال البريد' },
          detail: {
            en: 'Transactional email — contact form notifications, account and billing notices — is delivered by a third-party email API, which receives the recipient address and the message body.',
            ar: 'يُسلَّم البريد الإجرائي — إشعارات نموذج التواصل وإشعارات الحساب والفوترة — عبر واجهة بريد خارجية تتلقّى عنوان المستلم ونص الرسالة.',
          },
        },
        {
          term: { en: 'Hosting', ar: 'الاستضافة' },
          detail: {
            en: 'The application and its database run on servers we administer ourselves at a commercial hosting provider. The provider supplies the infrastructure and has no functional access to application data.',
            ar: 'يعمل التطبيق وقاعدة بياناته على خوادم نديرها بأنفسنا لدى مزوّد استضافة تجاري. يوفّر المزوّد البنية التحتية ولا يملك وصولاً وظيفياً إلى بيانات التطبيق.',
          },
        },
        {
          term: {
            en: 'Professional advisers and authorities',
            ar: 'المستشارون المهنيون والجهات الرسمية',
          },
          detail: {
            en: 'Accountants, auditors and legal advisers under confidentiality, and any competent authority where disclosure is lawfully required. We tell the affected customer unless we are legally prohibited from doing so.',
            ar: 'المحاسبون والمدقّقون والمستشارون القانونيون بموجب سرية، وأي جهة مختصة حين يكون الإفصاح مطلوباً قانوناً. ونُبلغ العميل المعني ما لم يُمنَع ذلك قانوناً.',
          },
        },
      ],
    },
    {
      id: 'transfers',
      heading: { en: 'International transfers', ar: 'النقل الدولي للبيانات' },
      body: {
        en: [
          'Meta, the language model providers and the email delivery provider operate infrastructure outside Palestine, including in the United States and the European Union. Using the WhatsApp Business Platform necessarily means data crosses borders — there is no version of this service that keeps message delivery inside one country.',
          'Where a provider offers contractual transfer safeguards, such as standard contractual clauses, we accept them. Where a provider offers a regional processing option that suits a customer’s requirements, we will configure it on request.',
        ],
        ar: [
          'تشغّل Meta ومزوّدو النماذج اللغوية ومزوّد البريد بنى تحتية خارج فلسطين، منها الولايات المتحدة والاتحاد الأوروبي. واستخدام منصة واتساب للأعمال يعني بالضرورة عبور البيانات للحدود — فلا توجد نسخة من هذه الخدمة تُبقي تسليم الرسائل داخل بلد واحد.',
          'وحيثما أتاح المزوّد ضمانات تعاقدية للنقل، كالبنود التعاقدية النموذجية، نأخذ بها. وحيثما أتاح خيار معالجة إقليمية يناسب متطلبات عميل، نهيّئه عند الطلب.',
        ],
      },
    },
    {
      id: 'retention',
      heading: { en: 'How long we keep it', ar: 'مدة الاحتفاظ' },
      body: {
        en: ['Every category has an end date. Nothing is kept "just in case".'],
        ar: ['لكل فئة تاريخ انتهاء. ولا نحتفظ بشيء «تحسّباً».'],
      },
      rows: [
        {
          term: { en: 'Contact form messages', ar: 'رسائل نموذج التواصل' },
          detail: {
            en: '24 months from the last message in the thread, then deleted — unless the enquiry became a contract, in which case it is kept with the project record.',
            ar: '٢٤ شهراً من آخر رسالة في المراسلة، ثم تُحذف — إلا إذا تحوّل الاستفسار إلى عقد، فتُحفَظ مع سجل المشروع.',
          },
        },
        {
          term: { en: 'Server logs', ar: 'سجلات الخادم' },
          detail: {
            en: '30 days, then rotated out. Retained longer only for a specific security incident under investigation.',
            ar: '٣٠ يوماً ثم تُستبدَل. ولا تُحفَظ أطول إلا لحادثة أمنية بعينها قيد التحقيق.',
          },
        },
        {
          term: { en: 'Conversation and order data', ar: 'بيانات المحادثات والطلبات' },
          detail: {
            en: 'For as long as the business customer’s account is active, or for the shorter period that customer configures. Deleted within 30 days of account termination or of a verified deletion request.',
            ar: 'ما دام حساب عميل الأعمال نشطاً، أو للمدة الأقصر التي يضبطها ذلك العميل. وتُحذف خلال ٣٠ يوماً من إنهاء الحساب أو من طلب حذف مُتحقَّق منه.',
          },
        },
        {
          term: { en: 'AI request context', ar: 'سياق طلبات الذكاء الاصطناعي' },
          detail: {
            en: 'Not stored separately from the conversation it belongs to. It is deleted when that conversation is deleted.',
            ar: 'لا يُخزَّن منفصلاً عن المحادثة التي ينتمي إليها. ويُحذف بحذفها.',
          },
        },
        {
          term: { en: 'Account and billing records', ar: 'سجلات الحساب والفوترة' },
          detail: {
            en: 'Kept for the retention period that applicable tax and commercial law imposes on accounting records, counted from the end of the business relationship.',
            ar: 'تُحفَظ للمدة التي يفرضها القانون الضريبي والتجاري المعمول به على السجلات المحاسبية، محسوبةً من نهاية العلاقة التجارية.',
          },
        },
        {
          term: { en: 'Backups', ar: 'النسخ الاحتياطية' },
          detail: {
            en: 'Encrypted backups roll on a 35-day cycle. Data deleted from the live system disappears from backups within that cycle at the latest; it is never restored back into the live system.',
            ar: 'تدور النسخ الاحتياطية المشفّرة على دورة ٣٥ يوماً. والبيانات المحذوفة من النظام الحي تختفي من النسخ خلال تلك الدورة على أبعد تقدير، ولا تُعاد إلى النظام الحي أبداً.',
          },
        },
      ],
    },
    {
      id: 'security',
      heading: { en: 'How we protect it', ar: 'كيف نحميها' },
      items: [
        {
          en: 'All traffic to the website and the platform is served over TLS. Plain HTTP is redirected, never served.',
          ar: 'كل حركة البيانات إلى الموقع والمنصة تمرّ عبر TLS. ويُعاد توجيه HTTP العادي ولا يُخدَم أبداً.',
        },
        {
          en: 'Webhooks from Meta are verified against Meta’s signature on the raw request body; an unsigned or mis-signed request is rejected before anything reads it.',
          ar: 'تُتحقَّق webhooks الواردة من Meta مقابل توقيعها على جسم الطلب الخام؛ ويُرفض أي طلب غير موقّع أو خاطئ التوقيع قبل أن يقرأه أي شيء.',
        },
        {
          en: 'Internal services authenticate to each other with HMAC signatures, so no component acts on a request another component did not sign.',
          ar: 'تتوثّق الخدمات الداخلية فيما بينها بتواقيع HMAC، فلا يتصرّف أي مكوّن على طلب لم يوقّعه مكوّن آخر.',
        },
        {
          en: 'Credentials and API keys live in server environment configuration, never in the codebase and never in the browser.',
          ar: 'تسكن بيانات الاعتماد ومفاتيح الواجهات في إعدادات بيئة الخادم، لا في الكود ولا في المتصفح إطلاقاً.',
        },
        {
          en: 'Operator access is role-separated and least-privilege; who saw and sent what is recorded in an audit trail.',
          ar: 'وصول المشغّلين مفصول بالأدوار وبأقل صلاحية ممكنة؛ ويُسجَّل من اطّلع وأرسل ماذا في سجل تدقيق.',
        },
        {
          en: 'Backups are encrypted at rest and their restore path is exercised, not assumed.',
          ar: 'النسخ الاحتياطية مشفّرة في مكان تخزينها، ومسار استعادتها يُختبَر فعلياً لا يُفترَض.',
        },
        {
          en: 'No security is absolute. If a breach affects your personal data we will notify the affected customers and any authority we are required to inform, without undue delay, and tell you what we know rather than what sounds reassuring.',
          ar: 'لا يوجد أمان مطلق. وإن وقع اختراق يمسّ بياناتك الشخصية فسنُبلغ العملاء المتأثرين وأي جهة يُلزمنا القانون بإبلاغها، دون تأخير غير مبرَّر، وسنخبرك بما نعرفه لا بما يبدو مطمئناً.',
        },
      ],
    },
    {
      id: 'your-rights',
      heading: { en: 'Your rights', ar: 'حقوقك' },
      body: {
        en: [
          'Subject to the law that applies to you, you can ask us to do any of the following. We do not charge for it, and we answer within 30 days of verifying who you are.',
        ],
        ar: [
          'رهناً بالقانون المنطبق عليك، يمكنك أن تطلب منا أياً مما يلي. لا نتقاضى مقابلاً عن ذلك، ونجيب خلال ٣٠ يوماً من التحقق من هويتك.',
        ],
      },
      items: [
        {
          en: 'Access — get a copy of the personal data we hold about you, and know what we do with it.',
          ar: 'الاطّلاع — الحصول على نسخة من بياناتك الشخصية لدينا، ومعرفة ما نفعله بها.',
        },
        {
          en: 'Rectification — have anything inaccurate corrected, and anything incomplete completed.',
          ar: 'التصحيح — تصحيح أي بيان غير دقيق، وإكمال أي بيان ناقص.',
        },
        {
          en: 'Erasure — have your data deleted where we have no overriding legal reason to keep it. The steps are on the data deletion page.',
          ar: 'المحو — حذف بياناتك حيث لا يوجد سبب قانوني غالب لحفظها. والخطوات موجودة في صفحة حذف البيانات.',
        },
        {
          en: 'Restriction — have processing paused while a dispute about accuracy or lawfulness is resolved.',
          ar: 'التقييد — إيقاف المعالجة مؤقتاً ريثما يُحسم نزاع حول الدقة أو المشروعية.',
        },
        {
          en: 'Portability — receive the data you gave us in a structured, machine-readable format.',
          ar: 'قابلية النقل — تلقّي البيانات التي زوّدتنا بها في صيغة منظّمة مقروءة آلياً.',
        },
        {
          en: 'Objection — object to processing we base on legitimate interests, and we stop unless we can show compelling grounds.',
          ar: 'الاعتراض — الاعتراض على معالجة نستند فيها إلى المصالح المشروعة، فنتوقف ما لم نُثبت أسباباً قاهرة.',
        },
        {
          en: 'Withdraw consent — at any time, without affecting processing already carried out lawfully before the withdrawal.',
          ar: 'سحب الموافقة — في أي وقت، دون أن يمسّ ذلك معالجةً تمّت بشكل مشروع قبل السحب.',
        },
        {
          en: 'Complain — to your local data protection authority, if one has jurisdiction over you.',
          ar: 'التقدّم بشكوى — إلى هيئة حماية البيانات المحلية لديك، إن كان لها اختصاص عليك.',
        },
      ],
    },
    {
      id: 'end-users',
      heading: { en: 'If you messaged a business', ar: 'إذا راسلتَ عملاً' },
      body: {
        en: [
          'If you sent a WhatsApp message to a business that runs on our platform, that business is the controller of your conversation. It decides what the conversation is for, how long it is kept, and who inside the business can read it.',
          `The fastest route is therefore to ask that business directly. If you would rather not, or the business does not respond, write to ${company.email} with the WhatsApp number you messaged from and the name of the business. We will forward the request within five business days and act on it as soon as the business instructs us — and where we are ourselves the controller of the data in question, we act on it directly.`,
          'You can also stop the messages at any time by replying with a stop or unsubscribe request in the conversation, or by blocking the number in WhatsApp. An opt-out is honoured on the first request, not the second.',
        ],
        ar: [
          'إذا أرسلتَ رسالة واتساب إلى عمل يعمل على منصّتنا، فذلك العمل هو مراقب محادثتك. هو من يحدّد الغرض منها ومدة حفظها ومن يمكنه قراءتها داخل العمل.',
          `لذا فأسرع طريق هو مخاطبة ذلك العمل مباشرة. وإن فضّلتَ غير ذلك، أو لم يستجب العمل، فاكتب إلى ${company.email} ذاكراً رقم واتساب الذي راسلتَ منه واسم العمل. سنحوّل الطلب خلال خمسة أيام عمل وننفّذه فور تعليمات العمل — وحيث نكون نحن مراقب البيانات المعنية، ننفّذه مباشرة.`,
          'ويمكنك أيضاً إيقاف الرسائل في أي وقت بالردّ بطلب إيقاف أو إلغاء اشتراك داخل المحادثة، أو بحظر الرقم في واتساب. ويُنفَّذ طلب الإيقاف من أول مرة لا من الثانية.',
        ],
      },
    },
    {
      id: 'children',
      heading: { en: 'Children', ar: 'الأطفال' },
      body: {
        en: [
          'The platform is a business tool and is not directed at children. We do not knowingly collect data from anyone under 16. If you believe a child’s data has reached us, tell us and we will delete it.',
        ],
        ar: [
          'المنصة أداة أعمال وليست موجّهة للأطفال. ولا نجمع عن علم بيانات أي شخص دون السادسة عشرة. وإن كنت ترى أن بيانات طفل وصلت إلينا، فأخبرنا ونحذفها.',
        ],
      },
    },
    {
      id: 'changes',
      heading: { en: 'Changes to this policy', ar: 'التغييرات على هذه السياسة' },
      body: {
        en: [
          'When the platform’s behaviour changes — a new subprocessor, a different retention window — this policy changes on the same day, and the date at the top moves with it.',
          'Material changes are notified to business customers by email at least 30 days before they take effect, so there is time to object or to leave.',
        ],
        ar: [
          'حين يتغيّر سلوك المنصة — مُعالِج فرعي جديد، أو مدة احتفاظ مختلفة — تتغيّر هذه السياسة في اليوم نفسه، ويتحرك التاريخ في أعلاها معها.',
          'وتُبلَّغ التغييرات الجوهرية لعملاء الأعمال بالبريد قبل ثلاثين يوماً على الأقل من سريانها، ليتّسع الوقت للاعتراض أو المغادرة.',
        ],
      },
    },
    {
      id: 'contact',
      heading: { en: 'Contact us', ar: 'تواصل معنا' },
      body: {
        en: [
          'Privacy questions, rights requests and complaints all go to the same place:',
          contactBlock.en,
        ],
        ar: ['أسئلة الخصوصية وطلبات الحقوق والشكاوى تذهب كلها إلى المكان نفسه:', contactBlock.ar],
      },
    },
  ],
};

// --- terms of service -------------------------------------------------------

const termsInput: LegalDocumentInput = {
  slug: 'terms',
  title: { en: 'Terms of Service', ar: 'شروط الخدمة' },
  lead: {
    en: `The agreement between ${company.legalName.en} and the businesses that use our software, our platform and our development services.`,
    ar: `الاتفاق بين ${company.legalName.ar} والأعمال التي تستخدم برمجياتنا ومنصّتنا وخدمات التطوير لدينا.`,
  },
  updatedAt: EFFECTIVE,
  sections: [
    {
      id: 'parties',
      heading: { en: 'Who this agreement is with', ar: 'أطراف هذا الاتفاق' },
      body: {
        en: [
          `These terms are between ${company.legalName.en}, a company registered in Palestine under commercial registration number ${company.registrationNumber} with its registered office at ${company.address.en} ("we", "us"), and the business that uses our services ("you", "the Customer").`,
          `They apply to this website, to the WhatsApp conversation platform we operate, and to custom development work — except where a signed contract or statement of work says otherwise, in which case that document prevails over these terms for the work it covers.`,
          'The Privacy Policy forms part of this agreement.',
        ],
        ar: [
          `هذه الشروط بين ${company.legalName.ar}، وهي شركة مسجّلة في فلسطين تحت رقم السجل التجاري ${company.registrationNumber} ومقرها المسجّل في ${company.address.ar} («نحن»)، وبين العمل الذي يستخدم خدماتنا («أنت»، «العميل»).`,
          'وتسري على هذا الموقع، وعلى منصة محادثات واتساب التي نشغّلها، وعلى أعمال التطوير المخصّص — إلا حيث ينصّ عقد موقّع أو بيان عمل على خلاف ذلك، فتسود تلك الوثيقة على هذه الشروط في نطاق ما تغطّيه.',
          'وتُعدّ سياسة الخصوصية جزءاً من هذا الاتفاق.',
        ],
      },
    },
    {
      id: 'services',
      heading: { en: 'What we provide', ar: 'ما نقدّمه' },
      items: [
        {
          en: 'Access to the WhatsApp conversation platform as a hosted service, for the subscription term agreed with you.',
          ar: 'الوصول إلى منصة محادثات واتساب كخدمة مستضافة، لمدة الاشتراك المتفق عليها معك.',
        },
        {
          en: 'Configuration of your Meta business assets, message templates and conversation flows as a technology provider acting on your instructions.',
          ar: 'تهيئة أصول عملك لدى Meta وقوالب الرسائل ومسارات المحادثة، بصفتنا مزوّد تقنية يعمل وفق تعليماتك.',
        },
        {
          en: 'Custom software development, integration and maintenance under a separate scope and quotation.',
          ar: 'تطوير البرمجيات المخصّصة والتكامل والصيانة بنطاق وعرض سعر منفصلين.',
        },
        {
          en: 'Support during our working hours, through the channels named in your agreement.',
          ar: 'الدعم خلال ساعات عملنا، عبر القنوات المذكورة في اتفاقك.',
        },
      ],
    },
    {
      id: 'accounts',
      heading: { en: 'Eligibility and accounts', ar: 'الأهلية والحسابات' },
      items: [
        {
          en: 'The service is for business use. You must be at least 18 and authorised to bind the business you register.',
          ar: 'الخدمة للاستخدام التجاري. ويجب أن تكون بالغاً ثمانية عشر عاماً على الأقل ومخوّلاً بإلزام العمل الذي تسجّله.',
        },
        {
          en: 'Registration details must be accurate and kept current — platform verification depends on them.',
          ar: 'يجب أن تكون بيانات التسجيل دقيقة ومحدَّثة — فتحقّق المنصات يعتمد عليها.',
        },
        {
          en: 'You are responsible for your operators’ credentials and for everything done through your account. Tell us immediately if you suspect unauthorised access.',
          ar: 'أنت مسؤول عن بيانات اعتماد مشغّليك وعن كل ما يجري عبر حسابك. وأبلغنا فوراً إن اشتبهتَ بوصول غير مصرّح به.',
        },
        {
          en: 'You own your WhatsApp Business Account. We act as your technology provider on it; you may end that relationship at any time from Meta Business Manager.',
          ar: 'أنت تملك حساب واتساب للأعمال الخاص بك. ونحن نعمل عليه بصفتنا مزوّد التقنية لديك؛ ويمكنك إنهاء تلك العلاقة في أي وقت من Meta Business Manager.',
        },
      ],
    },
    {
      id: 'your-obligations',
      heading: { en: 'Your obligations', ar: 'التزاماتك' },
      body: {
        en: [
          'Most of the ways a WhatsApp business number gets restricted are things only you can prevent. These are not formalities.',
        ],
        ar: ['أغلب أسباب تقييد رقم واتساب للأعمال أمورٌ لا يمنعها إلا أنت. وهذه ليست شكليات.'],
      },
      items: [
        {
          en: 'Obtain opt-in from every recipient before you message them, keep a record of it, and honour opt-outs immediately.',
          ar: 'احصل على موافقة كل مستلم قبل مراسلته، واحتفظ بسجل بها، ونفّذ طلبات إيقاف الاشتراك فوراً.',
        },
        {
          en: 'Comply with the WhatsApp Business Terms, the WhatsApp Business Messaging Policy, the Meta Commerce Policy and any other platform rule that applies to your account.',
          ar: 'التزم بشروط واتساب للأعمال وسياسة مراسلة الأعمال وسياسة التجارة لدى Meta وأي قاعدة منصة أخرى تنطبق على حسابك.',
        },
        {
          en: 'Have a lawful basis for every contact record you upload, and provide your own privacy notice to the people you message.',
          ar: 'اضمن وجود أساس قانوني لكل سجل جهة اتصال ترفعه، وقدّم إشعار خصوصيتك للأشخاص الذين تراسلهم.',
        },
        {
          en: 'Do not use the service for goods or services prohibited by Meta, and do not misrepresent who the business is.',
          ar: 'لا تستخدم الخدمة لسلع أو خدمات تحظرها Meta، ولا تُضلّل بشأن هوية العمل.',
        },
        {
          en: 'Keep a human reachable. Where a conversation needs a person, your operators are the person.',
          ar: 'أبقِ إنساناً متاحاً. فحين تحتاج المحادثة إلى شخص، مشغّلوك هم ذلك الشخص.',
        },
      ],
    },
    {
      id: 'acceptable-use',
      heading: { en: 'Acceptable use', ar: 'الاستخدام المقبول' },
      body: {
        en: ['You may not, and may not permit anyone else to:'],
        ar: ['لا يجوز لك، ولا أن تسمح لغيرك بأن:'],
      },
      items: [
        {
          en: 'Send unsolicited bulk messages, or use the service for spam, phishing, fraud or impersonation.',
          ar: 'يرسل رسائل جماعية غير مطلوبة، أو يستخدم الخدمة للإزعاج أو التصيّد أو الاحتيال أو انتحال الهوية.',
        },
        {
          en: 'Send unlawful, hateful, harassing or infringing content, or content prohibited by the platforms we deliver through.',
          ar: 'يرسل محتوى غير قانوني أو كارهاً أو متحرّشاً أو منتهكاً للحقوق، أو محتوى تحظره المنصات التي نسلّم عبرها.',
        },
        {
          en: 'Circumvent rate limits, probe or interfere with the service’s security, or attempt to access another customer’s data.',
          ar: 'يتجاوز حدود المعدل، أو يعبث بأمان الخدمة أو يستكشفه، أو يحاول الوصول إلى بيانات عميل آخر.',
        },
        {
          en: 'Reverse engineer, copy or resell the platform, or offer it to third parties as your own service, without our written agreement.',
          ar: 'يعكس هندسة المنصة أو ينسخها أو يعيد بيعها، أو يقدّمها للغير كخدمة خاصة به، دون اتفاق خطي منّا.',
        },
        {
          en: 'Use the service to make automated decisions with a legal or similarly significant effect on a person without meaningful human review.',
          ar: 'يستخدم الخدمة لاتخاذ قرارات آلية ذات أثر قانوني أو مماثل في الأهمية على شخص دون مراجعة بشرية فعلية.',
        },
      ],
    },
    {
      id: 'ai-output',
      heading: { en: 'AI-generated content', ar: 'المحتوى المولَّد بالذكاء الاصطناعي' },
      body: {
        en: [
          'The platform uses language models to draft replies, classify intent and summarise conversations. Model output is assistive. It can be wrong, and it is not legal, medical, financial or professional advice.',
          'You remain responsible for what is sent from your business number. Configure escalation to a human wherever a wrong answer would matter, and review automated replies before enabling them on a flow.',
          'We do not warrant that model output is accurate, complete or fit for a particular purpose, and we do not claim ownership of it.',
        ],
        ar: [
          'تستخدم المنصة نماذج لغوية لصياغة الردود وتصنيف النوايا وتلخيص المحادثات. ومخرجات الموديل مساعِدة. قد تكون خاطئة، وهي ليست استشارة قانونية أو طبية أو مالية أو مهنية.',
          'وتبقى أنت مسؤولاً عمّا يُرسَل من رقم عملك. فاضبط التحويل إلى إنسان في كل موضع تكون فيه الإجابة الخاطئة ذات أثر، وراجع الردود الآلية قبل تفعيلها على أي مسار.',
          'ولا نضمن أن مخرجات الموديل دقيقة أو كاملة أو صالحة لغرض معيّن، ولا ندّعي ملكيتها.',
        ],
      },
    },
    {
      id: 'third-party-platforms',
      heading: { en: 'Third-party platforms', ar: 'منصات الأطراف الثالثة' },
      body: {
        en: [
          'The service depends on the Meta WhatsApp Business Platform and the Meta Graph API. Meta sets its own rules, prices, rate limits and template approval decisions, and can change or withdraw them without consulting us.',
          'We are not responsible for a platform outage, a rejected template, a quality rating drop or a number restriction imposed by Meta — but we will tell you what happened, and help you resolve it.',
        ],
        ar: [
          'تعتمد الخدمة على منصة واتساب للأعمال من Meta وعلى Meta Graph API. وتضع Meta قواعدها وأسعارها وحدود معدلاتها وقرارات اعتماد قوالبها، ويمكنها تغييرها أو سحبها دون الرجوع إلينا.',
          'ولسنا مسؤولين عن انقطاع منصة، أو رفض قالب، أو انخفاض تقييم جودة، أو تقييد رقم تفرضه Meta — لكننا سنخبرك بما جرى ونساعدك على معالجته.',
        ],
      },
    },
    {
      id: 'fees',
      heading: { en: 'Fees and payment', ar: 'الرسوم والدفع' },
      items: [
        {
          en: 'Development work is quoted against a defined scope. Platform subscriptions are billed for the period stated in your agreement, in advance.',
          ar: 'تُسعَّر أعمال التطوير مقابل نطاق محدّد. وتُفوتَر اشتراكات المنصة للمدة المذكورة في اتفاقك، مقدَّماً.',
        },
        {
          en: 'Meta’s own conversation charges are set by Meta and are passed through to you at cost, itemised on the invoice.',
          ar: 'رسوم المحادثات الخاصة بـ Meta تحدّدها Meta، وتُمرَّر إليك بالتكلفة، مفصّلةً في الفاتورة.',
        },
        {
          en: 'Fees exclude taxes and bank charges unless the quotation says otherwise.',
          ar: 'الرسوم لا تشمل الضرائب ورسوم البنوك ما لم ينص عرض السعر على خلاف ذلك.',
        },
        {
          en: 'Invoices are due within the period on the invoice. We may suspend the service after written notice if an undisputed invoice stays unpaid for 14 days beyond its due date; your data is not deleted during a suspension.',
          ar: 'تُستحق الفواتير خلال المدة المذكورة عليها. ويجوز لنا تعليق الخدمة بعد إشعار خطي إن بقيت فاتورة غير متنازع عليها دون سداد أربعة عشر يوماً بعد استحقاقها؛ ولا تُحذف بياناتك أثناء التعليق.',
        },
        {
          en: 'Price changes to a subscription take effect at the next renewal and are notified at least 30 days in advance.',
          ar: 'تسري تغييرات أسعار الاشتراك عند التجديد التالي، ويُبلَّغ عنها قبل ثلاثين يوماً على الأقل.',
        },
      ],
    },
    {
      id: 'intellectual-property',
      heading: { en: 'Intellectual property', ar: 'الملكية الفكرية' },
      body: {
        en: [
          'The platform, its source code, its architecture and everything we built before or outside your project remain ours. A subscription grants you a non-exclusive, non-transferable right to use it for the term, and nothing more.',
          'Your data, your content, your brand and your customer lists remain yours. You grant us only the licence we need to host and process them in order to provide the service.',
          'For bespoke development, ownership of the deliverables specific to your project transfers to you on full payment, excluding our pre-existing components and general-purpose libraries, which you receive a perpetual licence to use within that deliverable.',
          'We may name you as a client and describe the work in general terms unless your agreement says we may not.',
        ],
        ar: [
          'المنصة وشيفرتها المصدرية ومعمارها وكل ما بنيناه قبل مشروعك أو خارجه يبقى ملكاً لنا. ويمنحك الاشتراك حقاً غير حصري وغير قابل للتحويل في استخدامها خلال المدة، لا أكثر.',
          'وبياناتك ومحتواك وعلامتك وقوائم عملائك تبقى لك. وتمنحنا فقط الترخيص اللازم لاستضافتها ومعالجتها بغرض تقديم الخدمة.',
          'وفي التطوير المخصّص، تنتقل ملكية المخرجات الخاصة بمشروعك إليك عند السداد الكامل، باستثناء مكوّناتنا السابقة والمكتبات عامة الغرض، وتحصل على ترخيص دائم باستخدامها ضمن ذلك المخرَج.',
          'ويجوز لنا ذكر اسمك كعميل ووصف العمل بعبارات عامة، ما لم ينص اتفاقك على المنع.',
        ],
      },
    },
    {
      id: 'data-protection',
      heading: { en: 'Data protection', ar: 'حماية البيانات' },
      body: {
        en: [
          'For the personal data inside your account you are the controller and we are the processor. We process it on your documented instructions, keep our staff under confidentiality, apply the security measures described in the Privacy Policy, and use only the subprocessors listed there.',
          'We will assist you, at your cost where the work is substantial, with data subject requests, impact assessments and breach notifications. A separate data processing agreement is available on request.',
        ],
        ar: [
          'بالنسبة للبيانات الشخصية داخل حسابك، أنت مراقب البيانات ونحن معالجها. نعالجها وفق تعليماتك الموثّقة، ونُلزم موظفينا بالسرية، ونطبّق إجراءات الأمان الموصوفة في سياسة الخصوصية، ولا نستخدم إلا المعالِجين الفرعيين المذكورين فيها.',
          'وسنساعدك — بتكلفة عليك حيث يكون العمل كبيراً — في طلبات أصحاب البيانات وتقييمات الأثر وإشعارات الاختراق. وتتوفر اتفاقية معالجة بيانات منفصلة عند الطلب.',
        ],
      },
    },
    {
      id: 'availability',
      heading: { en: 'Availability and maintenance', ar: 'التوافر والصيانة' },
      body: {
        en: [
          'We aim for continuous availability but do not guarantee an uptime figure unless a signed service level agreement states one.',
          'Planned maintenance is announced in advance and scheduled outside business hours where possible. Emergency maintenance may happen without notice; we tell you as soon as the incident allows.',
        ],
        ar: [
          'نستهدف التوافر المستمر، لكننا لا نضمن نسبة تشغيل محدّدة ما لم تنص عليها اتفاقية مستوى خدمة موقّعة.',
          'وتُعلَن الصيانة المخطّطة مسبقاً وتُجدوَل خارج ساعات العمل قدر الإمكان. أما الصيانة الطارئة فقد تقع دون إشعار؛ ونُخبرك فور ما تسمح به الحادثة.',
        ],
      },
    },
    {
      id: 'suspension',
      heading: { en: 'Suspension and termination', ar: 'التعليق والإنهاء' },
      items: [
        {
          en: 'Either party may end a subscription with 30 days’ written notice, effective at the end of the current billing period.',
          ar: 'لأي من الطرفين إنهاء الاشتراك بإشعار خطي مدته ثلاثون يوماً، يسري في نهاية دورة الفوترة الحالية.',
        },
        {
          en: 'We may suspend immediately, and terminate if it is not resolved, where use breaches the acceptable use section, endangers the service or other customers, or puts a platform relationship at risk.',
          ar: 'ويجوز لنا التعليق فوراً، والإنهاء إن لم تُعالَج المخالفة، حين يخرق الاستخدام قسم الاستخدام المقبول، أو يعرّض الخدمة أو عملاء آخرين للخطر، أو يهدّد علاقة مع منصة.',
        },
        {
          en: 'On termination you can export your data. We keep it available for 30 days, then delete it in line with the Privacy Policy.',
          ar: 'وعند الإنهاء يمكنك تصدير بياناتك. ونُبقيها متاحة ثلاثين يوماً ثم نحذفها وفق سياسة الخصوصية.',
        },
        {
          en: 'Fees already due remain payable. Prepaid fees for a period we did not serve are refunded pro rata, unless we terminated for your breach.',
          ar: 'وتبقى الرسوم المستحقة واجبة السداد. وتُردّ الرسوم المدفوعة مقدَّماً عن مدة لم نخدمها بالتناسب، ما لم يكن الإنهاء بسبب مخالفتك.',
        },
      ],
    },
    {
      id: 'warranties',
      heading: { en: 'Warranties and disclaimers', ar: 'الضمانات وإخلاء المسؤولية' },
      body: {
        en: [
          'We warrant that we provide the service with reasonable skill and care, and that we have the right to grant the licences in this agreement.',
          'Beyond that, and to the extent the law allows, the service is provided as is. We do not warrant that it will be uninterrupted or error-free, that model output will be accurate, or that it will meet a requirement you did not tell us about.',
        ],
        ar: [
          'نضمن أن نقدّم الخدمة بمهارة وعناية معقولتين، وأن لنا الحق في منح التراخيص الواردة في هذا الاتفاق.',
          'وفيما عدا ذلك، وبالقدر الذي يسمح به القانون، تُقدَّم الخدمة كما هي. ولا نضمن أنها ستكون بلا انقطاع أو بلا أخطاء، ولا أن مخرجات الموديل ستكون دقيقة، ولا أنها ستلبّي متطلباً لم تخبرنا به.',
        ],
      },
    },
    {
      id: 'liability',
      heading: { en: 'Limitation of liability', ar: 'حدود المسؤولية' },
      body: {
        en: [
          'Neither party is liable for indirect or consequential loss, lost profit, lost revenue, lost data value or business interruption.',
          'Our total liability arising out of this agreement in any twelve-month period is limited to the fees you paid us in that period.',
          'Nothing in this section limits liability for fraud, wilful misconduct, or anything the law does not permit us to limit.',
        ],
        ar: [
          'لا يُسأل أي من الطرفين عن الخسائر غير المباشرة أو التبعية، أو فوات الربح، أو فوات الإيراد، أو خسارة قيمة البيانات، أو تعطّل الأعمال.',
          'وتقتصر مسؤوليتنا الإجمالية الناشئة عن هذا الاتفاق في أي فترة اثني عشر شهراً على الرسوم التي دفعتها لنا في تلك الفترة.',
          'ولا شيء في هذا القسم يحدّ من المسؤولية عن الاحتيال أو سوء السلوك المتعمَّد أو أي أمر لا يسمح القانون بتحديده.',
        ],
      },
    },
    {
      id: 'indemnity',
      heading: { en: 'Indemnity', ar: 'التعويض' },
      body: {
        en: [
          'You indemnify us against claims, fines and reasonable costs arising from your content, from messages sent without a valid opt-in, from your breach of a platform policy, or from your use of the service in breach of this agreement.',
        ],
        ar: [
          'تعوّضنا عن المطالبات والغرامات والتكاليف المعقولة الناشئة عن محتواك، أو عن رسائل أُرسلت دون موافقة صحيحة، أو عن مخالفتك لسياسة منصة، أو عن استخدامك الخدمة بالمخالفة لهذا الاتفاق.',
        ],
      },
    },
    {
      id: 'governing-law',
      heading: { en: 'Governing law', ar: 'القانون الواجب التطبيق' },
      body: {
        en: [
          'This agreement is governed by the laws of Palestine, and the competent courts of Gaza have jurisdiction — without prejudice to any mandatory right you have under the law of your own country.',
          'If a clause is held unenforceable, the rest stays in force.',
        ],
        ar: [
          'يخضع هذا الاتفاق لقوانين فلسطين، وتختص محاكم غزة المختصة بالنظر فيه — دون إخلال بأي حق إلزامي لك بموجب قانون بلدك.',
          'وإذا تعذّر تنفيذ بند، يبقى سائر الاتفاق نافذاً.',
        ],
      },
    },
    {
      id: 'changes',
      heading: { en: 'Changes to these terms', ar: 'التغييرات على هذه الشروط' },
      body: {
        en: [
          'We may update these terms. Material changes are notified by email at least 30 days before they take effect; continuing to use the service after that date is acceptance. If you do not accept them, you may terminate before they take effect and receive a pro rata refund of prepaid fees.',
        ],
        ar: [
          'قد نحدّث هذه الشروط. وتُبلَّغ التغييرات الجوهرية بالبريد قبل ثلاثين يوماً على الأقل من سريانها؛ ويُعدّ استمرارك في استخدام الخدمة بعد ذلك التاريخ قبولاً بها. وإن لم تقبلها، فلك الإنهاء قبل سريانها واسترداد الرسوم المدفوعة مقدَّماً بالتناسب.',
        ],
      },
    },
    {
      id: 'contact',
      heading: { en: 'Contact us', ar: 'تواصل معنا' },
      body: {
        en: ['Questions about these terms, and any contractual notice, go to:', contactBlock.en],
        ar: ['الأسئلة حول هذه الشروط، وأي إشعار تعاقدي، تُرسَل إلى:', contactBlock.ar],
      },
    },
  ],
};

// --- data deletion ----------------------------------------------------------

const dataDeletionInput: LegalDocumentInput = {
  slug: 'data-deletion',
  title: { en: 'Data Deletion', ar: 'حذف البيانات' },
  lead: {
    en: 'How to ask us to delete your data, what gets deleted, and how long it takes. One email is enough — there is no form to fill in and no account required.',
    ar: 'كيف تطلب منا حذف بياناتك، وما الذي يُحذف، وكم يستغرق ذلك. رسالة بريد واحدة تكفي — لا نموذج تملؤه ولا حساب يلزمك.',
  },
  updatedAt: EFFECTIVE,
  sections: [
    {
      id: 'summary',
      heading: { en: 'In short', ar: 'باختصار' },
      body: {
        en: [
          `Email ${company.email} with the subject "Data deletion request". Tell us the WhatsApp number or the email address the data is held against, and the name of the business you were dealing with if you know it.`,
          'We acknowledge within 3 business days, verify who you are, and complete a verified deletion within 30 calendar days. You get written confirmation when it is done.',
          'This page exists as a standing instruction. It applies whether you reached us through this website, through the WhatsApp platform, or through a Meta app that lists us as its technology provider.',
        ],
        ar: [
          `أرسل بريداً إلى ${company.email} بعنوان «طلب حذف بيانات». اذكر رقم واتساب أو البريد الإلكتروني المرتبط بالبيانات، واسم العمل الذي كنت تتعامل معه إن كنت تعرفه.`,
          'نُقرّ باستلام الطلب خلال ٣ أيام عمل، ونتحقق من هويتك، وننجز الحذف المُتحقَّق منه خلال ٣٠ يوماً تقويمياً. وتصلك تأكيد خطي عند الانتهاء.',
          'هذه الصفحة تعليمات دائمة. وتنطبق سواء وصلتنا عبر هذا الموقع، أو عبر منصة واتساب، أو عبر تطبيق لدى Meta يذكرنا كمزوّد تقنية له.',
        ],
      },
    },
    {
      id: 'how-to-request',
      heading: { en: 'How to make the request', ar: 'كيف تقدّم الطلب' },
      body: {
        en: ['Four steps. Nothing in them requires you to have an account with us.'],
        ar: ['أربع خطوات. ولا تتطلب أي منها أن يكون لديك حساب لدينا.'],
      },
      rows: [
        {
          term: { en: 'Step 1 — Send the request', ar: 'الخطوة ١ — أرسل الطلب' },
          detail: {
            en: `Email ${company.email} with "Data deletion request" in the subject line. Include the WhatsApp number, email address or account name your data is held against, and say whether you want everything deleted or only a specific conversation, order or document.`,
            ar: `أرسل بريداً إلى ${company.email} وضع في العنوان «طلب حذف بيانات». وأدرج رقم واتساب أو البريد الإلكتروني أو اسم الحساب المرتبط ببياناتك، وبيّن إن كنت تريد حذف كل شيء أم محادثة أو طلب أو مستند بعينه.`,
          },
        },
        {
          term: { en: 'Step 2 — We acknowledge', ar: 'الخطوة ٢ — نُقرّ بالاستلام' },
          detail: {
            en: 'Within 3 business days you get a reply confirming we have the request, naming the reference we will track it under, and telling you what we still need.',
            ar: 'خلال ٣ أيام عمل يصلك ردّ يؤكد استلام الطلب، ويذكر الرقم المرجعي الذي سنتابعه به، ويوضّح ما نحتاجه بعد.',
          },
        },
        {
          term: { en: 'Step 3 — We verify', ar: 'الخطوة ٣ — نتحقق' },
          detail: {
            en: 'We confirm the request really comes from you — normally by replying from the same address or number, or by a one-time code sent to it. This step protects you: we will not delete someone’s data on an unverified request. It takes up to 7 days.',
            ar: 'نتأكد أن الطلب صادر منك فعلاً — عادةً بالرد من العنوان أو الرقم نفسه، أو برمز لمرة واحدة يُرسَل إليه. هذه الخطوة لحمايتك: فلن نحذف بيانات أحد بناءً على طلب غير مُتحقَّق منه. وتستغرق حتى ٧ أيام.',
          },
        },
        {
          term: { en: 'Step 4 — We delete and confirm', ar: 'الخطوة ٤ — نحذف ونؤكد' },
          detail: {
            en: 'Deletion is executed and you receive written confirmation listing what was deleted and what, if anything, we are legally required to keep and for how long.',
            ar: 'يُنفَّذ الحذف وتصلك تأكيد خطي يعدّد ما حُذف، وما نحن ملزَمون قانوناً بحفظه — إن وُجد — وإلى متى.',
          },
        },
      ],
    },
    {
      id: 'timeline',
      heading: { en: 'How long it takes', ar: 'كم يستغرق' },
      rows: [
        {
          term: { en: 'Acknowledgement', ar: 'الإقرار بالاستلام' },
          detail: { en: 'Within 3 business days.', ar: 'خلال ٣ أيام عمل.' },
        },
        {
          term: { en: 'Identity verification', ar: 'التحقق من الهوية' },
          detail: { en: 'Up to 7 days from acknowledgement.', ar: 'حتى ٧ أيام من الإقرار.' },
        },
        {
          term: { en: 'Deletion from live systems', ar: 'الحذف من الأنظمة الحيّة' },
          detail: {
            en: 'Within 30 calendar days of a verified request. Most requests are completed well inside that.',
            ar: 'خلال ٣٠ يوماً تقويمياً من طلب مُتحقَّق منه. وتُنجَز أغلب الطلبات في وقت أقصر بكثير.',
          },
        },
        {
          term: { en: 'Deletion from backups', ar: 'الحذف من النسخ الاحتياطية' },
          detail: {
            en: 'Encrypted backups roll on a 35-day cycle, so a deleted record leaves them within a further 35 days at most. It is never restored into the live system.',
            ar: 'تدور النسخ الاحتياطية المشفّرة على دورة ٣٥ يوماً، فيغادرها السجل المحذوف خلال ٣٥ يوماً إضافياً على أبعد تقدير. ولا يُعاد إلى النظام الحي أبداً.',
          },
        },
        {
          term: { en: 'If it will take longer', ar: 'إن استغرق وقتاً أطول' },
          detail: {
            en: 'A complex request may need up to a further 30 days. If that happens we tell you before the first 30 days are up, and we tell you why.',
            ar: 'قد يحتاج الطلب المعقّد إلى ٣٠ يوماً إضافية. وإن حدث ذلك نُخبرك قبل انقضاء الثلاثين الأولى، ونوضّح السبب.',
          },
        },
      ],
    },
    {
      id: 'what-gets-deleted',
      heading: { en: 'What gets deleted', ar: 'ما الذي يُحذف' },
      items: [
        {
          en: 'Your WhatsApp conversation history held on the platform, including message content, media and attachments.',
          ar: 'سجل محادثات واتساب الخاص بك المحفوظ على المنصة، بما فيه محتوى الرسائل والوسائط والمرفقات.',
        },
        {
          en: 'Your phone number, WhatsApp profile name and any contact record built from them.',
          ar: 'رقم هاتفك واسم ملفك الشخصي على واتساب وأي سجل جهة اتصال بُني منهما.',
        },
        {
          en: 'Orders, delivery addresses and any notes an operator attached to your conversation.',
          ar: 'الطلبات وعناوين التوصيل وأي ملاحظات أرفقها مشغّل بمحادثتك.',
        },
        {
          en: 'Messages you sent through this website’s contact form and the correspondence that followed.',
          ar: 'الرسائل التي أرسلتها عبر نموذج التواصل في هذا الموقع والمراسلات التي تلتها.',
        },
        {
          en: 'Business account data, operator accounts and configuration, where the request is to close a customer account.',
          ar: 'بيانات حساب العمل وحسابات المشغّلين والإعدادات، حين يكون الطلب إغلاق حساب عميل.',
        },
      ],
    },
    {
      id: 'what-we-keep',
      heading: { en: 'What we have to keep', ar: 'ما يلزمنا الاحتفاظ به' },
      body: {
        en: [
          'Deletion is not always total, and it would be dishonest to imply otherwise. These are the only exceptions:',
        ],
        ar: [
          'الحذف ليس شاملاً دائماً، ومن غير الأمانة الإيحاء بغير ذلك. وهذه هي الاستثناءات الوحيدة:',
        ],
      },
      items: [
        {
          en: 'Invoices and accounting records, for the period tax and commercial law requires. These identify a paying customer, not a conversation.',
          ar: 'الفواتير والسجلات المحاسبية، للمدة التي يفرضها القانون الضريبي والتجاري. وهي تعرّف عميلاً دافعاً لا محادثة.',
        },
        {
          en: 'A minimal record of the deletion request itself — that it was made, verified and completed — so we can prove we honoured it.',
          ar: 'سجل أدنى للطلب نفسه — أنه قُدّم وتُحقّق منه وأُنجز — لنتمكن من إثبات تنفيذه.',
        },
        {
          en: 'Data a competent authority has lawfully ordered us to preserve, for as long as that order stands.',
          ar: 'بيانات أمرت جهة مختصة قانوناً بحفظها، ما دام ذلك الأمر قائماً.',
        },
        {
          en: 'Aggregated statistics that can no longer identify you and cannot be traced back to you.',
          ar: 'إحصاءات مجمّعة لم تعد تعرّفك ولا يمكن ردّها إليك.',
        },
        {
          en: 'Copies held by Meta on WhatsApp’s own infrastructure, and on your own or the business’s phone. Those are outside our systems — delete the chat in WhatsApp, and use Meta’s own tools for anything Meta holds.',
          ar: 'النسخ الموجودة لدى Meta على بنية واتساب نفسها، وعلى هاتفك أو هاتف العمل. وهذه خارج أنظمتنا — احذف المحادثة من واتساب، واستخدم أدوات Meta لما تحتفظ به Meta.',
        },
      ],
    },
    {
      id: 'messaged-a-business',
      heading: {
        en: 'If you messaged a business, not us',
        ar: 'إذا راسلتَ عملاً لا نحن',
      },
      body: {
        en: [
          'When a business uses our platform, that business decides what happens to your conversation and we act on its instructions. Asking the business directly is usually the fastest route.',
          `You do not have to, though. Send the request to ${company.email} anyway. We forward it to the business within 5 business days, act on it as soon as they instruct us, and act on it directly where we are the controller. If the business does not respond, we tell you — we do not leave a request to expire in silence.`,
        ],
        ar: [
          'حين يستخدم عملٌ منصّتنا، فهو من يقرّر ما يحدث لمحادثتك ونحن ننفّذ تعليماته. ومخاطبة العمل مباشرةً هي الطريق الأسرع عادةً.',
          `لكنك لست مضطراً لذلك. أرسل الطلب إلى ${company.email} على أي حال. نحوّله إلى العمل خلال ٥ أيام عمل، وننفّذه فور تعليماته، وننفّذه مباشرةً حيث نكون نحن مراقب البيانات. وإن لم يستجب العمل نُخبرك — فنحن لا نترك طلباً ينقضي في صمت.`,
        ],
      },
    },
    {
      id: 'revoke-access',
      heading: {
        en: 'Removing our access through Meta',
        ar: 'إزالة وصولنا عبر Meta',
      },
      body: {
        en: [
          'If you are a business customer and want to end our access to your Meta assets, you can do it yourself without asking us:',
        ],
        ar: [
          'إن كنت عميل أعمال وتريد إنهاء وصولنا إلى أصولك لدى Meta، فيمكنك ذلك بنفسك دون الرجوع إلينا:',
        ],
      },
      items: [
        {
          en: 'Open Meta Business Manager → Business settings → Partners, select us, and remove the partner.',
          ar: 'افتح Meta Business Manager ← إعدادات الأعمال ← الشركاء، ثم اخترنا واحذف الشريك.',
        },
        {
          en: 'Or, under Business settings → Accounts → WhatsApp accounts, remove our access to the specific WhatsApp Business Account.',
          ar: 'أو من إعدادات الأعمال ← الحسابات ← حسابات واتساب، احذف وصولنا إلى حساب واتساب للأعمال المعني.',
        },
        {
          en: 'Removing access stops all future processing immediately. It does not delete what is already stored — send the deletion request above for that.',
          ar: 'إزالة الوصول توقف كل معالجة مستقبلية فوراً. لكنها لا تحذف ما هو مخزَّن أصلاً — لذلك أرسل طلب الحذف أعلاه.',
        },
      ],
    },
    {
      id: 'contact',
      heading: { en: 'Where to send it', ar: 'إلى أين تُرسله' },
      body: {
        en: [contactBlock.en],
        ar: [contactBlock.ar],
      },
    },
  ],
};

// --- registry ---------------------------------------------------------------

function build(input: LegalDocumentInput): LegalDocument {
  return parseOrThrow(legalDocument, input, `legal document "${input.slug}"`);
}

export const privacyPolicy = build(privacyInput);
export const termsOfService = build(termsInput);
export const dataDeletionPolicy = build(dataDeletionInput);

export const legalDocuments = [privacyPolicy, termsOfService, dataDeletionPolicy] as const;

/** Canonical URL of a policy, for JSON-LD and outward references. */
export function legalUrl(slug: LegalDocument['slug'], locale: string): string {
  return `${SITE_URL}/${locale}/${slug}`;
}
