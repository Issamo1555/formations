/**
 * Seed quiz data for all lessons.
 * Usage: npx tsx prisma/seed-quizzes.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QuizData {
  questionFr: string;
  questionEn: string;
  questionAr: string;
  options: [string, string, string, string]; // FR
  optionsEn: [string, string, string, string];
  optionsAr: [string, string, string, string];
  correct: number; // 0-3
  explainFr: string;
  explainEn: string;
  explainAr: string;
}

// ── PHP Quizzes ──
const phpQuizzes: Record<number, QuizData> = {
  1: {
    questionFr: 'Que signifie PHP ?',
    questionEn: 'What does PHP stand for?',
    questionAr: 'ماذا يعني PHP؟',
    options: ['Personal Home Page', 'Hypertext Preprocessor', 'Professional HTML Processor', 'PHP Has Power'],
    optionsEn: ['Personal Home Page', 'Hypertext Preprocessor', 'Professional HTML Processor', 'PHP Has Power'],
    optionsAr: ['Personal Home Page', 'Hypertext Preprocessor', 'Professional HTML Processor', 'PHP Has Power'],
    correct: 1,
    explainFr: 'PHP signifie "Hypertext Preprocessor" (acronyme recursif).',
    explainEn: 'PHP stands for "Hypertext Preprocessor" (recursive acronym).',
    explainAr: 'PHP تعني "Hypertext Preprocessor" (اختصار تكراري).',
  },
  2: {
    questionFr: "Lequel N'est PAS un commentaire PHP valide ?",
    questionEn: 'Which is NOT a valid PHP comment?',
    questionAr: 'أي من هذه ليس تعليق PHP صحيح؟',
    options: ['// commentaire', '/* commentaire */', '<!-- commentaire -->', '# commentaire'],
    optionsEn: ['// comment', '/* comment */', '<!-- comment -->', '# comment'],
    optionsAr: ['// تعليق', '/* تعليق */', '<!-- تعليق -->', '# تعليق'],
    correct: 2,
    explainFr: '<!-- --> est un commentaire HTML, pas PHP. PHP utilise //, #, et /* */.',
    explainEn: '<!-- --> is an HTML comment, not PHP. PHP uses //, #, and /* */.',
    explainAr: '<!-- --> هو تعليق HTML وليس PHP. PHP يستخدم // و # و /* */.',
  },
  3: {
    questionFr: 'Comment definir une constante en PHP ?',
    questionEn: 'How to define a constant in PHP?',
    questionAr: 'كيف تعرف ثابت في PHP؟',
    options: ['const $MAX = 10;', 'define("MAX", 10);', '$MAX = constant(10);', 'final MAX = 10;'],
    optionsEn: ['const $MAX = 10;', 'define("MAX", 10);', '$MAX = constant(10);', 'final MAX = 10;'],
    optionsAr: ['const $MAX = 10;', 'define("MAX", 10);', '$MAX = constant(10);', 'final MAX = 10;'],
    correct: 1,
    explainFr: 'define("NOM", valeur) est la facon standard. On n\'utilise pas $ avec les constantes.',
    explainEn: 'define("NAME", value) is the standard way. Constants don\'t use $.',
    explainAr: 'define("NAME", value) هي الطريقة القياسية. الثوابت لا تستخدم $.',
  },
  4: {
    questionFr: 'Quel est le bon nom de variable PHP ?',
    questionEn: 'Which is a valid PHP variable name?',
    questionAr: 'أي من هذه اسم متغير PHP صحيح؟',
    options: ['$1age', '#age', '$mon_age', 'mon$age'],
    optionsEn: ['$1age', '#age', '$my_age', 'my$age'],
    optionsAr: ['$1age', '#age', '$my_age', 'my$age'],
    correct: 2,
    explainFr: 'Une variable PHP commence par $ suivi d\'une lettre ou underscore.',
    explainEn: 'A PHP variable starts with $ followed by a letter or underscore.',
    explainAr: 'متغير PHP يبدأ بـ $ يتبعه حرف أو شرطة سفلية.',
  },
  5: {
    questionFr: 'Comment acceder a "Paris" dans $p = ["ville" => "Paris"] ?',
    questionEn: 'How to access "Paris" in $p = ["ville" => "Paris"]?',
    questionAr: 'كيف تصل إلى "Paris" في $p = ["ville" => "Paris"]؟',
    options: ['$p[0]', '$p->ville', '$p["ville"]', 'personne.ville'],
    optionsEn: ['$p[0]', '$p->ville', '$p["ville"]', 'person.ville'],
    optionsAr: ['$p[0]', '$p->ville', '$p["ville"]', 'person.ville'],
    correct: 2,
    explainFr: 'Pour un tableau associatif, on utilise $tableau["cle"].',
    explainEn: 'For an associative array, use $array["key"].',
    explainAr: 'للمصفوفة الترابطية، استخدم $array["key"].',
  },
  6: {
    questionFr: 'Que retourne "5" === 5 en PHP ?',
    questionEn: 'What does "5" === 5 return in PHP?',
    questionAr: 'ماذا ترجع "5" === 5 في PHP؟',
    options: ['true', 'false', '1', 'null'],
    optionsEn: ['true', 'false', '1', 'null'],
    optionsAr: ['true', 'false', '1', 'null'],
    correct: 1,
    explainFr: '=== compare la valeur ET le type. "5" est string, 5 est int. Types differents → false.',
    explainEn: '=== compares value AND type. "5" is string, 5 is int. Different types → false.',
    explainAr: '=== تقارن القيمة والنوع. "5" نص و5 عدد. أنواع مختلفة → false.',
  },
  7: {
    questionFr: 'Quelle est la difference entre == et === en PHP ?',
    questionEn: 'What is the difference between == and === in PHP?',
    questionAr: 'ما الفرق بين == و === في PHP؟',
    options: ['Aucune difference', '=== compare valeur ET type, == compare seulement la valeur', '== est plus rapide', '=== ne fonctionne qu\'avec les strings'],
    optionsEn: ['No difference', '=== compares value AND type, == compares only value', '== is faster', '=== only works with strings'],
    optionsAr: ['لا فرق', '=== تقارن القيمة والنوع، == تقارن القيمة فقط', '== أسرع', '=== تعمل فقط مع النصوص'],
    correct: 1,
    explainFr: '=== est une comparaison stricte : valeur + type. == compare seulement la valeur.',
    explainEn: '=== is strict comparison: value + type. == compares only value.',
    explainAr: '=== مقارنة صارمة: القيمة + النوع. == تقارن القيمة فقط.',
  },
  8: {
    questionFr: 'Quelle boucle utiliser pour parcourir un tableau ?',
    questionEn: 'Which loop to iterate over an array?',
    questionAr: 'أي حلقة تستخدم لتكرار على مصفوفة؟',
    options: ['for', 'while', 'foreach', 'do...while'],
    optionsEn: ['for', 'while', 'foreach', 'do...while'],
    optionsAr: ['for', 'while', 'foreach', 'do...while'],
    correct: 2,
    explainFr: 'foreach est specialement concu pour parcourir des tableaux en PHP.',
    explainEn: 'foreach is specifically designed to iterate over arrays in PHP.',
    explainAr: 'foreach مصممة خصيصاً لتكرار على المصفوفات في PHP.',
  },
  9: {
    questionFr: 'Quelle fonction protege contre les attaques XSS ?',
    questionEn: 'Which function protects against XSS attacks?',
    questionAr: 'أي دالة تحمي من هجمات XSS؟',
    options: ['strip_whitespace()', 'htmlspecialchars()', 'md5()', 'urlencode()'],
    optionsEn: ['strip_whitespace()', 'htmlspecialchars()', 'md5()', 'urlencode()'],
    optionsAr: ['strip_whitespace()', 'htmlspecialchars()', 'md5()', 'urlencode()'],
    correct: 1,
    explainFr: 'htmlspecialchars() convertit les caracteres speciaux HTML en entites, empechant l\'injection XSS.',
    explainEn: 'htmlspecialchars() converts special HTML chars to entities, preventing XSS injection.',
    explainAr: 'htmlspecialchars() تحول أحرف HTML الخاصة إلى كيانات، مما يمنع حقن XSS.',
  },
  10: {
    questionFr: 'Ou sont stockes les cookies PHP ?',
    questionEn: 'Where are PHP cookies stored?',
    questionAr: 'أين تُخزن ملفات تعريف الارتباط PHP؟',
    options: ['Sur le serveur', 'Dans la base de donnees', 'Dans le navigateur', 'Dans un fichier serveur'],
    optionsEn: ['On the server', 'In the database', 'In the browser', 'In a server file'],
    optionsAr: ['على الخادم', 'في قاعدة البيانات', 'في المتصفح', 'في ملف على الخادم'],
    correct: 2,
    explainFr: 'Les cookies sont stockes cote client, dans le navigateur.',
    explainEn: 'Cookies are stored client-side, in the browser.',
    explainAr: 'ملفات تعريف الارتباط تُخزن على جانب العميل، في المتصفح.',
  },
  11: {
    questionFr: 'Ou sont stockees les donnees de session PHP ?',
    questionEn: 'Where are PHP session data stored?',
    questionAr: 'أين تُخزن بيانات جلسة PHP؟',
    options: ['Dans le navigateur', 'Dans la base de donnees', 'Sur le serveur', 'Dans l\'URL'],
    optionsEn: ['In the browser', 'In the database', 'On the server', 'In the URL'],
    optionsAr: ['في المتصفح', 'في قاعدة البيانات', 'على الخادم', 'في URL'],
    correct: 2,
    explainFr: 'Les sessions sont stockees cote serveur. Seul l\'ID (PHPSESSID) est transmis au client.',
    explainEn: 'Sessions are stored server-side. Only the ID (PHPSESSID) is sent to the client.',
    explainAr: 'الجلسات تُخزن على الخادم. فقط المعرف (PHPSESSID) يُرسل للعميل.',
  },
  12: {
    questionFr: 'A quoi sert $this en POO PHP ?',
    questionEn: 'What is $this used for in PHP OOP?',
    questionAr: 'ما فائدة $this في OOP PHP؟',
    options: ['Variable globale reservee', 'Reference a l\'objet courant', 'Designe la classe parente', 'Utilise uniquement dans le constructeur'],
    optionsEn: ['Reserved global variable', 'Reference to the current object', 'Designates the parent class', 'Only used in constructor'],
    optionsAr: ['متغير عام محجوز', 'مرجع للكائن الحالي', 'يشير للفئة الأم', 'يُستخدم فقط في الباني'],
    correct: 1,
    explainFr: '$this fait reference a l\'instance courante de la classe.',
    explainEn: '$this refers to the current instance of the class.',
    explainAr: '$this يشير إلى النسخة الحالية من الفئة.',
  },
};

