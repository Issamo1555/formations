import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const data: Record<number, {
  exFr: string; exEn: string; exAr: string;
  exoFr: string; exoEn: string; exoAr: string;
  qFr: string; qEn: string; qAr: string;
  opts: [string,string,string,string];
  optsEn: [string,string,string,string];
  optsAr: [string,string,string,string];
  correct: number;
  explFr: string; explEn: string; explAr: string;
}> = {
  1: {
    exFr: `// Exemple : Fiche technique d'un PC\n// Processeur : Intel Core i5-12400 (6 coeurs, 2.5 GHz)\n// RAM : 16 Go DDR4 3200 MHz\n// Stockage : SSD NVMe 512 Go\n// Carte graphique : NVIDIA GTX 1660 (6 Go VRAM)\n// Carte mère : ASUS B660M\n// Alimentation : 550W 80+ Bronze\n// Boîtier : ATX Mid-Tower\n\n// Le CPU traite les instructions\n// La RAM stocke temporairement les données actives\n// Le SSD conserve les fichiers de manière permanente\n// Le GPU gère l'affichage graphique`,
    exEn: `// Example: PC Spec Sheet\n// Processor: Intel Core i5-12400 (6 cores, 2.5 GHz)\n// RAM: 16 GB DDR4 3200 MHz\n// Storage: NVMe SSD 512 GB\n// Graphics: NVIDIA GTX 1660 (6 GB VRAM)\n// Motherboard: ASUS B660M\n// PSU: 550W 80+ Bronze\n\n// CPU processes instructions\n// RAM temporarily stores active data\n// SSD permanently stores files\n// GPU handles graphics display`,
    exAr: `// مثال: مواصفات حاسوب\n// المعالج: Intel Core i5-12400\n// الذاكرة: 16 جيجا DDR4\n// التخزين: SSD NVMe 512 جيجا\n// بطاقة الرسومات: NVIDIA GTX 1660`,
    exoFr: `// Exercice : Identifiez les composants\n// Pour chaque description, indiquez le composant correspondant :\n//\n// 1. "Stocke 16 Go de données temporaires ultra-rapides" → ?\n// 2. "Exécute 4 milliards d'opérations par seconde" → ?\n// 3. "Contient 512 Go de fichiers permanents" → ?\n// 4. "Relie le CPU, la RAM et le GPU ensemble" → ?\n// 5. "Affiche les images et vidéos à l'écran" → ?\n//\n// Réponses attendues :\n// 1. RAM (Mémoire Vive)\n// 2. CPU (Processeur)\n// 3. SSD (Stockage)\n// 4. Carte Mère\n// 5. GPU (Carte Graphique)`,
    exoEn: `// Exercise: Identify the components\n// For each description, name the corresponding component:\n//\n// 1. "Stores 16 GB of ultra-fast temporary data" → ?\n// 2. "Executes 4 billion operations per second" → ?\n// 3. "Contains 512 GB of permanent files" → ?\n// 4. "Connects CPU, RAM, and GPU together" → ?\n// 5. "Displays images and videos on screen" → ?\n//\n// Expected answers:\n// 1. RAM\n// 2. CPU (Processor)\n// 3. SSD (Storage)\n// 4. Motherboard\n// 5. GPU (Graphics Card)`,
    exoAr: `// تمرين: حدد المكونات\n// 1. "يخزن 16 جيجا من البيانات المؤقتة" → ?\n// 2. "ينفذ 4 مليار عملية في الثانية" → ?\n// 3. "يحتوي على 512 جيجا من الملفات" → ?\n// الإجابات: 1. RAM  2. CPU  3. SSD`,
    qFr: 'Quel composant est considéré comme le "cerveau" de l\'ordinateur ?',
    qEn: 'Which component is considered the "brain" of the computer?',
    qAr: 'أي مكون يعتبر "دماغ" الحاسوب؟',
    opts: ['La RAM', 'Le CPU (Processeur)', 'Le SSD', 'La Carte Graphique'],
    optsEn: ['RAM', 'CPU (Processor)', 'SSD', 'Graphics Card'],
    optsAr: ['الذاكرة RAM', 'المعالج CPU', 'القرص SSD', 'بطاقة الرسومات'],
    correct: 1,
    explFr: 'Le CPU (Central Processing Unit) exécute toutes les instructions et calculs. C\'est le composant central.',
    explEn: 'The CPU (Central Processing Unit) executes all instructions and calculations. It is the central component.',
    explAr: 'المعالج CPU ينفذ جميع التعليمات والحسابات. هو المكون المركزي.',
  },
  2: {
    exFr: `// Exemple : Gestion des processus sous Windows\n// Ouvrez le Gestionnaire des tâches (Ctrl+Shift+Échap)\n//\n// Processus actifs typiques :\n// - explorer.exe    → Interface graphique Windows\n// - chrome.exe      → Navigateur Google Chrome\n// - svchost.exe     → Services système\n// - System          → Noyau du système\n//\n// Chaque processus utilise :\n// - Un % du CPU\n// - Une quantité de RAM\n// - Des accès disque (E/S)\n//\n// L'OS distribue les ressources équitablement\n// grâce à l'ordonnanceur (scheduler)`,
    exEn: `// Example: Process management in Windows\n// Open Task Manager (Ctrl+Shift+Esc)\n//\n// Typical active processes:\n// - explorer.exe    → Windows GUI\n// - chrome.exe      → Google Chrome browser\n// - svchost.exe     → System services\n// - System          → System kernel\n//\n// Each process uses:\n// - A % of CPU\n// - An amount of RAM\n// - Disk access (I/O)\n//\n// The OS distributes resources fairly\n// through the scheduler`,
    exAr: `// مثال: إدارة العمليات في Windows\n// افتح مدير المهام (Ctrl+Shift+Esc)\n// العمليات النشطة:\n// - explorer.exe → واجهة Windows\n// - chrome.exe → متصفح Chrome\n// النظام يوزع الموارد بالتساوي`,
    exoFr: `// Exercice : Comparez les systèmes d'exploitation\n// Remplissez le tableau comparatif :\n//\n// | Critère          | Windows       | Linux (Ubuntu)  | macOS         |\n// |------------------|---------------|-----------------|---------------|\n// | Licence          | Propriétaire  | Open Source     | Propriétaire  |\n// | Prix             | ~140€         | Gratuit         | Inclus Mac    |\n// | Interface        | Bureau        | Bureau/Terminal  | Bureau        |\n// | Sécurité         | Moyenne       | Élevée          | Élevée        |\n// | Serveurs web     | ~20%          | ~75%            | ~5%           |\n// | Jeux vidéo       | Excellent     | Limité          | Moyen         |\n//\n// Question : Quel OS choisiriez-vous pour un serveur web ? Pourquoi ?`,
    exoEn: `// Exercise: Compare operating systems\n// Fill in the comparison table:\n//\n// | Criteria    | Windows      | Linux (Ubuntu) | macOS        |\n// |-------------|--------------|----------------|--------------|  \n// | License     | Proprietary  | Open Source    | Proprietary  |\n// | Price       | ~$140        | Free           | Included     |\n// | Security    | Medium       | High           | High         |\n// | Web servers | ~20%         | ~75%           | ~5%          |\n//\n// Question: Which OS would you choose for a web server? Why?`,
    exoAr: `// تمرين: قارن أنظمة التشغيل\n// Windows مقابل Linux مقابل macOS\n// الترخيص، السعر، الأمان، استخدام الخوادم\n// سؤال: أي نظام تختار لخادم ويب؟ لماذا؟`,
    qFr: 'Quel est le rôle principal du système d\'exploitation ?',
    qEn: 'What is the main role of the operating system?',
    qAr: 'ما الدور الرئيسي لنظام التشغيل؟',
    opts: ['Afficher des pages web', 'Servir d\'interface entre le matériel et l\'utilisateur', 'Compiler le code source', 'Stocker les fichiers sur Internet'],
    optsEn: ['Display web pages', 'Serve as interface between hardware and user', 'Compile source code', 'Store files on the Internet'],
    optsAr: ['عرض صفحات الويب', 'العمل كواجهة بين المعدات والمستخدم', 'ترجمة الشيفرة المصدرية', 'تخزين الملفات على الإنترنت'],
    correct: 1,
    explFr: 'L\'OS gère les ressources matérielles (CPU, RAM, disque) et offre une interface utilisateur pour interagir avec la machine.',
    explEn: 'The OS manages hardware resources (CPU, RAM, disk) and provides a user interface to interact with the machine.',
    explAr: 'نظام التشغيل يدير موارد المعدات ويوفر واجهة للمستخدم للتفاعل مع الجهاز.',
  },
  3: {
    exFr: `// Exemple : Tables de vérité\n//\n// Porte ET (AND) :\n// | A | B | A ET B |\n// |---|---|--------|\n// | 0 | 0 |   0    |\n// | 0 | 1 |   0    |\n// | 1 | 0 |   0    |\n// | 1 | 1 |   1    |\n//\n// Porte OU (OR) :\n// | A | B | A OU B |\n// |---|---|--------|\n// | 0 | 0 |   0    |\n// | 0 | 1 |   1    |\n// | 1 | 0 |   1    |\n// | 1 | 1 |   1    |\n//\n// Porte NON (NOT) :\n// | A | NON A |\n// |---|-------|\n// | 0 |   1   |\n// | 1 |   0   |`,
    exEn: `// Example: Truth Tables\n//\n// AND Gate:\n// | A | B | A AND B |\n// |---|---|---------|  \n// | 0 | 0 |    0    |\n// | 0 | 1 |    0    |\n// | 1 | 0 |    0    |\n// | 1 | 1 |    1    |\n//\n// OR Gate:\n// | A | B | A OR B |\n// |---|---|--------|\n// | 0 | 0 |   0    |\n// | 0 | 1 |   1    |\n// | 1 | 0 |   1    |\n// | 1 | 1 |   1    |\n//\n// NOT Gate:\n// | A | NOT A |\n// |---|-------|\n// | 0 |   1   |\n// | 1 |   0   |`,
    exAr: `// مثال: جداول الحقيقة\n// بوابة AND: 1 AND 1 = 1، البقية = 0\n// بوابة OR: 0 OR 0 = 0، البقية = 1\n// بوابة NOT: NOT 0 = 1، NOT 1 = 0`,
    exoFr: `// Exercice : Résolvez les expressions booléennes\n//\n// 1. (1 ET 0) OU 1 = ?\n//    → (0) OU 1 = 1\n//\n// 2. NON(1 OU 0) ET 1 = ?\n//    → NON(1) ET 1 = 0 ET 1 = 0\n//\n// 3. (1 ET 1) OU (0 ET 1) = ?\n//    → 1 OU 0 = 1\n//\n// À vous ! Résolvez :\n// 4. NON(0 ET 1) OU (1 ET 1) = ?\n// 5. (NON 0) ET (NON 1) = ?\n// 6. ((1 OU 0) ET (0 OU 1)) ET NON 0 = ?\n//\n// Réponses : 4→1, 5→0, 6→1`,
    exoEn: `// Exercise: Solve boolean expressions\n//\n// 1. (1 AND 0) OR 1 = ?\n//    → (0) OR 1 = 1\n//\n// 2. NOT(1 OR 0) AND 1 = ?\n//    → NOT(1) AND 1 = 0 AND 1 = 0\n//\n// Solve:\n// 3. NOT(0 AND 1) OR (1 AND 1) = ?\n// 4. (NOT 0) AND (NOT 1) = ?\n//\n// Answers: 3→1, 4→0`,
    exoAr: `// تمرين: حل التعبيرات المنطقية\n// 1. (1 AND 0) OR 1 = ?\n// 2. NOT(1 OR 0) AND 1 = ?\n// الإجابات: 1→1, 2→0`,
    qFr: 'Que retourne l\'opération "1 ET 0" en logique booléenne ?',
    qEn: 'What does "1 AND 0" return in boolean logic?',
    qAr: 'ماذا ترجع العملية "1 AND 0" في المنطق البولياني؟',
    opts: ['1 (Vrai)', '0 (Faux)', '2', 'Erreur'],
    optsEn: ['1 (True)', '0 (False)', '2', 'Error'],
    optsAr: ['1 (صحيح)', '0 (خطأ)', '2', 'خطأ برمجي'],
    correct: 1,
    explFr: 'La porte ET (AND) retourne 1 uniquement si TOUTES les entrées sont 1. Ici, une entrée est 0, donc le résultat est 0.',
    explEn: 'The AND gate returns 1 only if ALL inputs are 1. Here, one input is 0, so the result is 0.',
    explAr: 'بوابة AND ترجع 1 فقط إذا كانت جميع المدخلات 1. هنا أحد المدخلات 0، لذا النتيجة 0.',
  },
  4: {
    exFr: `// Exemple : Classification des logiciels\n//\n// LOGICIELS SYSTÈME :\n// - Windows 11, Linux Ubuntu, macOS → Systèmes d'exploitation\n// - Pilote NVIDIA, Pilote imprimante → Pilotes (drivers)\n// - Antivirus, Défragmenteur → Utilitaires\n//\n// LOGICIELS D'APPLICATION :\n// - Chrome, Firefox → Navigateurs web\n// - Word, LibreOffice Writer → Traitement de texte\n// - Excel, Calc → Tableurs\n// - Photoshop, GIMP → Édition d'image\n// - VS Code, IntelliJ → Développement\n//\n// LICENCES :\n// - Propriétaire : Microsoft Office (payant, code fermé)\n// - Open Source : LibreOffice (gratuit, code ouvert)\n// - Freeware : VLC (gratuit, code fermé)\n// - Shareware : WinRAR (essai gratuit limité)`,
    exEn: `// Example: Software Classification\n//\n// SYSTEM SOFTWARE:\n// - Windows 11, Linux, macOS → Operating Systems\n// - NVIDIA Driver, Printer Driver → Drivers\n// - Antivirus, Disk Defrag → Utilities\n//\n// APPLICATION SOFTWARE:\n// - Chrome, Firefox → Web browsers\n// - Word, LibreOffice → Word processors\n// - Photoshop, GIMP → Image editing\n//\n// LICENSES:\n// - Proprietary: Microsoft Office (paid, closed source)\n// - Open Source: LibreOffice (free, open source)\n// - Freeware: VLC (free, closed source)`,
    exAr: `// مثال: تصنيف البرمجيات\n// برمجيات النظام: أنظمة التشغيل، التعريفات\n// برمجيات التطبيقات: المتصفحات، معالجة النصوص\n// التراخيص: ملكية، مفتوحة المصدر، مجانية`,
    exoFr: `// Exercice : Classifiez ces logiciels\n// Indiquez pour chaque logiciel :\n// (S) Système, (A) Application, puis le type de licence\n//\n// 1. Google Chrome      → ? (Licence: ?)\n// 2. Windows 11         → ? (Licence: ?)\n// 3. LibreOffice        → ? (Licence: ?)\n// 4. Pilote carte son   → ? (Licence: ?)\n// 5. VLC Media Player   → ? (Licence: ?)\n// 6. Adobe Photoshop    → ? (Licence: ?)\n// 7. Linux Ubuntu       → ? (Licence: ?)\n//\n// Réponses :\n// 1. A - Freeware  2. S - Propriétaire  3. A - Open Source\n// 4. S - Propriétaire  5. A - Open Source  6. A - Propriétaire\n// 7. S - Open Source`,
    exoEn: `// Exercise: Classify these software\n// For each, indicate: (S) System, (A) Application, then license type\n//\n// 1. Google Chrome      → ?\n// 2. Windows 11         → ?\n// 3. LibreOffice        → ?\n// 4. Sound card driver  → ?\n// 5. VLC Media Player   → ?\n//\n// Answers:\n// 1. A-Freeware 2. S-Proprietary 3. A-Open Source\n// 4. S-Proprietary 5. A-Open Source`,
    exoAr: `// تمرين: صنف هذه البرمجيات\n// 1. Google Chrome → ?\n// 2. Windows 11 → ?\n// 3. LibreOffice → ?\n// الإجابات: 1. تطبيق 2. نظام 3. تطبيق مفتوح المصدر`,
    qFr: 'Quelle est la différence entre un logiciel système et un logiciel d\'application ?',
    qEn: 'What is the difference between system software and application software?',
    qAr: 'ما الفرق بين برمجيات النظام وبرمجيات التطبيقات؟',
    opts: ['Aucune différence', 'Le système gère la machine, l\'application sert l\'utilisateur', 'L\'application est toujours payante', 'Le système est toujours open source'],
    optsEn: ['No difference', 'System manages the machine, application serves the user', 'Applications are always paid', 'System is always open source'],
    optsAr: ['لا فرق', 'النظام يدير الجهاز، التطبيق يخدم المستخدم', 'التطبيقات دائماً مدفوعة', 'النظام دائماً مفتوح المصدر'],
    correct: 1,
    explFr: 'Les logiciels système (OS, pilotes) gèrent le matériel. Les applications (navigateur, bureautique) sont des outils pour l\'utilisateur.',
    explEn: 'System software (OS, drivers) manages hardware. Applications (browser, office) are user tools.',
    explAr: 'برمجيات النظام تدير المعدات. التطبيقات أدوات للمستخدم.',
  },
  5: {
    exFr: `// Exemple : Structure d'un dossier de recherche\n//\n// SUJET : "Linux Ubuntu vs Windows 11"\n//\n// 1. Page de garde\n//    - Titre, nom, date, formation\n//\n// 2. Introduction (1 page)\n//    - Contexte et problématique\n//\n// 3. Historique (2 pages)\n//    - Linus Torvalds crée Linux en 1991\n//    - Microsoft lance Windows 1.0 en 1985\n//\n// 4. Architecture comparée (2 pages)\n//    - Noyau monolithique (Linux) vs hybride (Windows)\n//    - Schéma des couches système\n//\n// 5. Analyse (2 pages)\n//    - Performance, sécurité, coût, écosystème\n//\n// 6. Conclusion (1 page)\n//    - Synthèse et recommandations`,
    exEn: `// Example: Research paper structure\n//\n// TOPIC: "Linux Ubuntu vs Windows 11"\n//\n// 1. Cover page\n// 2. Introduction (1 page) - Context\n// 3. History (2 pages) - Timeline\n// 4. Architecture comparison (2 pages)\n//    - Monolithic kernel (Linux) vs hybrid (Windows)\n// 5. Analysis (2 pages)\n//    - Performance, security, cost\n// 6. Conclusion (1 page)`,
    exAr: `// مثال: هيكل ورقة بحثية\n// الموضوع: "Linux Ubuntu مقابل Windows 11"\n// 1. صفحة الغلاف\n// 2. المقدمة\n// 3. التاريخ\n// 4. مقارنة البنية\n// 5. التحليل\n// 6. الخاتمة`,
    exoFr: `// Exercice : Préparez votre plan de recherche\n//\n// Choisissez UN sujet parmi :\n// a) ARM vs x86 : quelle architecture pour l'avenir ?\n// b) macOS vs Linux : sécurité et performance\n// c) SSD vs HDD : impact sur les performances système\n//\n// Rédigez :\n// 1. Votre problématique en une question\n// 2. Le plan détaillé (6 parties minimum)\n// 3. 3 sources fiables que vous utiliserez\n// 4. Un schéma comparatif simple\n//\n// Critères d'évaluation :\n// - Clarté du plan : /5\n// - Pertinence des sources : /5\n// - Qualité du schéma : /5\n// - Analyse personnelle : /5`,
    exoEn: `// Exercise: Prepare your research plan\n//\n// Choose ONE topic:\n// a) ARM vs x86: which architecture for the future?\n// b) macOS vs Linux: security and performance\n// c) SSD vs HDD: impact on system performance\n//\n// Write:\n// 1. Your problem statement as a question\n// 2. Detailed outline (6+ parts)\n// 3. 3 reliable sources\n// 4. A simple comparison diagram`,
    exoAr: `// تمرين: جهّز خطة بحثك\n// اختر موضوعاً واكتب:\n// 1. الإشكالية كسؤال\n// 2. المخطط التفصيلي\n// 3. 3 مصادر موثوقة`,
    qFr: 'Combien de pages minimum doit contenir un dossier de recherche bien structuré ?',
    qEn: 'How many pages minimum should a well-structured research paper contain?',
    qAr: 'كم صفحة كحد أدنى يجب أن يحتوي بحث منظم جيداً؟',
    opts: ['2-3 pages', '5-8 pages', '15-20 pages', '50+ pages'],
    optsEn: ['2-3 pages', '5-8 pages', '15-20 pages', '50+ pages'],
    optsAr: ['2-3 صفحات', '5-8 صفحات', '15-20 صفحة', '50+ صفحة'],
    correct: 1,
    explFr: 'Un dossier de recherche académique bien structuré contient généralement 5 à 8 pages avec introduction, développement et conclusion.',
    explEn: 'A well-structured academic research paper usually contains 5-8 pages with introduction, body and conclusion.',
    explAr: 'ورقة بحثية منظمة تحتوي عادة 5-8 صفحات مع مقدمة وجسم وخاتمة.',
  },
};

