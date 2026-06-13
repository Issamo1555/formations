import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const quizzesData: Record<number, any[]> = {
  1: [
    {
      qFr: "Quel composant est considéré comme le 'cerveau' de l'ordinateur ?",
      qEn: "Which component is considered the 'brain' of the computer?",
      qAr: "أي مكون يعتبر 'دماغ' الحاسوب؟",
      optsFr: ["La RAM", "Le CPU (Processeur)", "Le SSD", "La Carte Graphique"],
      optsEn: ["RAM", "CPU (Processor)", "SSD", "Graphics Card"],
      optsAr: ["الذاكرة RAM", "المعالج CPU", "القرص SSD", "بطاقة الرسومات"],
      correct: 1,
      explFr: "Le CPU (Central Processing Unit) exécute toutes les instructions et calculs. C'est le composant central."
    },
    {
      qFr: "Quel composant stocke les données de manière permanente même quand l'ordinateur est éteint ?",
      qEn: "Which component stores data permanently even when the computer is turned off?",
      qAr: "أي مكون يخزن البيانات بشكل دائم حتى عند إيقاف تشغيل الحاسوب؟",
      optsFr: ["La RAM", "L'Alimentation", "Le Disque Dur / SSD", "La Carte Mère"],
      optsEn: ["RAM", "Power Supply", "Hard Drive / SSD", "Motherboard"],
      optsAr: ["الذاكرة RAM", "مزود الطاقة", "القرص الصلب / SSD", "اللوحة الأم"],
      correct: 2,
      explFr: "Le SSD ou Disque Dur est la mémoire de stockage de masse non volatile."
    },
    {
      qFr: "À quoi sert la RAM dans un ordinateur ?",
      qEn: "What is the purpose of RAM in a computer?",
      qAr: "ما هو الغرض من RAM في الحاسوب؟",
      optsFr: ["À refroidir le système", "À stocker temporairement les données des programmes en cours d'exécution", "À afficher les images à l'écran", "À fournir de l'énergie électrique"],
      optsEn: ["To cool the system", "To temporarily store data of running programs", "To display images on the screen", "To provide electrical power"],
      optsAr: ["لتبريد النظام", "لتخزين بيانات البرامج قيد التشغيل مؤقتاً", "لعرض الصور على الشاشة", "لتوفير الطاقة الكهربائية"],
      correct: 1,
      explFr: "La RAM est une mémoire très rapide qui conserve les données actives dont le CPU a besoin."
    },
    {
      qFr: "Que signifie le sigle 'GPU' ?",
      qEn: "What does the acronym 'GPU' stand for?",
      qAr: "ماذا يرمز الاختصار 'GPU'؟",
      optsFr: ["General Processing Unit", "Graphic Processing Unit", "Global Power Unit", "Gaming Performance Unit"],
      optsEn: ["General Processing Unit", "Graphic Processing Unit", "Global Power Unit", "Gaming Performance Unit"],
      optsAr: ["وحدة المعالجة العامة", "وحدة المعالجة الرسومية", "وحدة الطاقة العالمية", "وحدة أداء الألعاب"],
      correct: 1,
      explFr: "Graphic Processing Unit, c'est le processeur de la carte graphique chargé des calculs visuels."
    },
    {
      qFr: "Quelle est l'unité de mesure de la vitesse d'horloge d'un processeur (CPU) ?",
      qEn: "What is the unit of measurement for a processor's (CPU) clock speed?",
      qAr: "ما هي وحدة قياس سرعة ساعة المعالج (CPU)؟",
      optsFr: ["Gigaoctet (Go)", "Mégapixel (MP)", "Gigahertz (GHz)", "Watt (W)"],
      optsEn: ["Gigabyte (GB)", "Megapixel (MP)", "Gigahertz (GHz)", "Watt (W)"],
      optsAr: ["جيجابايت (GB)", "ميجابكسل (MP)", "جيجاهرتز (GHz)", "واط (W)"],
      correct: 2,
      explFr: "La vitesse d'horloge, qui indique le nombre de cycles par seconde, se mesure en Hertz (généralement en Gigahertz)."
    },
    {
      qFr: "Quel composant permet de relier tous les autres composants entre eux ?",
      qEn: "Which component allows all other components to connect to each other?",
      qAr: "أي مكون يسمح بتوصيل جميع المكونات الأخرى ببعضها البعض؟",
      optsFr: ["La Carte Mère", "Le Boîtier", "L'Alimentation", "Le Processeur"],
      optsEn: ["Motherboard", "Computer Case", "Power Supply", "Processor"],
      optsAr: ["اللوحة الأم", "صندوق الحاسوب", "مزود الطاقة", "المعالج"],
      correct: 0,
      explFr: "La carte mère est le circuit imprimé principal sur lequel tous les autres composants viennent se brancher."
    },
    {
      qFr: "Parmi ces supports de stockage, lequel est généralement le plus rapide ?",
      qEn: "Among these storage media, which one is generally the fastest?",
      qAr: "من بين وسائط التخزين هذه، أيهما عادة ما يكون الأسرع؟",
      optsFr: ["Disque dur mécanique (HDD)", "SSD NVMe", "Clé USB 2.0", "CD-ROM"],
      optsEn: ["Mechanical Hard Drive (HDD)", "NVMe SSD", "USB 2.0 Flash Drive", "CD-ROM"],
      optsAr: ["قرص صلب ميكانيكي (HDD)", "قرص صلب NVMe SSD", "فلاشة USB 2.0", "قرص مضغوط CD-ROM"],
      correct: 1,
      explFr: "Le SSD NVMe, branché directement sur la carte mère, offre des vitesses de transfert extrêmes."
    },
    {
      qFr: "Que distribue l'Alimentation (PSU) aux différents composants ?",
      qEn: "What does the Power Supply Unit (PSU) distribute to the various components?",
      qAr: "ماذا يوزع مزود الطاقة (PSU) على المكونات المختلفة؟",
      optsFr: ["Des données", "De l'énergie électrique", "Du refroidissement", "Des mises à jour"],
      optsEn: ["Data", "Electrical energy", "Cooling", "Updates"],
      optsAr: ["البيانات", "الطاقة الكهربائية", "التبريد", "التحديثات"],
      correct: 1,
      explFr: "L'alimentation convertit le courant du secteur en tensions compatibles avec les composants."
    },
    {
      qFr: "Si votre ordinateur est très lent lorsque plusieurs onglets de navigateur sont ouverts, quel composant faut-il prioritairement améliorer ?",
      qEn: "If your computer is very slow when multiple browser tabs are open, which component should be prioritized for an upgrade?",
      qAr: "إذا كان حاسوبك بطيئاً جداً عند فتح عدة علامات تبويب في المتصفح، ما هو المكون الذي يجب إعطاء الأولوية لترقيته؟",
      optsFr: ["La Carte Graphique", "Le Boîtier", "La RAM", "La Carte Son"],
      optsEn: ["Graphics Card", "Computer Case", "RAM", "Sound Card"],
      optsAr: ["بطاقة الرسومات", "صندوق الحاسوب", "الذاكرة RAM", "بطاقة الصوت"],
      correct: 2,
      explFr: "Les onglets consomment énormément de mémoire vive (RAM). S'il n'y en a pas assez, le PC ralentit."
    },
    {
      qFr: "Lequel de ces éléments n'est PAS un périphérique d'entrée ?",
      qEn: "Which of the following is NOT an input device?",
      qAr: "أي من العناصر التالية ليس جهاز إدخال؟",
      optsFr: ["La souris", "Le clavier", "Le microphone", "L'écran (non tactile)"],
      optsEn: ["Mouse", "Keyboard", "Microphone", "Monitor (non-touch)"],
      optsAr: ["الفأرة", "لوحة المفاتيح", "الميكروفون", "الشاشة (غير اللمسية)"],
      correct: 3,
      explFr: "Un écran standard est un périphérique de sortie (il affiche les données), pas d'entrée."
    }
  ],
  2: [
    {
      qFr: "Quel est le rôle principal du système d'exploitation ?",
      qEn: "What is the main role of the operating system?",
      qAr: "ما الدور الرئيسي لنظام التشغيل؟",
      optsFr: ["Afficher des pages web", "Servir d'interface entre le matériel et l'utilisateur", "Compiler le code source", "Stocker les fichiers sur Internet"],
      optsEn: ["Display web pages", "Serve as interface between hardware and user", "Compile source code", "Store files on the Internet"],
      optsAr: ["عرض صفحات الويب", "العمل كواجهة بين المعدات والمستخدم", "ترجمة الشيفرة المصدرية", "تخزين الملفات على الإنترنت"],
      correct: 1,
      explFr: "L'OS gère les ressources matérielles et offre une interface pour interagir avec la machine."
    },
    {
      qFr: "Lequel de ces systèmes d'exploitation est Open Source ?",
      qEn: "Which of these operating systems is Open Source?",
      qAr: "أي من أنظمة التشغيل هذه مفتوح المصدر؟",
      optsFr: ["Windows 11", "macOS", "Linux (Ubuntu)", "iOS"],
      optsEn: ["Windows 11", "macOS", "Linux (Ubuntu)", "iOS"],
      optsAr: ["ويندوز 11", "نظام ماك macOS", "لينكس (Ubuntu)", "نظام iOS"],
      correct: 2,
      explFr: "Linux est un système dont le code source est libre, gratuit et modifiable par tous."
    },
    {
      qFr: "Qu'est-ce qu'un 'ordonnanceur' (scheduler) dans un OS ?",
      qEn: "What is a 'scheduler' in an OS?",
      qAr: "ما هو 'المجدول' (scheduler) في نظام التشغيل؟",
      optsFr: ["Un calendrier pour l'utilisateur", "Un composant qui distribue le temps du CPU aux processus", "Un logiciel antivirus", "Un outil pour défragmenter le disque"],
      optsEn: ["A calendar for the user", "A component that distributes CPU time to processes", "An antivirus software", "A tool to defragment the disk"],
      optsAr: ["تقويم للمستخدم", "مكون يوزع وقت المعالج على العمليات", "برنامج مكافحة فيروسات", "أداة لإلغاء تجزئة القرص"],
      correct: 1,
      explFr: "L'ordonnanceur détermine quel processus utilise le processeur à un instant T."
    },
    {
      qFr: "Quel système d'exploitation est très largement dominant sur les serveurs web mondiaux ?",
      qEn: "Which operating system is vastly dominant on global web servers?",
      qAr: "أي نظام تشغيل يهيمن بشكل كبير على خوادم الويب العالمية؟",
      optsFr: ["Windows Server", "Linux", "macOS Server", "Android"],
      optsEn: ["Windows Server", "Linux", "macOS Server", "Android"],
      optsAr: ["خادم ويندوز", "لينكس", "خادم ماك", "أندرويد"],
      correct: 1,
      explFr: "Linux propulse la grande majorité des serveurs Internet grâce à sa stabilité, sa gratuité et sa sécurité."
    },
    {
      qFr: "Sur Windows, quelle combinaison de touches permet généralement d'ouvrir le Gestionnaire des tâches ?",
      qEn: "On Windows, what key combination usually opens the Task Manager?",
      qAr: "في ويندوز، ما هي مجموعة المفاتيح التي تفتح عادة مدير المهام؟",
      optsFr: ["Alt + F4", "Ctrl + Shift + Échap", "Windows + R", "Ctrl + C"],
      optsEn: ["Alt + F4", "Ctrl + Shift + Esc", "Windows + R", "Ctrl + C"],
      optsAr: ["Alt + F4", "Ctrl + Shift + Esc", "Windows + R", "Ctrl + C"],
      correct: 1,
      explFr: "Ctrl+Shift+Échap ouvre directement le Gestionnaire de tâches (Ctrl+Alt+Suppr est aussi possible)."
    },
    {
      qFr: "Qu'est-ce que le 'Noyau' (Kernel) d'un système d'exploitation ?",
      qEn: "What is the 'Kernel' of an operating system?",
      qAr: "ما هو 'النواة' (Kernel) لنظام التشغيل؟",
      optsFr: ["L'interface graphique avec la souris", "Le cœur du système qui dialogue directement avec le matériel", "Le navigateur web intégré", "Le fichier de sauvegarde principal"],
      optsEn: ["The graphical mouse interface", "The core of the system that talks directly to the hardware", "The built-in web browser", "The main backup file"],
      optsAr: ["الواجهة الرسومية باستخدام الفأرة", "قلب النظام الذي يتحدث مباشرة مع الأجهزة", "متصفح الويب المدمج", "ملف النسخ الاحتياطي الرئيسي"],
      correct: 1,
      explFr: "Le noyau est la partie fondamentale de l'OS qui contrôle l'accès au processeur, à la mémoire et aux périphériques."
    },
    {
      qFr: "Comment appelle-t-on un programme en cours d'exécution dans le système d'exploitation ?",
      qEn: "What do we call a program that is currently running in the operating system?",
      qAr: "ماذا نطلق على البرنامج قيد التشغيل في نظام التشغيل؟",
      optsFr: ["Un raccourci", "Un fichier source", "Un processus", "Un registre"],
      optsEn: ["A shortcut", "A source file", "A process", "A register"],
      optsAr: ["اختصار", "ملف مصدر", "عملية (Process)", "سجل (Register)"],
      correct: 2,
      explFr: "Un programme lancé devient un ou plusieurs 'processus' (process) gérés par l'OS."
    },
    {
      qFr: "Lequel n'est PAS un système d'exploitation ?",
      qEn: "Which of the following is NOT an operating system?",
      qAr: "أي مما يلي ليس نظام تشغيل؟",
      optsFr: ["Android", "iOS", "Google Chrome", "Windows"],
      optsEn: ["Android", "iOS", "Google Chrome", "Windows"],
      optsAr: ["أندرويد", "نظام iOS", "جوجل كروم", "ويندوز"],
      correct: 2,
      explFr: "Google Chrome est un logiciel d'application (navigateur web), pas un OS."
    },
    {
      qFr: "Quelle gestion l'OS utilise-t-il pour empêcher les processus d'utiliser toute la mémoire RAM en même temps ?",
      qEn: "What management does the OS use to prevent processes from using all the RAM at the same time?",
      qAr: "ما الإدارة التي يستخدمها نظام التشغيل لمنع العمليات من استهلاك كل ذاكرة RAM في نفس الوقت؟",
      optsFr: ["La gestion de la mémoire virtuelle", "Le redémarrage forcé", "Le pare-feu", "La suppression des fichiers temporaires"],
      optsEn: ["Virtual memory management", "Forced restart", "The firewall", "Deleting temporary files"],
      optsAr: ["إدارة الذاكرة الافتراضية", "إعادة التشغيل القسري", "جدار الحماية", "حذف الملفات المؤقتة"],
      correct: 0,
      explFr: "L'OS alloue la RAM dynamiquement et utilise le disque dur (mémoire virtuelle / swap) pour soulager la RAM."
    },
    {
      qFr: "Quel OS est réputé pour être nativement installé sur les ordinateurs Apple ?",
      qEn: "Which OS is known to be natively installed on Apple computers?",
      qAr: "ما نظام التشغيل المعروف بأنه مثبت أصلاً على حواسيب أبل؟",
      optsFr: ["Windows", "ChromeOS", "Ubuntu", "macOS"],
      optsEn: ["Windows", "ChromeOS", "Ubuntu", "macOS"],
      optsAr: ["ويندوز", "نظام كروم", "أوبونتو", "نظام ماك macOS"],
      correct: 3,
      explFr: "macOS est le système d'exploitation propriétaire d'Apple pour ses ordinateurs Mac."
    }
  ],
  3: [
    {
      qFr: "Que retourne l'opération '1 ET 0' en logique booléenne ?",
      qEn: "What does '1 AND 0' return in boolean logic?",
      qAr: "ماذا ترجع العملية '1 AND 0' في المنطق البولياني؟",
      optsFr: ["1 (Vrai)", "0 (Faux)", "2", "Erreur"],
      optsEn: ["1 (True)", "0 (False)", "2", "Error"],
      optsAr: ["1 (صحيح)", "0 (خطأ)", "2", "خطأ برمجي"],
      correct: 1,
      explFr: "La porte ET (AND) retourne 1 uniquement si TOUTES les entrées sont 1."
    },
    {
      qFr: "Que retourne l'opération '0 OU 1' en logique booléenne ?",
      qEn: "What does '0 OR 1' return in boolean logic?",
      qAr: "ماذا ترجع العملية '0 OR 1' في المنطق البولياني؟",
      optsFr: ["0", "1", "Erreur", "0.5"],
      optsEn: ["0", "1", "Error", "0.5"],
      optsAr: ["0", "1", "خطأ", "0.5"],
      correct: 1,
      explFr: "La porte OU (OR) retourne 1 si AU MOINS l'une des entrées est à 1."
    },
    {
      qFr: "Quelle est la valeur de 'NON(1)' ?",
      qEn: "What is the value of 'NOT(1)'?",
      qAr: "ما هي قيمة 'NOT(1)'؟",
      optsFr: ["1", "0", "Vrai", "11"],
      optsEn: ["1", "0", "True", "11"],
      optsAr: ["1", "0", "صحيح", "11"],
      correct: 1,
      explFr: "La porte NON (NOT) inverse le signal : le 1 devient 0, et le 0 devient 1."
    },
    {
      qFr: "Résolvez l'expression : (1 ET 1) OU 0",
      qEn: "Solve the expression: (1 AND 1) OR 0",
      qAr: "قم بحل التعبير: (1 AND 1) OR 0",
      optsFr: ["0", "1", "Impossible", "2"],
      optsEn: ["0", "1", "Impossible", "2"],
      optsAr: ["0", "1", "مستحيل", "2"],
      correct: 1,
      explFr: "(1 ET 1) donne 1. Ensuite, 1 OU 0 donne 1."
    },
    {
      qFr: "Résolvez : NON(0 ET 1) ET 1",
      qEn: "Solve: NOT(0 AND 1) AND 1",
      qAr: "حل التعبير: NOT(0 AND 1) AND 1",
      optsFr: ["0", "1", "NON", "OUI"],
      optsEn: ["0", "1", "NOT", "YES"],
      optsAr: ["0", "1", "لا", "نعم"],
      correct: 1,
      explFr: "(0 ET 1) donne 0. NON(0) donne 1. Enfin, 1 ET 1 donne 1."
    },
    {
      qFr: "Laquelle de ces tables de vérité correspond à la porte ET (AND) ?",
      qEn: "Which of these truth tables corresponds to the AND gate?",
      qAr: "أي من جداول الحقيقة هذه يتوافق مع بوابة AND؟",
      optsFr: ["0-0=0, 0-1=1, 1-0=1, 1-1=1", "0-0=0, 0-1=0, 1-0=0, 1-1=1", "0-0=1, 0-1=0, 1-0=0, 1-1=0", "0-0=1, 0-1=1, 1-0=1, 1-1=0"],
      optsEn: ["0-0=0, 0-1=1, 1-0=1, 1-1=1", "0-0=0, 0-1=0, 1-0=0, 1-1=1", "0-0=1, 0-1=0, 1-0=0, 1-1=0", "0-0=1, 0-1=1, 1-0=1, 1-1=0"],
      optsAr: ["0-0=0, 0-1=1, 1-0=1, 1-1=1", "0-0=0, 0-1=0, 1-0=0, 1-1=1", "0-0=1, 0-1=0, 1-0=0, 1-1=0", "0-0=1, 0-1=1, 1-0=1, 1-1=0"],
      correct: 1,
      explFr: "Pour la porte ET, le résultat est 1 uniquement si les deux entrées sont 1."
    },
    {
      qFr: "Que signifie le système 'Binaire' ?",
      qEn: "What does the 'Binary' system mean?",
      qAr: "ماذا يعني النظام 'الثنائي'؟",
      optsFr: ["Un système avec 10 chiffres", "Un système avec seulement des lettres", "Un système à base 2, utilisant uniquement des 0 et des 1", "Un système complexe de couleurs"],
      optsEn: ["A system with 10 digits", "A system with only letters", "A base-2 system using only 0s and 1s", "A complex color system"],
      optsAr: ["نظام مكون من 10 أرقام", "نظام يحتوي على أحرف فقط", "نظام ذو أساس 2، يستخدم فقط 0 و 1", "نظام معقد للألوان"],
      correct: 2,
      explFr: "Le système binaire est la base de l'informatique, utilisant 0 (courant éteint) et 1 (courant allumé)."
    },
    {
      qFr: "Comment s'appelle l'algèbre qui étudie ces opérations logiques (ET, OU, NON) ?",
      qEn: "What is the name of the algebra that studies these logical operations (AND, OR, NOT)?",
      qAr: "ما اسم الجبر الذي يدرس هذه العمليات المنطقية (AND, OR, NOT)؟",
      optsFr: ["L'algèbre linéaire", "L'algèbre géométrique", "L'algèbre booléenne", "Les mathématiques quantiques"],
      optsEn: ["Linear algebra", "Geometric algebra", "Boolean algebra", "Quantum mathematics"],
      optsAr: ["الجبر الخطي", "الجبر الهندسي", "الجبر البولياني", "رياضيات الكم"],
      correct: 2,
      explFr: "L'algèbre de Boole, ou algèbre booléenne, inventée par George Boole."
    },
    {
      qFr: "Si A=1 et B=0, quelle est la valeur de : (A OU B) ET (NON B) ?",
      qEn: "If A=1 and B=0, what is the value of: (A OR B) AND (NOT B)?",
      qAr: "إذا كان A=1 و B=0، ما هي قيمة: (A OR B) AND (NOT B)؟",
      optsFr: ["0", "1", "Erreur", "Indéterminé"],
      optsEn: ["0", "1", "Error", "Undetermined"],
      optsAr: ["0", "1", "خطأ", "غير محدد"],
      correct: 1,
      explFr: "(1 OU 0) donne 1. (NON 0) donne 1. Puis 1 ET 1 donne 1."
    },
    {
      qFr: "À l'intérieur du processeur, quel composant physique réalise ces portes logiques ?",
      qEn: "Inside the processor, what physical component creates these logic gates?",
      qAr: "داخل المعالج، ما هو المكون المادي الذي يصنع هذه البوابات المنطقية؟",
      optsFr: ["Les disques magnétiques", "Les transistors", "Les lasers", "Les condensateurs"],
      optsEn: ["Magnetic disks", "Transistors", "Lasers", "Capacitors"],
      optsAr: ["الأقراص المغناطيسية", "الترانزستورات", "الليزر", "المكثفات"],
      correct: 1,
      explFr: "Un processeur est composé de milliards de transistors microscopiques agissant comme des interrupteurs."
    }
  ],
  4: [
    {
      qFr: "Quelle est la différence entre un logiciel système et un logiciel d'application ?",
      qEn: "What is the difference between system software and application software?",
      qAr: "ما الفرق بين برمجيات النظام وبرمجيات التطبيقات؟",
      optsFr: ["Aucune différence", "Le système gère la machine, l'application sert l'utilisateur", "L'application est toujours payante", "Le système est toujours open source"],
      optsEn: ["No difference", "System manages the machine, application serves the user", "Applications are always paid", "System is always open source"],
      optsAr: ["لا فرق", "النظام يدير الجهاز، التطبيق يخدم المستخدم", "التطبيقات دائماً مدفوعة", "النظام دائماً مفتوح المصدر"],
      correct: 1,
      explFr: "Les logiciels système gèrent le matériel. Les applications sont des outils pour l'utilisateur."
    },
    {
      qFr: "Lequel de ces éléments est un logiciel de type 'Pilote' (Driver) ?",
      qEn: "Which of these is a 'Driver' software?",
      qAr: "أي من هذه العناصر يعتبر برنامج 'تعريف' (Driver)؟",
      optsFr: ["Microsoft Word", "Le logiciel NVIDIA pour la carte graphique", "Google Chrome", "Adobe Photoshop"],
      optsEn: ["Microsoft Word", "NVIDIA software for graphics card", "Google Chrome", "Adobe Photoshop"],
      optsAr: ["مايكروسوفت وورد", "برنامج NVIDIA لبطاقة الرسومات", "جوجل كروم", "أدوبي فوتوشوب"],
      correct: 1,
      explFr: "Un pilote est un logiciel système qui permet à l'OS de communiquer avec un matériel spécifique."
    },
    {
      qFr: "Que signifie 'Open Source' ?",
      qEn: "What does 'Open Source' mean?",
      qAr: "ماذا تعني 'مفتوح المصدر'؟",
      optsFr: ["Le logiciel ne peut pas être fermé", "Le code source est public et modifiable", "Le logiciel est obligatoirement payant", "Le logiciel est fait pour les écoles"],
      optsEn: ["The software cannot be closed", "The source code is public and modifiable", "The software must be paid", "The software is for schools"],
      optsAr: ["لا يمكن إغلاق البرنامج", "الشيفرة المصدرية عامة وقابلة للتعديل", "يجب أن يكون البرنامج مدفوعاً", "البرنامج مخصص للمدارس"],
      correct: 1,
      explFr: "Open Source signifie que n'importe quel développeur peut consulter et modifier le code du logiciel."
    },
    {
      qFr: "Parmi ces logiciels, lequel est un logiciel d'application de traitement de texte ?",
      qEn: "Among these software, which one is a word processing application?",
      qAr: "من بين هذه البرمجيات، أيهما تطبيق معالجة نصوص؟",
      optsFr: ["Linux", "Excel", "LibreOffice Writer", "Avast Antivirus"],
      optsEn: ["Linux", "Excel", "LibreOffice Writer", "Avast Antivirus"],
      optsAr: ["لينكس", "إكسل", "LibreOffice Writer", "برنامج أفاست لمكافحة الفيروسات"],
      correct: 2,
      explFr: "LibreOffice Writer (comme MS Word) est une application destinée au traitement de texte."
    },
    {
      qFr: "Qu'est-ce qu'un 'Freeware' ?",
      qEn: "What is a 'Freeware'?",
      qAr: "ما هو 'البرنامج المجاني' (Freeware)؟",
      optsFr: ["Un logiciel totalement gratuit mais dont le code source reste fermé", "Un logiciel libre (Open Source)", "Un logiciel d'essai limité à 30 jours", "Un virus caché"],
      optsEn: ["A fully free software but its source code remains closed", "A free and open source software", "A trial software limited to 30 days", "A hidden virus"],
      optsAr: ["برنامج مجاني بالكامل ولكن شفرته المصدرية تظل مغلقة", "برنامج حر ومفتوح المصدر", "برنامج تجريبي محدود بـ 30 يوماً", "فيروس مخفي"],
      correct: 0,
      explFr: "Un freeware est gratuit à l'usage, mais n'est pas forcément Open Source (ex: Skype, Discord)."
    },
    {
      qFr: "À quelle catégorie appartient un logiciel 'Antivirus' ?",
      qEn: "To which category does an 'Antivirus' software belong?",
      qAr: "إلى أي فئة ينتمي برنامج 'مكافحة الفيروسات'؟",
      optsFr: ["Application métier", "Logiciel de divertissement", "Logiciel utilitaire (Système)", "Pilote matériel"],
      optsEn: ["Business application", "Entertainment software", "Utility software (System)", "Hardware driver"],
      optsAr: ["تطبيق أعمال", "برنامج ترفيهي", "برنامج خدماتي (نظام)", "تعريف الأجهزة"],
      correct: 2,
      explFr: "Les utilitaires (antivirus, défragmenteur) sont des logiciels qui aident à maintenir et sécuriser le système."
    },
    {
      qFr: "Qu'est-ce qu'une licence 'Shareware' ?",
      qEn: "What is a 'Shareware' license?",
      qAr: "ما هو ترخيص 'البرامج التجريبية' (Shareware)؟",
      optsFr: ["Un logiciel partagé en open source", "Un logiciel gratuit pour une période ou avec des fonctions limitées, demandant ensuite un paiement", "Un logiciel pour le cloud", "Un logiciel qui partage vos données"],
      optsEn: ["An open source shared software", "A software free for a period or with limited features, then requiring payment", "A cloud software", "A software that shares your data"],
      optsAr: ["برنامج مشترك مفتوح المصدر", "برنامج مجاني لفترة أو بوظائف محدودة، ثم يطلب الدفع", "برنامج سحابي", "برنامج يشارك بياناتك"],
      correct: 1,
      explFr: "WinRAR est l'exemple typique d'un shareware (essai gratuit, puis invite à l'achat)."
    },
    {
      qFr: "Lequel est un logiciel de type 'Propriétaire' ?",
      qEn: "Which one is a 'Proprietary' software?",
      qAr: "أي منها هو برنامج من نوع 'ملكية' (Proprietary)؟",
      optsFr: ["Mozilla Firefox", "Ubuntu", "Microsoft Office", "GIMP"],
      optsEn: ["Mozilla Firefox", "Ubuntu", "Microsoft Office", "GIMP"],
      optsAr: ["موزيلا فايرفوكس", "أوبونتو", "مايكروسوفت أوفيس", "برنامج جي إم بي"],
      correct: 2,
      explFr: "Microsoft Office est un logiciel commercial, son code n'est pas public et il nécessite l'achat d'une licence."
    },
    {
      qFr: "Un logiciel créé spécifiquement pour la gestion comptable d'une entreprise est...",
      qEn: "A software created specifically for the accounting management of a company is...",
      qAr: "برنامج مصمم خصيصاً للإدارة المحاسبية لشركة هو...",
      optsFr: ["Un utilitaire", "Un pilote", "Un logiciel d'application spécifique (métier)", "Un système d'exploitation"],
      optsEn: ["A utility", "A driver", "A specific application software (business)", "An operating system"],
      optsAr: ["أداة مساعدة", "برنامج تعريف", "برنامج تطبيقي محدد (للأعمال)", "نظام تشغيل"],
      correct: 2,
      explFr: "C'est une application métier conçue pour répondre à un besoin précis de l'utilisateur."
    },
    {
      qFr: "Pourquoi utilise-t-on des logiciels utilitaires ?",
      qEn: "Why do we use utility software?",
      qAr: "لماذا نستخدم البرامج الخدماتية؟",
      optsFr: ["Pour naviguer sur Internet", "Pour optimiser, analyser et configurer l'ordinateur", "Pour créer des jeux vidéos 3D", "Pour remplacer le processeur"],
      optsEn: ["To browse the Internet", "To optimize, analyze, and configure the computer", "To create 3D video games", "To replace the processor"],
      optsAr: ["لتصفح الإنترنت", "لتحسين وتحليل وتكوين الحاسوب", "لإنشاء ألعاب فيديو ثلاثية الأبعاد", "لاستبدال المعالج"],
      correct: 1,
      explFr: "Les utilitaires (gestionnaire de disque, nettoyeur) sont faits pour maintenir les performances du PC."
    }
  ],
  5: [
    {
      qFr: "Combien de pages minimum doit contenir un dossier de recherche bien structuré ?",
      qEn: "How many pages minimum should a well-structured research paper contain?",
      qAr: "كم صفحة كحد أدنى يجب أن يحتوي بحث منظم جيداً؟",
      optsFr: ["2-3 pages", "5-8 pages", "15-20 pages", "50+ pages"],
      optsEn: ["2-3 pages", "5-8 pages", "15-20 pages", "50+ pages"],
      optsAr: ["2-3 صفحات", "5-8 صفحات", "15-20 صفحة", "50+ صفحة"],
      correct: 1,
      explFr: "Un dossier de recherche académique bien structuré contient généralement 5 à 8 pages."
    },
    {
      qFr: "Quel est le but principal de l'Introduction dans un dossier de recherche ?",
      qEn: "What is the main purpose of the Introduction in a research paper?",
      qAr: "ما هو الغرض الرئيسي من المقدمة في البحث العلمي؟",
      optsFr: ["Donner la conclusion immédiatement", "Présenter le contexte et la problématique", "Lister toutes les sources", "Remplir l'espace"],
      optsEn: ["Give the conclusion immediately", "Present the context and the problem statement", "List all sources", "Fill space"],
      optsAr: ["إعطاء الخاتمة فوراً", "تقديم السياق والإشكالية", "سرد جميع المصادر", "ملء الفراغ"],
      correct: 1,
      explFr: "L'introduction sert à accrocher le lecteur, poser le contexte et annoncer le plan."
    },
    {
      qFr: "Qu'est-ce qu'une 'problématique' dans un dossier ?",
      qEn: "What is a 'problem statement' in a paper?",
      qAr: "ما هي 'الإشكالية' في البحث؟",
      optsFr: ["Un bug informatique", "La question centrale à laquelle le dossier va tenter de répondre", "Le prix du document", "Une erreur d'orthographe"],
      optsEn: ["A computer bug", "The central question the paper will attempt to answer", "The price of the document", "A spelling error"],
      optsAr: ["خلل برمجي", "السؤال المركزي الذي سيحاول البحث الإجابة عليه", "سعر المستند", "خطأ إملائي"],
      correct: 1,
      explFr: "La problématique est l'axe de réflexion principal (ex: Pourquoi Linux domine-t-il les serveurs ?)."
    },
    {
      qFr: "Pourquoi est-il crucial de citer ses sources à la fin du dossier ?",
      qEn: "Why is it crucial to cite your sources at the end of the paper?",
      qAr: "لماذا من الضروري ذكر المصادر في نهاية البحث؟",
      optsFr: ["Pour décorer la page", "Pour éviter le plagiat et prouver la fiabilité des informations", "Parce que c'est une loi gouvernementale", "Pour faire de la publicité aux sites web"],
      optsEn: ["To decorate the page", "To avoid plagiarism and prove information reliability", "Because it's a government law", "To advertise websites"],
      optsAr: ["لتزيين الصفحة", "لتجنب الانتحال وإثبات موثوقية المعلومات", "لأنه قانون حكومي", "للإعلان للمواقع الإلكترونية"],
      correct: 1,
      explFr: "La bibliographie donne de la crédibilité à votre travail et respecte les droits d'auteur."
    },
    {
      qFr: "Dans un dossier technique de 5-8 pages, quelle proportion doit prendre le corps (développement/analyse) ?",
      qEn: "In a 5-8 page technical paper, what proportion should the body (development/analysis) take?",
      qAr: "في بحث تقني من 5-8 صفحات، ما هي النسبة التي يجب أن يأخذها المحتوى الرئيسي (التطوير/التحليل)؟",
      optsFr: ["1 page", "La majeure partie (environ 3 à 5 pages)", "Il n'y a pas de développement", "Moins que la conclusion"],
      optsEn: ["1 page", "The majority (about 3 to 5 pages)", "There is no body", "Less than the conclusion"],
      optsAr: ["صفحة واحدة", "الجزء الأكبر (حوالي 3 إلى 5 صفحات)", "لا يوجد محتوى رئيسي", "أقل من الخاتمة"],
      correct: 1,
      explFr: "L'analyse et la comparaison constituent le cœur de la recherche et occupent la plus grande partie."
    },
    {
      qFr: "Que devrait contenir la Page de Garde ?",
      qEn: "What should the Cover Page contain?",
      qAr: "ماذا يجب أن تحتوي صفحة الغلاف؟",
      optsFr: ["Titre, nom de l'auteur, date, formation", "L'introduction complète", "Le code source du logiciel", "Uniquement une grande image"],
      optsEn: ["Title, author's name, date, degree/course", "The full introduction", "The software source code", "Only a large image"],
      optsAr: ["العنوان، اسم المؤلف، التاريخ، واسم الدورة", "المقدمة الكاملة", "الشيفرة المصدرية للبرنامج", "صورة كبيرة فقط"],
      correct: 0,
      explFr: "Elle présente de manière professionnelle le document (Titre, auteur, contexte)."
    },
    {
      qFr: "Qu'est-ce qu'une 'source fiable' pour un dossier en informatique ?",
      qEn: "What is a 'reliable source' for a computer science paper?",
      qAr: "ما هو 'المصدر الموثوق' لبحث في علوم الحاسوب؟",
      optsFr: ["Un commentaire sur YouTube", "La documentation officielle, des articles académiques ou des livres", "Un blog anonyme", "Un post sur un réseau social"],
      optsEn: ["A YouTube comment", "Official documentation, academic articles, or books", "An anonymous blog", "A social media post"],
      optsAr: ["تعليق على يوتيوب", "التوثيق الرسمي، المقالات الأكاديمية أو الكتب", "مدونة مجهولة", "منشور على شبكات التواصل الاجتماعي"],
      correct: 1,
      explFr: "Il faut privilégier les documentations officielles des technologies ou les journaux scientifiques."
    },
    {
      qFr: "Quel est le but de la Conclusion ?",
      qEn: "What is the purpose of the Conclusion?",
      qAr: "ما هو الغرض من الخاتمة؟",
      optsFr: ["Rajouter de nouveaux arguments", "Résumer les points clés et répondre à la problématique", "Copier-coller l'introduction", "Remercier la famille"],
      optsEn: ["Add new arguments", "Summarize key points and answer the problem statement", "Copy-paste the introduction", "Thank family"],
      optsAr: ["إضافة حجج جديدة", "تلخيص النقاط الرئيسية والإجابة على الإشكالية", "نسخ ولصق المقدمة", "شكر العائلة"],
      correct: 1,
      explFr: "La conclusion synthétise l'analyse et apporte une réponse claire à la question initiale."
    },
    {
      qFr: "Pourquoi est-il recommandé d'utiliser des schémas ou tableaux dans un dossier technique ?",
      qEn: "Why is it recommended to use diagrams or tables in a technical paper?",
      qAr: "لماذا ينصح باستخدام المخططات أو الجداول في بحث تقني؟",
      optsFr: ["Pour gagner de la place", "Pour faciliter la compréhension des comparaisons ou architectures", "Pour rendre le fichier plus lourd", "Ce n'est pas recommandé"],
      optsEn: ["To save space", "To facilitate understanding of comparisons or architectures", "To make the file heavier", "It is not recommended"],
      optsAr: ["لتوفير المساحة", "لتسهيل فهم المقارنات أو البنية", "لجعل حجم الملف أكبر", "لا ينصح بذلك"],
      correct: 1,
      explFr: "Un bon schéma vaut souvent mieux qu'un long texte pour expliquer le fonctionnement d'un système."
    },
    {
      qFr: "Comment organiser le texte pour qu'il soit agréable à lire ?",
      qEn: "How should text be organized to make it pleasant to read?",
      qAr: "كيف يجب تنظيم النص لجعله ممتعاً في القراءة؟",
      optsFr: ["Faire un seul bloc de texte sans paragraphes", "Utiliser des titres, des sous-titres, et aérer avec des paragraphes", "Écrire tout en majuscules", "Changer de police à chaque ligne"],
      optsEn: ["Write one single block of text without paragraphs", "Use headings, subheadings, and space out with paragraphs", "Write everything in uppercase", "Change font on every line"],
      optsAr: ["كتابة كتلة نصية واحدة بدون فقرات", "استخدام العناوين، العناوين الفرعية، وتقسيم النص إلى فقرات", "كتابة كل شيء بأحرف كبيرة", "تغيير الخط في كل سطر"],
      correct: 1,
      explFr: "La clarté visuelle et la structuration (h1, h2, listes) sont essentielles pour un dossier professionnel."
    }
  ]
};

async function main() {
  const course = await prisma.course.findUnique({ where: { slug: 'architecture' } });
  if (!course) {
    console.error('Course "architecture" not found!');
    return;
  }

  let updated = 0;
  for (const [orderStr, questions] of Object.entries(quizzesData)) {
    const order = parseInt(orderStr);
    const lesson = await prisma.lesson.findFirst({ where: { courseId: course.id, order } });
    if (!lesson) continue;

    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        quizData: questions as any
      },
    });
    updated++;
  }

  console.log(`Architecture quizzes seeded successfully. ${updated} lessons updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