// ── Python Quizzes ──
const pythonQuizzes: Record<number, QuizData> = {
  1: {
    questionFr: 'Qui a cree Python ?',
    questionEn: 'Who created Python?',
    questionAr: 'من أنشأ Python؟',
    options: ['James Gosling', 'Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup'],
    optionsEn: ['James Gosling', 'Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup'],
    optionsAr: ['James Gosling', 'Guido van Rossum', 'Dennis Ritchie', 'Bjarne Stroustrup'],
    correct: 1,
    explainFr: 'Guido van Rossum a cree Python en 1991.',
    explainEn: 'Guido van Rossum created Python in 1991.',
    explainAr: 'Guido van Rossum أنشأ Python عام 1991.',
  },
  2: {
    questionFr: 'Quel est le type de x = 3.14 ?',
    questionEn: 'What is the type of x = 3.14?',
    questionAr: 'ما نوع x = 3.14؟',
    options: ['int', 'float', 'double', 'decimal'],
    optionsEn: ['int', 'float', 'double', 'decimal'],
    optionsAr: ['int', 'float', 'double', 'decimal'],
    correct: 1,
    explainFr: 'En Python, 3.14 est de type float.',
    explainEn: 'In Python, 3.14 is of type float.',
    explainAr: 'في Python، 3.14 من نوع float.',
  },
  3: {
    questionFr: 'Quel mot-cle pour "sinon si" en Python ?',
    questionEn: 'What keyword for "else if" in Python?',
    questionAr: 'ما كلمة "else if" في Python؟',
    options: ['else if', 'elseif', 'elif', 'elsif'],
    optionsEn: ['else if', 'elseif', 'elif', 'elsif'],
    optionsAr: ['else if', 'elseif', 'elif', 'elsif'],
    correct: 2,
    explainFr: 'Python utilise "elif" au lieu de "else if".',
    explainEn: 'Python uses "elif" instead of "else if".',
    explainAr: 'Python تستخدم "elif" بدلاً من "else if".',
  },
  4: {
    questionFr: 'Que fait range(5) ?',
    questionEn: 'What does range(5) do?',
    questionAr: 'ماذا يفعل range(5)؟',
    options: ['Genere 1 a 5', 'Genere 0 a 4', 'Genere 0 a 5', 'Genere 1 a 4'],
    optionsEn: ['Generates 1 to 5', 'Generates 0 to 4', 'Generates 0 to 5', 'Generates 1 to 4'],
    optionsAr: ['ينشئ 1 إلى 5', 'ينشئ 0 إلى 4', 'ينشئ 0 إلى 5', 'ينشئ 1 إلى 4'],
    correct: 1,
    explainFr: 'range(5) genere les nombres de 0 a 4 (5 exclus).',
    explainEn: 'range(5) generates numbers from 0 to 4 (5 excluded).',
    explainAr: 'range(5) ينشئ الأرقام من 0 إلى 4 (5 مستبعد).',
  },
  5: {
    questionFr: 'Comment ajouter un element a une liste ?',
    questionEn: 'How to add an element to a list?',
    questionAr: 'كيف تضيف عنصراً لقائمة؟',
    options: ['list.add(x)', 'list.append(x)', 'list.push(x)', 'list.insert(x)'],
    optionsEn: ['list.add(x)', 'list.append(x)', 'list.push(x)', 'list.insert(x)'],
    optionsAr: ['list.add(x)', 'list.append(x)', 'list.push(x)', 'list.insert(x)'],
    correct: 1,
    explainFr: 'append() ajoute un element a la fin de la liste.',
    explainEn: 'append() adds an element to the end of the list.',
    explainAr: 'append() يضيف عنصراً في نهاية القائمة.',
  },
  6: {
    questionFr: 'Comment obtenir toutes les cles d\'un dictionnaire ?',
    questionEn: 'How to get all keys of a dictionary?',
    questionAr: 'كيف تحصل على جميع مفاتيح القاموس؟',
    options: ['dict.all()', 'dict.keys()', 'dict.values()', 'dict.items()'],
    optionsEn: ['dict.all()', 'dict.keys()', 'dict.values()', 'dict.items()'],
    optionsAr: ['dict.all()', 'dict.keys()', 'dict.values()', 'dict.items()'],
    correct: 1,
    explainFr: 'keys() retourne toutes les cles du dictionnaire.',
    explainEn: 'keys() returns all keys of the dictionary.',
    explainAr: 'keys() ترجع جميع مفاتيح القاموس.',
  },
  7: {
    questionFr: 'Que fait lambda x: x**2 ?',
    questionEn: 'What does lambda x: x**2 do?',
    questionAr: 'ماذا يفعل lambda x: x**2؟',
    options: ['Retourne x * 2', 'Retourne x au carre', 'Retourne x + 2', 'Retourne x / 2'],
    optionsEn: ['Returns x * 2', 'Returns x squared', 'Returns x + 2', 'Returns x / 2'],
    optionsAr: ['ترجع x * 2', 'ترجع x تربيع', 'ترجع x + 2', 'ترجع x / 2'],
    correct: 1,
    explainFr: '** est l\'operateur de puissance en Python. x**2 = x au carre.',
    explainEn: '** is the power operator in Python. x**2 = x squared.',
    explainAr: '** هو عامل القوة في Python. x**2 = x تربيع.',
  },
  8: {
    questionFr: 'Quel bloc capture les erreurs en Python ?',
    questionEn: 'Which block catches errors in Python?',
    questionAr: 'أي كتلة تلتقط الأخطاء في Python؟',
    options: ['catch...finally', 'try...except', 'if...error', 'do...catch'],
    optionsEn: ['catch...finally', 'try...except', 'if...error', 'do...catch'],
    optionsAr: ['catch...finally', 'try...except', 'if...error', 'do...catch'],
    correct: 1,
    explainFr: 'Python utilise try...except pour la gestion des exceptions.',
    explainEn: 'Python uses try...except for exception handling.',
    explainAr: 'Python تستخدم try...except لمعالجة الاستثناءات.',
  },
  9: {
    questionFr: 'Quel mot-cle pour l\'heritage en Python ?',
    questionEn: 'What keyword for inheritance in Python?',
    questionAr: 'ما كلمة الوراثة في Python؟',
    options: ['extends', 'inherits', 'class Enfant(Parent)', 'implements'],
    optionsEn: ['extends', 'inherits', 'class Child(Parent)', 'implements'],
    optionsAr: ['extends', 'inherits', 'class Enfant(Parent)', 'implements'],
    correct: 2,
    explainFr: 'En Python, on ecrit class Enfant(Parent): pour l\'heritage.',
    explainEn: 'In Python, write class Child(Parent): for inheritance.',
    explainAr: 'في Python، نكتب class Enfant(Parent): للوراثة.',
  },
  10: {
    questionFr: 'Quelle commande installe un package Python ?',
    questionEn: 'Which command installs a Python package?',
    questionAr: 'أي أمر يثبت حزمة Python؟',
    options: ['npm install', 'pip install', 'apt install', 'gem install'],
    optionsEn: ['npm install', 'pip install', 'apt install', 'gem install'],
    optionsAr: ['npm install', 'pip install', 'apt install', 'gem install'],
    correct: 1,
    explainFr: 'pip est le gestionnaire de packages Python.',
    explainEn: 'pip is the Python package manager.',
    explainAr: 'pip هو مدير حزم Python.',
  },
};

