import type { CaseStudy } from '@/lib/schemas';

export const sila: CaseStudy = {
  problem: {
    en: [
      'When infrastructure fails, messaging apps fail with it. Every mainstream messenger assumes a reachable server, a working cell tower and an account tied to a phone number. Remove any one of those and the app is a blank screen — precisely at the moment people most need to reach each other.',
      'Sila starts from the opposite assumption: there is no internet, no server, and no SIM. What there is, is a dense population of phones — and every one of them has a Bluetooth radio that works at close range without any network at all.',
      'The product question was whether an ordinary phone could become part of a communications fabric rather than a client of one. The engineering question was whether Bluetooth Low Energy, designed for pairing headphones, could be pushed into carrying a multi-hop message network on consumer hardware.',
    ],
    ar: [
      'عندما تتعطل البنية التحتية، تتعطل تطبيقات المراسلة معها. كل تطبيق مراسلة سائد يفترض وجود سيرفر يمكن الوصول إليه، وبرج اتصالات يعمل، وحساب مرتبط برقم هاتف. أزِل أياً من هذه الثلاثة وسيصبح التطبيق شاشة فارغة — تحديداً في اللحظة التي يحتاج فيها الناس للوصول لبعضهم أكثر ما يكون.',
      '«صِلة» تبدأ من الافتراض المعاكس: لا إنترنت، ولا سيرفر، ولا شريحة. الموجود فعلاً هو كثافة عالية من الهواتف — وكل واحد منها يحمل راديو بلوتوث يعمل على مدى قريب بدون أي شبكة إطلاقاً.',
      'السؤال المنتَجي كان: هل يمكن لهاتف عادي أن يصبح جزءاً من نسيج اتصالات بدلاً من أن يكون عميلاً له؟ والسؤال الهندسي كان: هل يمكن دفع Bluetooth Low Energy — المصمَّم لإقران سماعات — ليحمل شبكة رسائل متعددة القفزات على أجهزة استهلاكية؟',
    ],
  },
  constraints: [
    {
      en: 'No servers of any kind. Not "self-hosted" — none. There must be nothing to seize, block or switch off.',
      ar: 'لا سيرفرات من أي نوع. ليست «مستضافة ذاتياً» — بل معدومة. يجب ألا يوجد شيء يُصادَر أو يُحجَب أو يُطفأ.',
    },
    {
      en: 'No accounts, no phone numbers, no email. Identity has to work without a registry.',
      ar: 'لا حسابات ولا أرقام هواتف ولا بريد إلكتروني. يجب أن تعمل الهوية بدون سجل مركزي.',
    },
    {
      en: 'Battery is a hard budget. A relay that drains a phone in two hours is a relay nobody leaves running.',
      ar: 'البطارية ميزانية صارمة. المُرحِّل الذي يستهلك بطارية الهاتف في ساعتين هو مُرحِّل لن يتركه أحد يعمل.',
    },
    {
      en: 'Runs on the phones people already own — no beacons, no dongles, no rooting, both Android and iOS.',
      ar: 'يعمل على الهواتف التي يملكها الناس أصلاً — بدون beacons ولا أجهزة إضافية ولا root، على أندرويد و iOS معاً.',
    },
  ],
  architecture: {
    summary: {
      en: [
        'Each device runs simultaneously as a BLE peripheral (advertising and accepting connections) and a central (scanning and connecting out). That dual role is what makes the topology a mesh instead of a star: there are no gateway devices and no coordinator, so removing any handset degrades the network rather than partitioning it.',
        'Messages are addressed to a recipient and relayed hop by hop. A device that cannot reach the destination directly stores the message and forwards it when a new peer comes into range, which is what lets the network span distances far greater than Bluetooth range and survive nodes that are never simultaneously connected.',
        'Flutter owns the UI, storage and routing policy. The BLE work has to be native — background execution, advertising and connection lifecycles differ too much between Android and iOS to abstract away — so the native layer is written per platform and exposed to Dart through Pigeon-generated channels, giving a single type-checked interface instead of hand-written, stringly-typed method calls.',
      ],
      ar: [
        'كل جهاز يعمل في الوقت نفسه كـ BLE peripheral (يُعلن ويقبل الاتصالات) وكـ central (يمسح ويتصل بالخارج). هذا الدور المزدوج هو ما يجعل الطوبولوجيا شبكة mesh لا نجمة: لا توجد أجهزة بوابة ولا مُنسّق، فإزالة أي هاتف تُضعِف الشبكة بدل أن تقسمها.',
        'الرسائل تُعنوَن للمستلم وتُرحَّل قفزةً بقفزة. الجهاز الذي لا يستطيع الوصول للهدف مباشرة يخزّن الرسالة ويُمرّرها عند دخول نظير جديد إلى المدى، وهذا ما يتيح للشبكة أن تمتد لمسافات أكبر بكثير من مدى البلوتوث وأن تصمد مع عقد لا تتصل أبداً في اللحظة نفسها.',
        'Flutter يملك الواجهة والتخزين وسياسة التوجيه. أما عمل BLE فيجب أن يكون native — التنفيذ في الخلفية ودورات حياة الإعلان والاتصال تختلف كثيراً بين أندرويد و iOS بحيث لا يمكن تجريدها — فكُتبت الطبقة الأصلية لكل منصة وعُرِضت لـ Dart عبر قنوات مولّدة بـ Pigeon، ما يمنح واجهة واحدة مُتحقَّق من أنواعها بدل استدعاءات مكتوبة يدوياً بنصوص.',
      ],
    },
    layers: [
      {
        name: 'Flutter / Dart',
        role: {
          en: 'UI, local store, routing policy, message lifecycle',
          ar: 'الواجهة والتخزين المحلي وسياسة التوجيه ودورة حياة الرسالة',
        },
      },
      {
        name: 'Pigeon platform channels',
        role: {
          en: 'Type-safe, code-generated Dart ↔ native boundary',
          ar: 'حدّ مُولَّد وآمن الأنواع بين Dart والطبقة الأصلية',
        },
      },
      {
        name: 'Kotlin (Android BLE)',
        role: {
          en: 'Advertising, scanning, GATT server and client, background execution',
          ar: 'الإعلان والمسح وخادم وعميل GATT والتنفيذ في الخلفية',
        },
      },
      {
        name: 'Swift (iOS BLE)',
        role: {
          en: 'CoreBluetooth peripheral and central roles under iOS background limits',
          ar: 'أدوار peripheral و central في CoreBluetooth تحت قيود خلفية iOS',
        },
      },
      {
        name: 'Mesh relay layer',
        role: {
          en: 'Multi-hop forwarding with store-and-forward for absent peers',
          ar: 'تمرير متعدد القفزات مع تخزين وإرسال للنظائر الغائبة',
        },
      },
    ],
    diagram: 'mesh',
  },
  decisions: [
    {
      title: {
        en: 'Bluetooth Low Energy over Wi-Fi Direct',
        ar: 'Bluetooth Low Energy بدلاً من Wi-Fi Direct',
      },
      chose: 'Bluetooth Low Energy',
      over: 'Wi-Fi Direct / Wi-Fi Aware',
      because: {
        en: [
          'Wi-Fi Direct offers far more bandwidth, which is tempting until you look at what the network is actually carrying: short text messages. Bandwidth was never the bottleneck.',
          'What mattered was power draw, background behaviour and how many peers a device can hold at once. BLE wins on all three, and — critically — it is available and permitted on both platforms without the pairing prompts and vendor quirks that make Wi-Fi Direct unusable as invisible infrastructure.',
        ],
        ar: [
          'يوفّر Wi-Fi Direct نطاقاً أوسع بكثير، وهذا مغرٍ حتى تنظر إلى ما تحمله الشبكة فعلاً: رسائل نصية قصيرة. النطاق لم يكن يوماً عنق الزجاجة.',
          'المهم كان استهلاك الطاقة والسلوك في الخلفية وعدد النظائر التي يستطيع الجهاز الاحتفاظ بها معاً. BLE يتقدّم في الثلاثة — والأهم أنه متاح ومسموح على المنصتين بدون نوافذ الإقران وخصوصيات المصنّعين التي تجعل Wi-Fi Direct غير قابل للاستخدام كبنية تحتية غير مرئية.',
        ],
      },
    },
    {
      title: {
        en: 'Pigeon-generated channels over hand-written method channels',
        ar: 'قنوات مولّدة بـ Pigeon بدلاً من method channels يدوية',
      },
      chose: 'Pigeon code generation',
      over: 'MethodChannel with manual serialisation',
      because: {
        en: [
          'The Dart-to-native boundary here is not one or two calls. It carries connection state, peer discovery events, GATT read and write results, and error conditions, in both directions, on two platforms.',
          'Hand-written method channels make every one of those a stringly-typed contract that only breaks at runtime, on a device, in the field. Pigeon turns the same contract into generated code on both sides, so a signature change becomes a compile error on all three surfaces at once. On a project whose whole value is reliability when nothing else works, moving failures from runtime to compile time was the highest-leverage decision made.',
        ],
        ar: [
          'الحدّ بين Dart والطبقة الأصلية هنا ليس استدعاءً أو اثنين. إنه يحمل حالة الاتصال وأحداث اكتشاف النظائر ونتائج القراءة والكتابة في GATT وحالات الخطأ، في الاتجاهين، على منصتين.',
          'الـ method channels اليدوية تحوّل كل واحد من هذه إلى عقد مكتوب بنصوص لا يُكتشف خطؤه إلا في وقت التشغيل، على جهاز، في الميدان. أما Pigeon فيحوّل العقد نفسه إلى كود مولّد على الجهتين، فيصبح تغيير التوقيع خطأ تصريف على الأسطح الثلاثة في اللحظة نفسها. في مشروع قيمته كلها هي الموثوقية عندما لا يعمل أي شيء آخر، كان نقل الأعطال من وقت التشغيل إلى وقت التصريف أعلى قرار مردوداً في المشروع.',
        ],
      },
    },
    {
      title: {
        en: 'A written threat model before the first feature',
        ar: 'نموذج تهديد مكتوب قبل أول ميزة',
      },
      chose: 'Documented threat model driving the design',
      over: 'Shipping features and hardening later',
      because: {
        en: [
          'An anonymous relay network has adversaries a normal chat app does not: a hostile node that joins the mesh, an observer who cares about who is near whom rather than what was said, and a seized handset.',
          'Those threats constrain the data model itself — what is stored, for how long, and what a relay is allowed to learn about traffic it forwards. They cannot be retrofitted. Writing the threat model as one of nine architecture documents, before the feature work, is what kept those constraints in the design rather than in a backlog.',
        ],
        ar: [
          'شبكة تمرير مجهولة لها خصوم لا يواجههم تطبيق محادثة عادي: عقدة معادية تنضم للشبكة، ومراقب يهمه من كان قريباً من من لا ما قيل، وهاتف تم الاستيلاء عليه.',
          'هذه التهديدات تقيّد نموذج البيانات نفسه — ماذا يُخزَّن، ولكم من الوقت، وما يُسمح للمُرحِّل أن يعرفه عن حركة يمرّرها. ولا يمكن إضافتها لاحقاً. كتابة نموذج التهديد كواحدة من تسع وثائق معمارية، قبل العمل على المزايا، هي ما أبقى هذه القيود في التصميم بدل أن تكون في قائمة مهام مؤجلة.',
        ],
      },
    },
  ],
  outcome: {
    en: [
      'The application is 69 Dart source files with 15 test files, a per-platform native BLE implementation behind a single generated interface, and a nine-document architecture set covering the executive summary, architecture, threat model, native BLE spec, design system, UX flows, implementation status and roadmap.',
      'It is the project on this site with no backend to point at — which is exactly the claim. Everything that would normally live on a server lives in the protocol instead.',
    ],
    ar: [
      'التطبيق هو ٦٩ ملف Dart مع ١٥ ملف اختبار، وتنفيذ BLE أصلي لكل منصة خلف واجهة مولّدة واحدة، ومجموعة معمارية من تسع وثائق تغطي الملخص التنفيذي والمعمارية ونموذج التهديد ومواصفة BLE الأصلية ونظام التصميم ومسارات الاستخدام وحالة التنفيذ وخريطة الطريق.',
      'إنه المشروع الوحيد في هذا الموقع الذي لا يوجد فيه باكإند أُشير إليه — وهذا بالضبط هو الادعاء. كل ما يسكن عادةً في سيرفر يسكن هنا في البروتوكول بدلاً منه.',
    ],
  },
  lessons: [
    {
      en: 'Bluetooth background execution is where cross-platform abstractions go to die. Accepting two native implementations early cost less than fighting one abstraction for months.',
      ar: 'التنفيذ الخلفي للبلوتوث هو المكان الذي تموت فيه التجريدات العابرة للمنصات. قبول تنفيذين أصليين مبكراً كان أرخص من مصارعة تجريد واحد لأشهر.',
    },
    {
      en: 'Writing the docs first was not process theatre. On a protocol-shaped problem, the document is the design — the code is downstream of it.',
      ar: 'كتابة الوثائق أولاً لم تكن استعراضاً إجرائياً. في مشكلة على شكل بروتوكول، الوثيقة هي التصميم — والكود يأتي تالياً لها.',
    },
  ],
};
