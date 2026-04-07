export const en = {
  // Navigation
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    courses: 'Courses',
    certificates: 'Certificates',
    admin: 'Administration',
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
  },

  // Landing page
  landing: {
    hero: {
      eyebrow: '2026 Session • Python, PHP, n8n & AI',
      title: 'Learn to code <span>by building real projects</span>.',
      subtitle: 'Smartcodai turns every lesson into hands-on practice. You code, you test, you validate your skills and progress toward certification — no complex setup, no wasted time.',
      cta: 'Start for free',
      ctaSecondary: 'View courses',
      proof: '100% in the browser',
      proofCert: 'Verifiable certificate',
    },
    features: {
      title: 'Why choose Smartcodai?',
      structured: {
        title: 'Structured learning',
        desc: '"Zero to Hero" paths designed by professionals to take you from basics to mastery.',
      },
      certificates: {
        title: 'Recognized certificates',
        desc: 'Earn downloadable, verifiable certificates to showcase your skills to employers.',
      },
      practical: {
        title: 'Hands-on projects',
        desc: 'Code from day one with practical exercises, real projects, and detailed progress tracking.',
      },
    },
    cta: {
      title: 'Ready to start your journey?',
      subtitle: 'Join hundreds of students and learn at your own pace.',
      btn: 'Enter the platform',
    },
    footer: '© 2026 Smartcodai Academy. Practice-driven training, progress, and certification.',
  },

  // Auth
  auth: {
    login: {
      title: 'Login',
      subtitle: 'Access your learning space',
      email: 'Email address',
      password: 'Password',
      submit: 'Sign in',
      loading: 'Signing in...',
      noAccount: 'Don\'t have an account?',
      createAccount: 'Create an account',
      backHome: 'Back to home',
      error: 'Incorrect email or password.',
    },
    register: {
      title: 'Create an account',
      subtitle: 'Start your learning journey for free',
      name: 'Full name',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm password',
      submit: 'Create my account',
      loading: 'Creating account...',
      hasAccount: 'Already have an account?',
      login: 'Sign in',
      backHome: 'Back to home',
      passwordMin: 'Minimum 6 characters required',
      passwordWeak: 'Weak — add uppercase, numbers or symbols',
      passwordMedium: 'Medium — not bad, but can be improved',
      passwordStrong: 'Strong — excellent password!',
      passwordMismatch: 'Passwords do not match.',
      emailExists: 'An account with this email already exists.',
      features: [
        'Free access to all basic courses',
        'Personalized progress tracking',
        'Downloadable certificates upon completion',
      ],
    },
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: {
      badge: 'Unlimited access to all courses',
      title: 'Invest in your career with Smartcodai',
      subtitle: 'Access professional-quality courses in PHP, Python, n8n, and AI. Learn at your own pace, build real projects, and earn recognized certificates.',
      cta: 'Explore courses',
      ctaSecondary: 'Discover certificates',
    },
    stats: {
      lessonsCompleted: 'Lessons completed',
      certificates: 'Certificates',
      practiceTime: 'Practice time',
      week: 'Week',
    },
    courses: {
      title: 'Your courses',
      new: 'New',
      inProgress: 'In progress',
      completed: 'Completed',
      locked: 'Locked',
      start: 'Start',
      continue: 'Continue',
      modules: 'modules',
      accessInfo: {
        title: 'How to access courses?',
        desc: 'Your courses are locked. To unlock them, <strong>contact the platform administrator</strong>. They can activate your access from the admin panel.',
      },
    },
    certificates: {
      title: 'Certificates',
      empty: 'Your certificates will appear here',
      desc: 'When a course is completed, you can find, preview, and download your certificate from this dashboard.',
      viewExample: 'View example',
    },
    settings: {
      title: 'Settings',
      theme: 'Theme',
      toggleTheme: 'Toggle theme',
    },
  },

  // Admin
  admin: {
    title: 'User Management',
    subtitle: 'Manage registrations and unlock courses for each student.',
    stats: {
      users: 'Users',
      phpUnlocked: 'PHP unlocked',
      pythonUnlocked: 'Python unlocked',
      n8nUnlocked: 'n8n unlocked',
      openclawUnlocked: 'OpenClaw unlocked',
    },
    table: {
      title: 'Registered users',
      search: 'Search by name or email...',
      user: 'User',
      date: 'Registration date',
      courses: 'Unlocked courses',
      actions: 'Actions',
      unlockAll: 'Unlock all',
      lockAll: 'Lock all',
      empty: 'No registered users yet.',
      noResults: 'No results found.',
    },
    toast: {
      unlocked: 'unlocked for',
      locked: 'locked for',
      allUnlocked: 'All courses unlocked!',
      allLocked: 'All courses locked.',
    },
  },

  // Course
  course: {
    backToDashboard: 'Back to dashboard',
    lesson: 'Lesson',
    of: 'of',
    next: 'Next',
    previous: 'Previous',
    quiz: 'Quiz',
    submit: 'Submit',
    correct: 'Correct!',
    incorrect: 'Incorrect.',
    certificate: {
      title: 'Certificate',
      locked: 'Certificate locked',
      remaining: 'You have {count} lesson(s) left to complete to unlock the certificate.',
      congrats: 'Course complete — Congratulations!',
      download: 'Download PNG',
      print: 'Print / Export PDF',
      shareLinkedin: 'Share on LinkedIn',
      copyLink: 'Copy verification link',
      reference: 'Certificate reference',
      verify: 'Verify this certificate',
      scanToVerify: 'Scan to verify',
    },
  },

  // Verification
  verify: {
    title: 'Certificate Verification',
    subtitle: 'Enter the certificate ID to verify its authenticity',
    input: 'Ex: PHP-2026-ABCDEF-4821',
    submit: 'Verify',
    valid: {
      title: 'Authentic certificate',
      subtitle: 'This certificate was issued by Smartcodai Academy and is valid.',
    },
    invalid: {
      title: 'Certificate not found',
      subtitle: 'No certificate matches this reference. Check the ID or contact Smartcodai.',
    },
    details: {
      student: 'Student',
      course: 'Course',
      reference: 'Reference',
      date: 'Issue date',
      score: 'Score',
    },
    share: {
      title: 'Share this certificate',
      linkedin: 'LinkedIn',
      copy: 'Copy link',
      copied: 'Copied!',
    },
    backHome: 'Back to home',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred.',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    search: 'Search...',
    noData: 'No data available.',
  },

  // Course names
  courses: {
    php: 'Backend Web Development with PHP',
    python: 'Programming in Python',
    n8n: 'Automation with n8n',
    openclaw: 'Mastering OpenClaw AI',
  },
};