// ── n8n Quizzes ──
const n8nQuizzes: Record<number, QuizData> = {
  1: {
    questionFr: 'n8n est une alternative open-source a quel outil ?',
    questionEn: 'n8n is an open-source alternative to which tool?',
    questionAr: 'n8n بديل مفتوح المصدر لأي أداة؟',
    options: ['GitHub', 'Zapier', 'Docker', 'VS Code'],
    optionsEn: ['GitHub', 'Zapier', 'Docker', 'VS Code'],
    optionsAr: ['GitHub', 'Zapier', 'Docker', 'VS Code'],
    correct: 1,
    explainFr: 'n8n est une alternative open-source a Zapier et Make.',
    explainEn: 'n8n is an open-source alternative to Zapier and Make.',
    explainAr: 'n8n بديل مفتوح المصدر لـ Zapier وMake.',
  },
  2: {
    questionFr: 'Quel port utilise n8n par defaut ?',
    questionEn: 'What port does n8n use by default?',
    questionAr: 'ما المنفذ الذي يستخدمه n8n افتراضياً؟',
    options: ['3000', '5678', '8080', '443'],
    optionsEn: ['3000', '5678', '8080', '443'],
    optionsAr: ['3000', '5678', '8080', '443'],
    correct: 1,
    explainFr: 'n8n utilise le port 5678 par defaut.',
    explainEn: 'n8n uses port 5678 by default.',
    explainAr: 'n8n يستخدم المنفذ 5678 افتراضياً.',
  },
  3: {
    questionFr: 'Quel node est le point d\'entree d\'un workflow ?',
    questionEn: 'Which node is the entry point of a workflow?',
    questionAr: 'أي node هو نقطة الدخول لسير العمل؟',
    options: ['HTTP Request', 'Trigger', 'Set', 'Code'],
    optionsEn: ['HTTP Request', 'Trigger', 'Set', 'Code'],
    optionsAr: ['HTTP Request', 'Trigger', 'Set', 'Code'],
    correct: 1,
    explainFr: 'Le Trigger est le point d\'entree qui declenche le workflow.',
    explainEn: 'The Trigger is the entry point that starts the workflow.',
    explainAr: 'المحفز هو نقطة الدخول التي تبدأ سير العمل.',
  },
  4: {
    questionFr: 'Quel trigger declenche a intervalle regulier ?',
    questionEn: 'Which trigger fires at regular intervals?',
    questionAr: 'أي محفز يُطلق على فترات منتظمة؟',
    options: ['Webhook', 'Schedule/Cron', 'Manual', 'App'],
    optionsEn: ['Webhook', 'Schedule/Cron', 'Manual', 'App'],
    optionsAr: ['Webhook', 'Schedule/Cron', 'Manual', 'App'],
    correct: 1,
    explainFr: 'Schedule/Cron declenche le workflow a des intervalles definis.',
    explainEn: 'Schedule/Cron triggers the workflow at defined intervals.',
    explainAr: 'Schedule/Cron يُطلق سير العمل على فترات محددة.',
  },
  5: {
    questionFr: 'Quel node appelle une API REST ?',
    questionEn: 'Which node calls a REST API?',
    questionAr: 'أي node يستدعي REST API؟',
    options: ['Webhook', 'HTTP Request', 'Set', 'IF'],
    optionsEn: ['Webhook', 'HTTP Request', 'Set', 'IF'],
    optionsAr: ['Webhook', 'HTTP Request', 'Set', 'IF'],
    correct: 1,
    explainFr: 'Le node HTTP Request permet d\'appeler n\'importe quelle API REST.',
    explainEn: 'The HTTP Request node allows calling any REST API.',
    explainAr: 'node HTTP Request يسمح باستدعاء أي REST API.',
  },
  6: {
    questionFr: 'Comment acceder aux donnees d\'entree dans un Code node ?',
    questionEn: 'How to access input data in a Code node?',
    questionAr: 'كيف تصل لبيانات الإدخال في Code node؟',
    options: ['$input.all()', '$data.get()', '$json.read()', '$input.data'],
    optionsEn: ['$input.all()', '$data.get()', '$json.read()', '$input.data'],
    optionsAr: ['$input.all()', '$data.get()', '$json.read()', '$input.data'],
    correct: 0,
    explainFr: '$input.all() retourne tous les items d\'entree du node precedent.',
    explainEn: '$input.all() returns all input items from the previous node.',
    explainAr: '$input.all() ترجع جميع عناصر الإدخال من node السابق.',
  },
  7: {
    questionFr: 'Le node IF a combien de sorties ?',
    questionEn: 'How many outputs does the IF node have?',
    questionAr: 'كم مخرج لدى node IF؟',
    options: ['1', '2 (True/False)', '3', '4'],
    optionsEn: ['1', '2 (True/False)', '3', '4'],
    optionsAr: ['1', '2 (True/False)', '3', '4'],
    correct: 1,
    explainFr: 'Le node IF a 2 sorties : True et False.',
    explainEn: 'The IF node has 2 outputs: True and False.',
    explainAr: 'node IF لديه مخرجان: True وFalse.',
  },
  8: {
    questionFr: 'Combien d\'integrations natives dispose n8n ?',
    questionEn: 'How many native integrations does n8n have?',
    questionAr: 'كم تكامل أصلي لدى n8n؟',
    options: ['50+', '100+', '400+', '1000+'],
    optionsEn: ['50+', '100+', '400+', '1000+'],
    optionsAr: ['50+', '100+', '400+', '1000+'],
    correct: 2,
    explainFr: 'n8n dispose de plus de 400 integrations natives.',
    explainEn: 'n8n has 400+ native integrations.',
    explainAr: 'n8n لديه أكثر من 400 تكامل أصلي.',
  },
  9: {
    questionFr: 'Comment acceder a une variable d\'environnement dans n8n ?',
    questionEn: 'How to access an environment variable in n8n?',
    questionAr: 'كيف تصل لمتغير بيئة في n8n؟',
    options: ['{{ $env.MA_CLE }}', '{{ process.env.MA_CLE }}', '{{ env.get("MA_CLE") }}', '{{ $variables.MA_CLE }}'],
    optionsEn: ['{{ $env.MY_KEY }}', '{{ process.env.MY_KEY }}', '{{ env.get("MY_KEY") }}', '{{ $variables.MY_KEY }}'],
    optionsAr: ['{{ $env.MY_KEY }}', '{{ process.env.MY_KEY }}', '{{ env.get("MY_KEY") }}', '{{ $variables.MY_KEY }}'],
    correct: 0,
    explainFr: '{{ $env.MA_CLE }} accede aux variables d\'environnement dans n8n.',
    explainEn: '{{ $env.MY_KEY }} accesses environment variables in n8n.',
    explainAr: '{{ $env.MY_KEY }} تصل لمتغيرات البيئة في n8n.',
  },
  10: {
    questionFr: 'Dans un projet complet, quel est l\'ordre correct ?',
    questionEn: 'In a complete project, what is the correct order?',
    questionAr: 'في مشروع كامل، ما الترتيب الصحيح؟',
    options: ['Slack → Webhook → IF → Respond', 'Webhook → IF → HTTP Request → Code → Slack → Respond', 'Code → Slack → Webhook → IF', 'Respond → Webhook → IF → Slack'],
    optionsEn: ['Slack → Webhook → IF → Respond', 'Webhook → IF → HTTP Request → Code → Slack → Respond', 'Code → Slack → Webhook → IF', 'Respond → Webhook → IF → Slack'],
    optionsAr: ['Slack → Webhook → IF → Respond', 'Webhook → IF → HTTP Request → Code → Slack → Respond', 'Code → Slack → Webhook → IF', 'Respond → Webhook → IF → Slack'],
    correct: 1,
    explainFr: 'L\'ordre logique est : Trigger → Condition → Action → Transformation → Notification → Response.',
    explainEn: 'The logical order is: Trigger → Condition → Action → Transform → Notify → Response.',
    explainAr: 'الترتيب المنطقي: محفز → شرط → إجراء → تحويل → إشعار → رد.',
  },
};