export async function GET(req: NextRequest) {
  try {
    const course = await prisma.course.findUnique({ where: { slug: 'architecture' } });
    if (!course) {
      return NextResponse.json({ error: 'Course "architecture" not found!' }, { status: 404 });
    }

    let updated = 0;
    for (const [orderStr, d] of Object.entries(data)) {
      const order = parseInt(orderStr);
      const lesson = await prisma.lesson.findFirst({ where: { courseId: course.id, order } });
      if (!lesson) continue;

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          exampleFr: d.exFr, exampleEn: d.exEn, exampleAr: d.exAr,
          exerciseFr: d.exoFr, exerciseEn: d.exoEn, exerciseAr: d.exoAr,
          hasQuiz: true,
          quizQuestionFr: d.qFr, quizQuestionEn: d.qEn, quizQuestionAr: d.qAr,
          quizOption1Fr: d.opts[0], quizOption1En: d.optsEn[0], quizOption1Ar: d.optsAr[0],
          quizOption2Fr: d.opts[1], quizOption2En: d.optsEn[1], quizOption2Ar: d.optsAr[1],
          quizOption3Fr: d.opts[2], quizOption3En: d.optsEn[2], quizOption3Ar: d.optsAr[2],
          quizOption4Fr: d.opts[3], quizOption4En: d.optsEn[3], quizOption4Ar: d.optsAr[3],
          quizCorrect: d.correct,
          quizExplainFr: d.explFr, quizExplainEn: d.explEn, quizExplainAr: d.explAr,
        },
      });
      updated++;
    }

    return NextResponse.json({ success: true, message: `Architecture course seeded successfully. ${updated} lessons updated.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
