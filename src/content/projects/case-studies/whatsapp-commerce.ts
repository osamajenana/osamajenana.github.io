import type { CaseStudy } from '@/lib/schemas';

export const whatsappCommerce: CaseStudy = {
  problem: {
    en: [
      'A multi-branch butcher and grocery business was taking every order by hand on WhatsApp. Staff typed prices from memory, orders lived in chat scrollback, and nobody could answer "what did branch three sell yesterday" without reading conversations.',
      'The obvious fix — build an app or a web store — was the wrong fix. Their customers were already ordering successfully; they just were not being recorded. Asking those customers to install anything would have traded a working channel for a funnel with a drop-off at every step.',
      'So the requirement inverted: keep WhatsApp as the entire storefront, and put a real system behind it. The customer experience should feel like the same conversation they were already having. The business should get catalog control, order state, branch-level reporting and payment collection.',
    ],
    ar: [
      'كان عمل ملاحم وبقالة متعدد الفروع يستقبل كل طلب يدوياً على واتساب. الموظفون يكتبون الأسعار من الذاكرة، والطلبات تسكن في سجل المحادثة، ولا أحد يستطيع الإجابة على «ماذا باع الفرع الثالث أمس» دون قراءة المحادثات.',
      'الحل البديهي — بناء تطبيق أو متجر ويب — كان الحل الخاطئ. عملاؤهم كانوا يطلبون بنجاح فعلاً؛ المشكلة أن الطلبات لم تكن تُسجَّل. ومطالبة هؤلاء العملاء بتثبيت أي شيء كانت ستبدّل قناةً ناجحة بمسار تحويل فيه تسرّب عند كل خطوة.',
      'فانقلب المطلب: أبقِ واتساب كامل الواجهة، وضَع نظاماً حقيقياً خلفه. يجب أن تبدو تجربة العميل كأنها المحادثة نفسها التي كان يجريها. ويجب أن يحصل العمل على تحكم بالكتالوج وحالة الطلبات وتقارير على مستوى الفرع وتحصيل المدفوعات.',
    ],
  },
  constraints: [
    {
      en: 'Customers install nothing and visit no website. WhatsApp is not a notification channel here — it is the entire product surface.',
      ar: 'العميل لا يثبّت شيئاً ولا يزور أي موقع. واتساب هنا ليس قناة إشعارات — بل هو سطح المنتج بالكامل.',
    },
    {
      en: "Meta's 24-hour customer service window is a hard platform rule: outside it, only pre-approved templates may be sent. Violating it risks the business number.",
      ar: 'نافذة خدمة العميل ٢٤ ساعة عند Meta قاعدة منصّة صارمة: خارجها لا يُسمح إلا بقوالب معتمدة مسبقاً. وخرقها يعرّض رقم العمل للخطر.',
    },
    {
      en: 'Each branch has its own catalog, stock and working hours, but head office needs one consolidated view.',
      ar: 'كل فرع له كتالوجه ومخزونه وساعات عمله، لكن الإدارة تحتاج رؤية موحّدة واحدة.',
    },
    {
      en: 'Conversations are stateful and long-lived. A customer can abandon mid-order and return hours later expecting to continue.',
      ar: 'المحادثات ذات حالة وطويلة العمر. يمكن للعميل أن يترك الطلب في منتصفه ويعود بعد ساعات متوقعاً المتابعة.',
    },
  ],
  architecture: {
    summary: {
      en: [
        'Two services, deliberately unequal. A Node/Fastify gateway sits at the edge and does nothing but speak Meta: verify the webhook signature, decrypt WhatsApp Flow payloads, normalise the message shape, and forward inward. It holds no database and no business rules — 14 source files in total. A Laravel application holds everything that is actually the business.',
        'The split exists because Meta protocol churn and business logic change for entirely unrelated reasons. When Meta alters a webhook envelope or rotates Flow encryption requirements, only the gateway moves. When pricing rules or branch behaviour change, the gateway is untouched. Both directions of that boundary are authenticated with HMAC signatures, so neither service will act on a request the other did not sign.',
        'Inside Laravel, the conversation is a state machine. A flow engine advances a customer through discrete steps, each one a class, with the current position persisted — which is what makes resuming an order hours later a lookup rather than a reconstruction. A dedicated window service tracks the 24-hour rule per conversation and decides whether a free-form message is permitted or a template dispatch is required, so platform compliance is a property of the system rather than a thing staff must remember.',
      ],
      ar: [
        'خدمتان، غير متكافئتين بالقصد. بوابة Node/Fastify تقف على الحدّ ولا تفعل شيئاً إلا التحدث مع Meta: تتحقق من توقيع الـ webhook، وتفك تشفير حِزم WhatsApp Flow، وتوحّد شكل الرسالة، وتمرّرها للداخل. لا تحمل قاعدة بيانات ولا قواعد أعمال — ١٤ ملفاً فقط. وتطبيق Laravel يحمل كل ما هو فعلاً «العمل».',
        'وُجد هذا الفصل لأن تغيّرات بروتوكول Meta ومنطق الأعمال تتغيّر لأسباب غير مترابطة إطلاقاً. عندما تُبدّل Meta مظروف webhook أو تُدوّر متطلبات تشفير Flow، تتحرك البوابة وحدها. وعندما تتغيّر قواعد التسعير أو سلوك الفروع، لا تُمَس البوابة. كلا اتجاهَي هذا الحدّ موثَّق بتواقيع HMAC، فلا تتصرف أي خدمة على طلب لم توقّعه الأخرى.',
        'داخل Laravel، المحادثة آلة حالة. محرّك flow يتقدّم بالعميل عبر خطوات منفصلة، كل واحدة صنف مستقل، مع تخزين الموضع الحالي — وهذا ما يجعل استئناف الطلب بعد ساعات عملية بحث لا عملية إعادة بناء. وخدمة مخصّصة تتابع قاعدة الـ ٢٤ ساعة لكل محادثة وتقرر إن كانت الرسالة الحرة مسموحة أم أن إرسال قالب مطلوب، فيصبح الالتزام بقواعد المنصة خاصية في النظام لا شيئاً على الموظفين تذكّره.',
      ],
    },
    layers: [
      {
        name: 'Fastify gateway (Node)',
        role: {
          en: 'Meta signature verification, Flow RSA/AES decryption, protocol translation — zero business logic',
          ar: 'التحقق من توقيع Meta وفك تشفير Flow بـ RSA/AES وترجمة البروتوكول — بدون أي منطق أعمال',
        },
      },
      {
        name: 'HMAC service boundary',
        role: {
          en: 'Both directions signed; neither service trusts an unsigned request',
          ar: 'الاتجاهان موقّعان؛ ولا خدمة تثق بطلب غير موقّع',
        },
      },
      {
        name: 'Flow engine (state machine)',
        role: {
          en: 'Step classes with persisted position, so an abandoned order resumes exactly where it stopped',
          ar: 'أصناف خطوات بموضع مخزَّن، فيُستأنف الطلب المتروك من حيث توقف بالضبط',
        },
      },
      {
        name: '24-hour window service',
        role: {
          en: 'Decides free-form vs. approved template per conversation, enforcing Meta policy in code',
          ar: 'تقرر بين الرسالة الحرة والقالب المعتمد لكل محادثة، مُلزِمةً سياسة Meta في الكود',
        },
      },
      {
        name: 'Laravel Reverb (WebSockets)',
        role: {
          en: 'Live order boards for head office and each branch without polling',
          ar: 'لوحات طلبات فورية للإدارة وكل فرع بدون polling',
        },
      },
      {
        name: 'Thawani payments',
        role: {
          en: 'Local payment rail with server-side verification',
          ar: 'بوابة دفع محلية بتحقق من جهة السيرفر',
        },
      },
      {
        name: 'Vue 3 + Inertia dashboards',
        role: {
          en: 'Two role-separated operator surfaces over one Laravel backend',
          ar: 'واجهتا تشغيل مفصولتان بالأدوار فوق باكإند Laravel واحد',
        },
      },
    ],
    diagram: 'whatsapp-commerce',
  },
  decisions: [
    {
      title: {
        en: 'A separate gateway service instead of a Laravel webhook controller',
        ar: 'خدمة بوابة منفصلة بدل controller webhook في Laravel',
      },
      chose: 'Standalone Node/Fastify gateway',
      over: 'Handling Meta webhooks directly inside Laravel',
      because: {
        en: [
          'A Laravel route would have been less infrastructure and fewer moving parts, and for a single-tenant store it might have been right.',
          'Three things pushed the other way. Meta requires raw-body signature verification, which fights framework middleware that has already parsed the request. WhatsApp Flow needs RSA and AES key handling that has no business sitting next to invoice logic. And webhook delivery must be acknowledged fast — a thin service that verifies, decrypts and forwards can return immediately regardless of how slow downstream work is.',
          'The gateway ended up at 14 files with its own crypto tests. That is the entire cost of never having to touch business code when Meta changes something.',
        ],
        ar: [
          'كان مسار Laravel واحد يعني بنية تحتية أقل وأجزاءً متحركة أقل، ولمتجر أحادي المستأجر ربما كان الصواب.',
          'لكن ثلاثة أمور دفعت للاتجاه الآخر. Meta تطلب التحقق من التوقيع على الـ body الخام، وهذا يتعارض مع middleware الإطار الذي حلّل الطلب سابقاً. و WhatsApp Flow يحتاج التعامل مع مفاتيح RSA و AES، ولا شأن لهذا بأن يجاور منطق الفواتير. وتسليم الـ webhook يجب أن يُقَر بسرعة — وخدمة نحيفة تتحقق وتفك التشفير وتمرّر تستطيع الرد فوراً بغضّ النظر عن بطء العمل خلفها.',
          'انتهت البوابة إلى ١٤ ملفاً باختبارات تشفير خاصة بها. هذه هي كامل تكلفة ألّا تلمس كود الأعمال أبداً عندما تُغيّر Meta شيئاً.',
        ],
      },
    },
    {
      title: {
        en: 'Persisted step classes instead of parsing conversation history',
        ar: 'أصناف خطوات مخزَّنة بدل تحليل سجل المحادثة',
      },
      chose: 'Explicit state machine with a stored position',
      over: 'Inferring intent from the message log each time',
      because: {
        en: [
          'Reading back the conversation to work out where a customer is sounds flexible and is a trap. It makes every reply an ambiguous parse, and it gets worse as the catalog grows.',
          'Modelling the flow as discrete step classes with the position written to the database made behaviour testable in isolation — which is a large part of why the test suite reached 53 files. It also made the abandoned-order case free: resuming is reading a row, not replaying a chat.',
        ],
        ar: [
          'قراءة المحادثة من جديد لاستنتاج موضع العميل تبدو مرنة وهي فخ. تجعل كل رد عملية تحليل غامضة، وتسوء أكثر مع نمو الكتالوج.',
          'نمذجة الـ flow كأصناف خطوات منفصلة مع كتابة الموضع في قاعدة البيانات جعلت السلوك قابلاً للاختبار بمعزل — وهذا جزء كبير من سبب وصول مجموعة الاختبارات إلى ٥٣ ملفاً. كما جعلت حالة الطلب المتروك مجانية: الاستئناف قراءة سجل، لا إعادة تشغيل محادثة.',
        ],
      },
    },
    {
      title: {
        en: 'Encoding the 24-hour rule in a service, not in staff training',
        ar: 'ترميز قاعدة الـ ٢٤ ساعة في خدمة، لا في تدريب الموظفين',
      },
      chose: 'A window service that gates every outbound message',
      over: 'Documenting the rule and trusting operators',
      because: {
        en: [
          'The penalty for breaking Meta policy is not a validation error — it is quality-rating damage to the business phone number, and eventually losing it. That is an existential risk for a store whose only channel is WhatsApp.',
          'Putting the rule in a service that every outbound message passes through means the system physically cannot send a free-form message outside the window; it dispatches an approved template instead. Compliance became a code path with a test, rather than a line in an onboarding document.',
        ],
        ar: [
          'عقوبة خرق سياسة Meta ليست خطأ تحقّق — بل ضرر في تقييم جودة رقم هاتف العمل، وفقدانه في النهاية. وهذا خطر وجودي لمتجر قناته الوحيدة هي واتساب.',
          'وضع القاعدة في خدمة تمر بها كل رسالة صادرة يعني أن النظام لا يستطيع فيزيائياً إرسال رسالة حرة خارج النافذة؛ بل يُرسل قالباً معتمداً بدلاً منها. صار الالتزام مسار كود له اختبار، لا سطراً في وثيقة تدريب.',
        ],
      },
    },
  ],
  outcome: {
    en: [
      'The platform runs as two independently deployable services: 176 PHP files across 23 models and 44 migrations in Laravel, 74 Vue components for the two dashboards, and a 14-file gateway. The Laravel side carries 53 Pest test files, weighted towards the payment and flow-engine paths where a defect costs real money.',
      'Beyond ordering, the system ships bulk campaign dispatch, Meta catalog and template synchronisation, invoice PDF generation, per-branch working hours, and an analytics package with revenue, best-selling and branch-comparison reporting. The branch mobile app is served by a documented API with its own written endpoint reference.',
      'The result the business actually asked for: the customer conversation did not change, and everything about it is now recorded, priced and reportable.',
    ],
    ar: [
      'تعمل المنصة كخدمتين قابلتين للنشر بشكل مستقل: ١٧٦ ملف PHP على ٢٣ موديلاً و٤٤ migration في Laravel، و٧٤ مكوّن Vue للوحتين، وبوابة من ١٤ ملفاً. الجانب Laravel يحمل ٥٣ ملف اختبار Pest، مُرجَّحة نحو مسارات الدفع ومحرّك الـ flow حيث يكلّف الخلل مالاً حقيقياً.',
      'وأبعد من الطلبات، يشحن النظام إرسال حملات جماعية، ومزامنة كتالوج وقوالب Meta، وإنشاء فواتير PDF، وساعات عمل لكل فرع، وحزمة تحليلات فيها تقارير إيرادات وأفضل المنتجات ومقارنة الفروع. وتطبيق الفروع على الموبايل تخدمه واجهة API موثَّقة بمرجع نقاط وصول مكتوب.',
      'النتيجة التي طلبها العمل فعلاً: محادثة العميل لم تتغيّر، وكل ما يجري فيها الآن مُسجَّل ومُسعَّر وقابل للتقرير.',
    ],
  },
  lessons: [
    {
      en: 'The best interface is sometimes the one the customer is already using. Building a "proper" storefront would have been more work and fewer orders.',
      ar: 'أفضل واجهة هي أحياناً تلك التي يستخدمها العميل أصلاً. بناء متجر «صحيح» كان سيعني عملاً أكثر وطلبات أقل.',
    },
    {
      en: 'When you integrate with a platform you do not control, isolate it behind a service you do. The seam pays for itself the first time the vendor changes something.',
      ar: 'عندما تتكامل مع منصة لا تتحكم بها، اعزلها خلف خدمة تتحكم بها. هذا الحدّ يسدّد ثمنه من أول مرة يغيّر المزوّد شيئاً.',
    },
    {
      en: 'Platform policy belongs in code. Any rule whose violation can end the business should be impossible to violate by hand.',
      ar: 'سياسة المنصة تنتمي إلى الكود. أي قاعدة يمكن أن يُنهي خرقها العمل يجب أن يكون خرقها يدوياً مستحيلاً.',
    },
  ],
};