// ── OpenClaw Quizzes ──
const openclawQuizzes: Record<number, QuizData> = {
  1: {
    questionFr: 'Que signifie "local-first" pour OpenClaw ?',
    questionEn: 'What does "local-first" mean for OpenClaw?',
    questionAr: 'ماذا يعني "local-first" لـ OpenClaw؟',
    options: ['Fonctionne sans internet', 'Vos donnees restent sur votre machine', 'N\'utilise pas d\'IA', 'Installe sur un serveur distant'],
    optionsEn: ['Works without internet', 'Your data stays on your machine', 'Doesn\'t use AI', 'Installed on a remote server'],
    optionsAr: ['يعمل بدون إنترنت', 'بياناتك تبقى على جهازك', 'لا يستخدم الذكاء الاصطناعي', 'مثبت على خادم بعيد'],
    correct: 1,
    explainFr: '"Local-first" signifie que vos donnees restent chez vous, pas dans le cloud.',
    explainEn: '"Local-first" means your data stays with you, not in the cloud.',
    explainAr: '"Local-first" يعني أن بياناتك تبقى عندك، وليس في السحابة.',
  },
  2: {
    questionFr: 'Quel est le pre-requis pour installer OpenClaw ?',
    questionEn: 'What is the prerequisite to install OpenClaw?',
    questionAr: 'ما المتطلب لتثبيت OpenClaw؟',
    options: ['Python 3.8+', 'Node.js 18+', 'Docker obligatoire', 'Windows uniquement'],
    optionsEn: ['Python 3.8+', 'Node.js 18+', 'Docker required', 'Windows only'],
    optionsAr: ['Python 3.8+', 'Node.js 18+', 'Docker مطلوب', 'Windows فقط'],
    correct: 1,
    explainFr: 'OpenClaw necessite Node.js 18 ou superieur.',
    explainEn: 'OpenClaw requires Node.js 18 or higher.',
    explainAr: 'OpenClaw يتطلب Node.js 18 أو أعلى.',
  },
  3: {
    questionFr: 'Quelle commande demarre une conversation avec OpenClaw ?',
    questionEn: 'Which command starts a conversation with OpenClaw?',
    questionAr: 'أي أمر يبدأ محادثة مع OpenClaw؟',
    options: ['openclaw start', 'openclaw chat', 'openclaw run', 'openclaw talk'],
    optionsEn: ['openclaw start', 'openclaw chat', 'openclaw run', 'openclaw talk'],
    optionsAr: ['openclaw start', 'openclaw chat', 'openclaw run', 'openclaw talk'],
    correct: 1,
    explainFr: 'openclaw chat demarre une conversation interactive.',
    explainEn: 'openclaw chat starts an interactive conversation.',
    explainAr: 'openclaw chat يبدأ محادثة تفاعلية.',
  },
  4: {
    questionFr: 'OpenClaw demande confirmation avant quelles actions ?',
    questionEn: 'OpenClaw asks confirmation before which actions?',
    questionAr: 'OpenClaw يطلب تأكيد قبل أي إجراءات؟',
    options: ['Lecture de fichiers', 'Actions destructrices (suppression, modification)', 'Affichage de texte', 'Recherche web'],
    optionsEn: ['Reading files', 'Destructive actions (delete, modify)', 'Displaying text', 'Web search'],
    optionsAr: ['قراءة الملفات', 'الإجراءات المدمرة (حذف، تعديل)', 'عرض النص', 'بحث الويب'],
    correct: 1,
    explainFr: 'OpenClaw demande confirmation avant les actions destructrices pour la securite.',
    explainEn: 'OpenClaw asks confirmation before destructive actions for safety.',
    explainAr: 'OpenClaw يطلب تأكيد قبل الإجراءات المدمرة للأمان.',
  },
  5: {
    questionFr: 'Quelle commande liste un repertoire avec OpenClaw ?',
    questionEn: 'Which command lists a directory with OpenClaw?',
    questionAr: 'أي أمر يسرد مجلد مع OpenClaw؟',
    options: ['openclaw file read', 'openclaw file list', 'openclaw file write', 'openclaw file search'],
    optionsEn: ['openclaw file read', 'openclaw file list', 'openclaw file write', 'openclaw file search'],
    optionsAr: ['openclaw file read', 'openclaw file list', 'openclaw file write', 'openclaw file search'],
    correct: 1,
    explainFr: 'openclaw file list affiche le contenu d\'un repertoire.',
    explainEn: 'openclaw file list displays directory contents.',
    explainAr: 'openclaw file list يعرض محتويات المجلد.',
  },
  6: {
    questionFr: 'Comment installer un plugin OpenClaw ?',
    questionEn: 'How to install an OpenClaw plugin?',
    questionAr: 'كيف تثبت إضافة OpenClaw؟',
    options: ['openclaw plugin install nom', 'npm install openclaw-nom', 'openclaw add nom', 'openclaw plugin add nom'],
    optionsEn: ['openclaw plugin install name', 'npm install openclaw-name', 'openclaw add name', 'openclaw plugin add name'],
    optionsAr: ['openclaw plugin install name', 'npm install openclaw-name', 'openclaw add name', 'openclaw plugin add name'],
    correct: 0,
    explainFr: 'openclaw plugin install nom-du-plugin installe une extension.',
    explainEn: 'openclaw plugin install plugin-name installs an extension.',
    explainAr: 'openclaw plugin install plugin-name يثبت إضافة.',
  },
  7: {
    questionFr: 'Quel modele local est supporte par OpenClaw ?',
    questionEn: 'Which local model is supported by OpenClaw?',
    questionAr: 'أي نموذج محلي مدعوم من OpenClaw؟',
    options: ['GPT-4', 'Ollama/llama3', 'Gemini', 'Claude'],
    optionsEn: ['GPT-4', 'Ollama/llama3', 'Gemini', 'Claude'],
    optionsAr: ['GPT-4', 'Ollama/llama3', 'Gemini', 'Claude'],
    correct: 1,
    explainFr: 'Ollama avec llama3 est un modele local supporte. GPT-4, Gemini et Claude sont cloud.',
    explainEn: 'Ollama with llama3 is a supported local model. GPT-4, Gemini and Claude are cloud.',
    explainAr: 'Ollama مع llama3 نموذج محلي مدعوم. GPT-4 وGemini وClaude سحابية.',
  },
  8: {
    questionFr: 'Dans le projet assistant personnel, quelle est la premiere etape ?',
    questionEn: 'In the personal assistant project, what is the first step?',
    questionAr: 'في مشروع المساعد الشخصي، ما الخطوة الأولى؟',
    options: ['Envoyer un recap Slack', 'Lire les emails non lus', 'Planifier le cron', 'Generer la liste de taches'],
    optionsEn: ['Send Slack recap', 'Read unread emails', 'Schedule cron', 'Generate task list'],
    optionsAr: ['إرسال ملخص Slack', 'قراءة الرسائل غير المقروءة', 'جدولة cron', 'إنشاء قائمة المهام'],
    correct: 1,
    explainFr: 'La premiere etape est de lire les emails non lus chaque matin.',
    explainEn: 'The first step is to read unread emails every morning.',
    explainAr: 'الخطوة الأولى هي قراءة الرسائل غير المقروءة كل صباح.',
  },
  9: {
    questionFr: 'Quelle commande verifie les logs des 24 dernieres heures ?',
    questionEn: 'Which command checks the last 24 hours of logs?',
    questionAr: 'أي أمر يتحقق من سجلات آخر 24 ساعة؟',
    options: ['openclaw status', 'openclaw logs --last 24h', 'openclaw audit', 'openclaw history'],
    optionsEn: ['openclaw status', 'openclaw logs --last 24h', 'openclaw audit', 'openclaw history'],
    optionsAr: ['openclaw status', 'openclaw logs --last 24h', 'openclaw audit', 'openclaw history'],
    correct: 1,
    explainFr: 'openclaw logs --last 24h affiche les logs des dernieres 24 heures.',
    explainEn: 'openclaw logs --last 24h shows the last 24 hours of logs.',
    explainAr: 'openclaw logs --last 24h يعرض سجلات آخر 24 ساعة.',
  },
  10: {
    questionFr: 'Dans le projet final, que se passe-t-il si tous les tests passent ?',
    questionEn: 'In the final project, what happens if all tests pass?',
    questionAr: 'في المشروع النهائي، ماذا يحدث إذا نجحت جميع الاختبارات؟',
    options: ['Notification Slack uniquement', 'Deploiement automatique', 'Arret du workflow', 'Envoi d\'email'],
    optionsEn: ['Slack notification only', 'Automatic deployment', 'Workflow stops', 'Send email'],
    optionsAr: ['إشعار Slack فقط', 'نشر تلقائي', 'توقف سير العمل', 'إرسال بريد'],
    correct: 1,
    explainFr: 'Si tous les tests passent, le deploiement est automatique.',
    explainEn: 'If all tests pass, deployment is automatic.',
    explainAr: 'إذا نجحت جميع الاختبارات، النشر تلقائي.',
  },
};

