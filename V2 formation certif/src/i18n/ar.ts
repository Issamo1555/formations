export const ar = {
  // Navigation
  nav: {
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    courses: 'الدورات',
    certificates: 'الشهادات',
    admin: 'الإدارة',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
  },

  // Landing page
  landing: {
    hero: {
      eyebrow: 'دورة 2026 • Python, PHP, n8n والذكاء الاصطناعي',
      title: 'تعلم البرمجة <span>من خلال مشاريع حقيقية</span>.',
      subtitle: 'تحول Smartcodai كل درس إلى تدريب عملي. تبرمج، تختبر، تتحقق من مهاراتك وتتقدم نحو الشهادة بدون إعدادات معقدة أو ضياع للوقت.',
      cta: 'ابدأ مجاناً',
      ctaSecondary: 'عرض المسارات',
      proof: '100% في المتصفح',
      proofCert: 'شهادة قابلة للتحقق',
    },
    features: {
      title: 'لماذا تختار Smartcodai؟',
      structured: {
        title: 'تعلم منظم',
        desc: 'مسارات "من الصفر إلى الاحتراف" صممها محترفون ليأخذوك من الأساسيات إلى الإتقان.',
      },
      certificates: {
        title: 'شهادات معترف بها',
        desc: 'احصل على شهادات قابلة للتنزيل والتحقق لإبراز مهاراتك أمام أصحاب العمل.',
      },
      practical: {
        title: 'مشاريع عملية',
        desc: 'ابدأ البرمجة من اليوم الأول مع تمارين عملية ومشاريع حقيقية وتتبع مفصل للتقدم.',
      },
    },
    cta: {
      title: 'مستعد لبدء رحلتك؟',
      subtitle: 'انضم إلى مئات الطلاب وتعلم بالسرعة التي تناسبك.',
      btn: 'الدخول إلى المنصة',
    },
    footer: '© 2026 Smartcodai Academy. تدريب عملي، تقدم وشهادات.',
  },

  // Auth
  auth: {
    login: {
      title: 'تسجيل الدخول',
      subtitle: 'ادخل إلى مساحة التعلم الخاصة بك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      submit: 'دخول',
      loading: 'جاري تسجيل الدخول...',
      noAccount: 'ليس لديك حساب؟',
      createAccount: 'إنشاء حساب',
      backHome: 'العودة للرئيسية',
      error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    },
    register: {
      title: 'إنشاء حساب',
      subtitle: 'ابدأ رحلة التعلم مجاناً',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      submit: 'إنشاء حسابي',
      loading: 'جاري إنشاء الحساب...',
      hasAccount: 'لديك حساب بالفعل؟',
      login: 'تسجيل الدخول',
      backHome: 'العودة للرئيسية',
      passwordMin: '6 أحرف على الأقل مطلوبة',
      passwordWeak: 'ضعيف — أضف أحرف كبيرة أو أرقام أو رموز',
      passwordMedium: 'متوسط — ليس سيئاً لكن يمكن تحسينه',
      passwordStrong: 'قوي — كلمة مرور ممتازة!',
      passwordMismatch: 'كلمتا المرور غير متطابقتين.',
      emailExists: 'يوجد حساب بالفعل بهذا البريد الإلكتروني.',
      features: [
        'وصول مجاني لجميع الدورات الأساسية',
        'تتبع تقدم مخصص',
        'شهادات قابلة للتنزيل عند الإتمام',
      ],
    },
  },

  // Dashboard
  dashboard: {
    title: 'لوحة التحكم',
    welcome: {
      badge: 'وصول غير محدود لجميع الدورات',
      title: 'استثمر في مسيرتك مع Smartcodai',
      subtitle: 'احصل على دورات بجودة احترافية في PHP وPython وn8n والذكاء الاصطناعي. تعلم بالسرعة التي تناسبك، ابنِ مشاريع حقيقية، واحصل على شهادات معترف بها.',
      cta: 'استكشف الدورات',
      ctaSecondary: 'اكتشف الشهادات',
    },
    stats: {
      lessonsCompleted: 'دروس مكتملة',
      certificates: 'شهادات',
      practiceTime: 'وقت التدريب',
      week: 'أسبوع',
    },
    courses: {
      title: 'دوراتك',
      new: 'جديد',
      inProgress: 'قيد التقدم',
      completed: 'مكتمل',
      locked: 'مقفل',
      start: 'ابدأ',
      continue: 'متابعة',
      modules: 'وحدات',
      accessInfo: {
        title: 'كيف تصل إلى الدورات؟',
        desc: 'دوراتك مقفلة. لفتحها، <strong>تواصل مع مدير المنصة</strong>. يمكنه تفعيل وصولك من لوحة الإدارة.',
      },
    },
    certificates: {
      title: 'الشهادات',
      empty: 'ستظهر شهاداتك هنا',
      desc: 'عند إكمال دورة، يمكنك العثور على شهادتك ومعاينتها وتنزيلها من لوحة التحكم.',
      viewExample: 'عرض المثال',
    },
    settings: {
      title: 'الإعدادات',
      theme: 'المظهر',
      toggleTheme: 'تبديل المظهر',
    },
  },

  // Admin
  admin: {
    title: 'إدارة المستخدمين',
    subtitle: 'إدارة التسجيلات وفتح الدورات لكل طالب.',
    stats: {
      users: 'المستخدمون',
      phpUnlocked: 'PHP مفتوحة',
      pythonUnlocked: 'Python مفتوحة',
      n8nUnlocked: 'n8n مفتوحة',
      openclawUnlocked: 'OpenClaw مفتوحة',
    },
    table: {
      title: 'المستخدمون المسجلون',
      search: 'بحث بالاسم أو البريد...',
      user: 'المستخدم',
      date: 'تاريخ التسجيل',
      courses: 'الدورات المفتوحة',
      actions: 'إجراءات',
      unlockAll: 'فتح الكل',
      lockAll: 'قفل الكل',
      empty: 'لا يوجد مستخدمون مسجلون بعد.',
      noResults: 'لم يتم العثور على نتائج.',
    },
    toast: {
      unlocked: 'مفتوحة لـ',
      locked: 'مقفلة لـ',
      allUnlocked: 'تم فتح جميع الدورات!',
      allLocked: 'تم قفل جميع الدورات.',
    },
  },

  // Course
  course: {
    backToDashboard: 'العودة للوحة التحكم',
    lesson: 'الدرس',
    of: 'من',
    next: 'التالي',
    previous: 'السابق',
    quiz: 'اختبار',
    submit: 'إرسال',
    correct: 'صحيح!',
    incorrect: 'غير صحيح.',
    certificate: {
      title: 'الشهادة',
      locked: 'الشهادة مقفلة',
      remaining: 'يتبقى لك {count} درس(دروس) لإكمالها لفتح الشهادة.',
      congrats: 'الدورة مكتملة — مبروك!',
      download: 'تنزيل PNG',
      print: 'طباعة / تصدير PDF',
      shareLinkedin: 'مشاركة على LinkedIn',
      copyLink: 'نسخ رابط التحقق',
      reference: 'مرجع الشهادة',
      verify: 'التحقق من هذه الشهادة',
      scanToVerify: 'امسح للتحقق',
    },
  },

  // Verification
  verify: {
    title: 'التحقق من الشهادة',
    subtitle: 'أدخل معرف الشهادة للتحقق من صحتها',
    input: 'مثال: PHP-2026-ABCDEF-4821',
    submit: 'تحقق',
    valid: {
      title: 'شهادة صحيحة',
      subtitle: 'تم إصدار هذه الشهادة من Smartcodai Academy وهي صالحة.',
    },
    invalid: {
      title: 'الشهادة غير موجودة',
      subtitle: 'لا توجد شهادة تطابق هذا المرجع. تحقق من المعرف أو تواصل مع Smartcodai.',
    },
    details: {
      student: 'الطالب',
      course: 'الدورة',
      reference: 'المرجع',
      date: 'تاريخ الإصدار',
      score: 'النتيجة',
    },
    share: {
      title: 'مشاركة هذه الشهادة',
      linkedin: 'LinkedIn',
      copy: 'نسخ الرابط',
      copied: 'تم النسخ!',
    },
    backHome: 'العودة للرئيسية',
  },

  // Common
  common: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ.',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    search: 'بحث...',
    noData: 'لا توجد بيانات.',
  },

  // Course names
  courses: {
    php: 'تطوير الويب الخلفي بـ PHP',
    python: 'البرمجة بـ Python',
    n8n: 'الأتمتة بـ n8n',
    openclaw: 'إتقان الذكاء الاصطناعي OpenClaw',
  },
};