// ── Main ──
async function main() {
  console.log('=== Seeding Quiz Data ===\n');

  const courseQuizzes: Record<string, Record<number, QuizData>> = {
    php: phpQuizzes,
    python: pythonQuizzes,
    n8n: n8nQuizzes,
    openclaw: openclawQuizzes,
  };

  let totalUpdated = 0;

  for (const [slug, quizzes] of Object.entries(courseQuizzes)) {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) {
      console.log(`  ⚠ Course "${slug}" not found`);
      continue;
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
    });

    for (const lesson of lessons) {
      const quiz = quizzes[lesson.order];
      if (!quiz) continue;

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          quizQuestionFr: quiz.questionFr,
          quizQuestionEn: quiz.questionEn,
          quizQuestionAr: quiz.questionAr,
          quizOption1Fr: quiz.options[0],
          quizOption1En: quiz.optionsEn[0],
          quizOption1Ar: quiz.optionsAr[0],
          quizOption2Fr: quiz.options[1],
          quizOption2En: quiz.optionsEn[1],
          quizOption2Ar: quiz.optionsAr[1],
          quizOption3Fr: quiz.options[2],
          quizOption3En: quiz.optionsEn[2],
          quizOption3Ar: quiz.optionsAr[2],
          quizOption4Fr: quiz.options[3],
          quizOption4En: quiz.optionsEn[3],
          quizOption4Ar: quiz.optionsAr[3],
          quizCorrect: quiz.correct,
          quizExplainFr: quiz.explainFr,
          quizExplainEn: quiz.explainEn,
          quizExplainAr: quiz.explainAr,
        },
      });
      totalUpdated++;
    }

    console.log(`  ✓ ${slug}: ${Object.keys(quizzes).length} quizzes`);
  }

  console.log(`\nUpdated ${totalUpdated} lessons with quiz data!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
