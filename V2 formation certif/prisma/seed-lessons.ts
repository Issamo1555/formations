/**
 * Seed script: Extract lesson content from existing HTML course files
 * and populate the SQLite database.
 * 
 * Usage: npx tsx prisma/seed-lessons.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ── Helper: strip HTML tags for plain text ──
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Helper: extract code blocks from HTML ──
function extractCode(html: string): string {
  // Extract text content, keeping code structure
  return html
    .replace(/<span class="cmt">/g, '// ')
    .replace(/<span class="kw">/g, '')
    .replace(/<span class="str">/g, '"')
    .replace(/<span class="num">/g, '')
    .replace(/<span class="fn">/g, '')
    .replace(/<span class="var">/g, '')
    .replace(/<\/span>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\\n/g, '\n')
    .trim();
}

// ── PHP Course Lessons (extracted from apprendre-php-app.html) ──
const phpLessons = [
  {
    order: 1,
    titleFr: "C'est quoi PHP ?",
    titleEn: "What is PHP?",
    titleAr: "ما هو PHP؟",
    contentFr: `PHP (Hypertext Preprocessor) est un langage de script cote serveur. Cree par Rasmus Lerdorf en 1993, il est aujourd'hui l'un des langages les plus utilises pour le developpement web dynamique.

### Pourquoi PHP ?
- Gratuit et open source
- Facile a apprendre pour les debutants
- Compatible avec tous les hebergeurs web
- Immense communaute et documentation
- Utilise par WordPress, Facebook, Wikipedia

### Comment ca marche ?
Le navigateur envoie une requete au serveur → PHP traite le fichier .php → Le serveur renvoie du HTML au navigateur. L'utilisateur ne voit jamais le code PHP.`,
    contentEn: `PHP (Hypertext Preprocessor) is a server-side scripting language. Created by Rasmus Lerdorf in 1993, it is one of the most widely used languages for dynamic web development.

### Why PHP?
- Free and open source
- Easy to learn for beginners
- Compatible with all web hosts
- Huge community and documentation
- Used by WordPress, Facebook, Wikipedia

### How does it work?
Browser sends request to server → PHP processes the .php file → Server returns HTML to browser. The user never sees the PHP code.`,
    contentAr: `PHP (Hypertext Preprocessor) هي لغة برمجة نصية من جانب الخادم. أنشأها Rasmus Lerdorf عام 1993، وهي من أكثر اللغات استخداماً في تطوير الويب الديناميكي.

### لماذا PHP؟
- مجانية ومفتوحة المصدر
- سهلة التعلم للمبتدئين
- متوافقة مع جميع استضافات الويب
- مجتمع ضخم وتوثيق شامل
- تستخدمها WordPress وFacebook وWikipedia`,
    category: 'Introduction',
    hasQuiz: true,
  },
  {
    order: 2,
    titleFr: 'Les Commentaires',
    titleEn: 'Comments',
    titleAr: 'التعليقات',
    contentFr: `Les commentaires permettent d'annoter votre code sans affecter son execution.

### 3 styles de commentaires
- \`//\` — commentaire sur une seule ligne (style C++)
- \`#\` — commentaire sur une seule ligne (style shell)
- \`/* ... */\` — commentaire sur plusieurs lignes

### Bonnes pratiques
- Commentez le pourquoi, pas le quoi
- Utilisez les blocs \`/* */\` pour documenter les fonctions
- Evitez les commentaires evidents
- PHPDoc (\`/** */\`) genere de la documentation automatique`,
    contentEn: `Comments allow you to annotate your code without affecting execution.

### 3 comment styles
- \`//\` — single line comment (C++ style)
- \`#\` — single line comment (shell style)
- \`/* ... */\` — multi-line comment

### Best practices
- Comment the why, not the what
- Use \`/* */\` blocks to document functions
- Avoid obvious comments
- PHPDoc (\`/** */\`) generates automatic documentation`,
    contentAr: `التعليقات تسمح لك بإضافة ملاحظات للكود دون التأثير على التنفيذ.

### 3 أنماط للتعليقات
- \`//\` — تعليق في سطر واحد
- \`#\` — تعليق في سطر واحد
- \`/* ... */\` — تعليق متعدد الأسطر`,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 3,
    titleFr: 'Les Constantes',
    titleEn: 'Constants',
    titleAr: 'الثوابت',
    contentFr: `Une constante est un identifiant dont la valeur ne change pas pendant l'execution du script.

### Definir une constante
- \`define("NOM", valeur)\` — methode traditionnelle
- \`const NOM = valeur\` — syntaxe moderne

### Conventions
- Par convention, les constantes sont en MAJUSCULES
- Accessibles partout (portee globale)
- Ne peuvent pas etre modifiees ni supprimees

### Constantes predefinies
- \`PHP_VERSION\` — version de PHP
- \`PHP_INT_MAX\` — valeur entiere maximale
- \`M_PI\` — valeur de π
- \`__FILE__\`, \`__LINE__\`, \`__DIR__\` — constantes magiques`,
    contentEn: `A constant is an identifier whose value does not change during script execution.

### Define a constant
- \`define("NAME", value)\` — traditional method
- \`const NAME = value\` — modern syntax

### Conventions
- By convention, constants are UPPERCASE
- Accessible everywhere (global scope)
- Cannot be modified or deleted

### Predefined constants
- \`PHP_VERSION\` — PHP version
- \`PHP_INT_MAX\` — maximum integer value
- \`M_PI\` — value of π
- \`__FILE__\`, \`__LINE__\`, \`__DIR__\` — magic constants`,
    contentAr: `الثابت هو معرف لا تتغير قيمته أثناء تنفيذ السكريبت.

### تعريف ثابت
- \`define("NAME", value)\` — الطريقة التقليدية
- \`const NAME = value\` — الصيغة الحديثة

### الاتفاقيات
- بالعادة تكون الثوابت بأحرف كبيرة
- متاحة في كل مكان
- لا يمكن تعديلها أو حذفها`,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 4,
    titleFr: 'Les Variables',
    titleEn: 'Variables',
    titleAr: 'المتغيرات',
    contentFr: `En PHP, une variable commence toujours par le signe \$.

### Regles de nommage
- Commence toujours par \$
- Sensible a la casse : \$age ≠ \$Age
- Commence par une lettre ou underscore

### Types de donnees
- **string** — chaine de caracteres
- **int** — nombre entier
- **float** — nombre decimal
- **bool** — true ou false
- **null** — aucune valeur

### Portee des variables
- **Locale** — existe uniquement dans la fonction
- **Globale** — declaree hors fonction, accessible avec \`global \$var\`
- **Statique** — conserve sa valeur entre les appels (\`static \$x\`)`,
    contentEn: `In PHP, a variable always starts with the \$ sign.

### Naming rules
- Always starts with \$
- Case sensitive: \$age ≠ \$Age
- Starts with a letter or underscore

### Data types
- **string** — text
- **int** — integer
- **float** — decimal number
- **bool** — true or false
- **null** — no value

### Variable scope
- **Local** — exists only within the function
- **Global** — declared outside function, accessible with \`global \$var\`
- **Static** — retains value between calls (\`static \$x\`)`,
    contentAr: `في PHP، المتغير يبدأ دائماً بعلامة \$.

### قواعد التسمية
- يبدأ دائماً بـ \$
- حساس لحالة الأحرف
- يبدأ بحرف أو شرطة سفلية

### أنواع البيانات
- **string** — نص
- **int** — عدد صحيح
- **float** — عدد عشري
- **bool** — صحيح أو خطأ
- **null** — بدون قيمة`,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 5,
    titleFr: 'Les Tableaux (Arrays)',
    titleEn: 'Arrays',
    titleAr: 'المصفوفات',
    contentFr: `Un tableau (array) permet de stocker plusieurs valeurs sous un seul identifiant.

### Types de tableaux
- **Indexe** — cles numeriques automatiques (0, 1, 2...)
- **Associatif** — cles textuelles personnalisees
- **Multidimensionnel** — tableaux imbriques

### Fonctions indispensables
- \`count()\` — nombre d'elements
- \`array_push()\` — ajouter a la fin
- \`array_pop()\` — supprimer le dernier
- \`array_merge()\` — fusionner deux tableaux
- \`in_array()\` — verifier si une valeur existe
- \`sort()\` / \`rsort()\` — trier
- \`array_map()\` — appliquer une fonction
- \`array_filter()\` — filtrer`,
    contentEn: `An array allows storing multiple values under a single identifier.

### Array types
- **Indexed** — automatic numeric keys (0, 1, 2...)
- **Associative** — custom text keys
- **Multidimensional** — nested arrays

### Essential functions
- \`count()\` — number of elements
- \`array_push()\` — add to end
- \`array_pop()\` — remove last
- \`array_merge()\` — merge two arrays
- \`in_array()\` — check if value exists
- \`sort()\` / \`rsort()\` — sort
- \`array_map()\` — apply function
- \`array_filter()\` — filter`,
    contentAr: `المصفوفة تسمح بتخزين عدة قيم تحت معرف واحد.

### أنواع المصفوفات
- **مفهرسة** — مفاتيح رقمية تلقائية
- **ترابطية** — مفاتيح نصية مخصصة
- **متعددة الأبعاد** — مصفوفات متداخلة

### الدوال الأساسية
- \`count()\` — عدد العناصر
- \`array_push()\` — إضافة في النهاية
- \`array_pop()\` — حذف الأخير
- \`array_merge()\` — دمج مصفوفتين`,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 6,
    titleFr: 'Les Operateurs',
    titleEn: 'Operators',
    titleAr: 'المعاملات',
    contentFr: `Les operateurs permettent d'effectuer des operations sur des valeurs.

### Operateurs arithmetiques
- \`+\` addition, \`-\` soustraction, \`*\` multiplication
- \`/\` division, \`%\` modulo, \`**\` puissance

### Operateurs de comparaison
- \`==\` egal (valeur), \`===\` identique (valeur + type)
- \`!=\` different, \`!==\` non identique
- \`<\`, \`>\`, \`<=\`, \`>=\`
- \`<=>\` spaceship (retourne -1, 0 ou 1)

### Operateurs logiques
- \`&&\` / \`and\` — ET logique
- \`||\` / \`or\` — OU logique
- \`!\` — NON logique

### Null coalescing (PHP 7+)
- \`??\` — retourne la valeur si existe, sinon la valeur par defaut`,
    contentEn: `Operators allow performing operations on values.

### Arithmetic operators
- \`+\` addition, \`-\` subtraction, \`*\` multiplication
- \`/\` division, \`%\` modulo, \`**\` power

### Comparison operators
- \`==\` equal (value), \`===\` identical (value + type)
- \`!=\` not equal, \`!==\` not identical
- \`<\`, \`>\`, \`<=\`, \`>=\`
- \`<=>\` spaceship (returns -1, 0 or 1)

### Logical operators
- \`&&\` / \`and\` — AND
- \`||\` / \`or\` — OR
- \`!\` — NOT

### Null coalescing (PHP 7+)
- \`??\` — returns value if exists, otherwise default`,
    contentAr: `المعاملات تسمح بإجراء عمليات على القيم.

### المعاملات الحسابية
- \`+\` جمع، \`-\` طرح، \`*\` ضرب
- \`/\` قسمة، \`%\` باقي القسمة

### معاملات المقارنة
- \`==\` يساوي (قيمة)، \`===\` مطابق (قيمة + نوع)
- \`!=\` مختلف، \`!==\` غير مطابق

### المعاملات المنطقية
- \`&&\` / \`and\` — AND
- \`||\` / \`or\` — OR
- \`!\` — NOT`,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 7,
    titleFr: 'Conditions & Switch',
    titleEn: 'Conditions & Switch',
    titleAr: 'الشروط والتبديل',
    contentFr: `Les structures conditionnelles permettent d'executer du code different selon une condition.

### if / elseif / else
\`\`\`php
if (\$age >= 18) {
    echo "Majeur";
} elseif (\$age >= 16) {
    echo "Bientot majeur !";
} else {
    echo "Mineur";
}
\`\`\`

### Operateur ternaire
\`\`\`php
\$statut = (\$age >= 18) ? "majeur" : "mineur";
\`\`\`

### Switch
\`\`\`php
switch (\$jour) {
    case "lundi": echo "Debut"; break;
    case "vendredi": echo "Fin"; break;
    default: echo "Milieu";
}
\`\`\`

### Match (PHP 8+)
\`\`\`php
\$result = match (\$jour) {
    "lundi" => "Debut",
    "vendredi" => "Fin",
    default => "Milieu",
};
\`\`\``,
    contentEn: `Conditional structures allow executing different code based on a condition.

### if / elseif / else
\`\`\`php
if (\$age >= 18) {
    echo "Adult";
} elseif (\$age >= 16) {
    echo "Almost adult!";
} else {
    echo "Minor";
}
\`\`\`

### Ternary operator
\`\`\`php
\$status = (\$age >= 18) ? "adult" : "minor";
\`\`\`

### Switch
\`\`\`php
switch (\$day) {
    case "monday": echo "Start"; break;
    case "friday": echo "End"; break;
    default: echo "Middle";
}
\`\`\`

### Match (PHP 8+)
\`\`\`php
\$result = match (\$day) {
    "monday" => "Start",
    "friday" => "End",
    default => "Middle",
};
\`\`\``,
    contentAr: `الهياكل الشرطية تسمح بتنفيذ كود مختلف حسب الشرط.

### if / elseif / else
\`\`\`php
if (\$age >= 18) {
    echo "بالغ";
} else {
    echo "قاصر";
}
\`\`\`

### المعامل الثلاثي
\`\`\`php
\$status = (\$age >= 18) ? "بالغ" : "قاصر";
\`\`\``,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 8,
    titleFr: 'Les Boucles',
    titleEn: 'Loops',
    titleAr: 'الحلقات',
    contentFr: `Les boucles permettent de repeter des instructions.

### for — quand on connait le nombre d'iterations
\`\`\`php
for (\$i = 1; \$i <= 5; \$i++) {
    echo "Iteration " . \$i;
}
\`\`\`

### while — tant qu'une condition est vraie
\`\`\`php
\$x = 0;
while (\$x < 3) {
    echo \$x;
    \$x++;
}
\`\`\`

### do...while — execute au moins une fois
\`\`\`php
do {
    echo \$x;
    \$x++;
} while (\$x < 3);
\`\`\`

### foreach — pour parcourir un tableau
\`\`\`php
\$fruits = ["pomme", "banane", "cerise"];
foreach (\$fruits as \$fruit) {
    echo \$fruit;
}
\`\`\``,
    contentEn: `Loops allow repeating instructions.

### for — when you know the number of iterations
\`\`\`php
for (\$i = 1; \$i <= 5; \$i++) {
    echo "Iteration " . \$i;
}
\`\`\`

### while — as long as a condition is true
\`\`\`php
\$x = 0;
while (\$x < 3) {
    echo \$x;
    \$x++;
}
\`\`\`

### do...while — executes at least once
\`\`\`php
do {
    echo \$x;
    \$x++;
} while (\$x < 3);
\`\`\`

### foreach — to iterate over an array
\`\`\`php
\$fruits = ["apple", "banana", "cherry"];
foreach (\$fruits as \$fruit) {
    echo \$fruit;
}
\`\`\``,
    contentAr: `الحلقات تسمح بتكرار التعليمات.

### for — عندما تعرف عدد التكرارات
\`\`\`php
for (\$i = 1; \$i <= 5; \$i++) {
    echo "تكرار " . \$i;
}
\`\`\`

### while — طالما الشرط صحيح
\`\`\`php
\$x = 0;
while (\$x < 3) {
    echo \$x;
    \$x++;
}
\`\`\`

### foreach — لتكرار على مصفوفة
\`\`\`php
\$fruits = ["تفاح", "موز", "كرز"];
foreach (\$fruits as \$fruit) {
    echo \$fruit;
}
\`\`\``,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 9,
    titleFr: 'Formulaires \$_GET/\$_POST',
    titleEn: 'Forms \$_GET/\$_POST',
    titleAr: 'النماذج \$_GET/\$_POST',
    contentFr: `PHP peut recuperer les donnees envoyees par les formulaires HTML.

### \$_GET vs \$_POST
- **\$_GET** — donnees dans l'URL. Visibles, limitees. Pour la recherche.
- **\$_POST** — donnees dans le corps de la requete. Invisibles. Pour login, formulaires.

### Securite obligatoire
- \`htmlspecialchars()\` — echappe les caracteres HTML (contre XSS)
- \`strip_tags()\` — supprime les balises HTML
- \`trim()\` — supprime les espaces
- \`isset()\` — verifie si la variable existe

### Superglobales PHP
- \`\$_GET\`, \`\$_POST\`, \`\$_REQUEST\`
- \`\$_FILES\` — upload de fichiers
- \`\$_SERVER\` — infos du serveur`,
    contentEn: `PHP can retrieve data sent by HTML forms.

### \$_GET vs \$_POST
- **\$_GET** — data in URL. Visible, limited. For search.
- **\$_POST** — data in request body. Invisible. For login, forms.

### Mandatory security
- \`htmlspecialchars()\` — escapes HTML characters (against XSS)
- \`strip_tags()\` — removes HTML tags
- \`trim()\` — removes whitespace
- \`isset()\` — checks if variable exists

### PHP Superglobals
- \`\$_GET\`, \`\$_POST\`, \`\$_REQUEST\`
- \`\$_FILES\` — file uploads
- \`\$_SERVER\` — server info`,
    contentAr: `PHP يمكنه استرداد البيانات المرسلة من نماذج HTML.

### \$_GET مقابل \$_POST
- **\$_GET** — بيانات في URL. مرئية ومحدودة. للبحث.
- **\$_POST** — بيانات في جسم الطلب. غير مرئية. لتسجيل الدخول والنماذج.

### الأمان الإلزامي
- \`htmlspecialchars()\` — يهرب أحرف HTML
- \`strip_tags()\` — يحذف وسوم HTML
- \`trim()\` — يحذف المسافات
- \`isset()\` — يتحقق من وجود المتغير`,
    category: 'Web avec PHP',
    hasQuiz: true,
  },
  {
    order: 10,
    titleFr: 'Les Cookies',
    titleEn: 'Cookies',
    titleAr: 'ملفات تعريف الارتباط',
    contentFr: `Un cookie est un petit fichier texte stocke sur le navigateur de l'utilisateur.

### Creer un cookie : setcookie()
- \`setcookie(nom, valeur, expiration)\`
- Doit etre appele AVANT tout affichage HTML
- L'expiration est un timestamp Unix

### Parametres de setcookie()
- **name** — nom du cookie
- **value** — valeur stockee
- **expires** — duree de vie (0 = fermeture navigateur)
- **path** — chemin de validite (\`/\` = tout le site)
- **secure** — HTTPS uniquement
- **httponly** — inaccessible en JavaScript

### Lire et supprimer
- Lire : \`\$_COOKIE["nom"]\`
- Supprimer : \`setcookie("nom", "", time()-3600)\``,
    contentEn: `A cookie is a small text file stored on the user's browser.

### Create a cookie: setcookie()
- \`setcookie(name, value, expiration)\`
- Must be called BEFORE any HTML output
- Expiration is a Unix timestamp

### setcookie() parameters
- **name** — cookie name
- **value** — stored value
- **expires** — lifetime (0 = browser close)
- **path** — validity path (\`/\` = entire site)
- **secure** — HTTPS only
- **httponly** — inaccessible via JavaScript

### Read and delete
- Read: \`\$_COOKIE["name"]\`
- Delete: \`setcookie("name", "", time()-3600)\``,
    contentAr: `ملف تعريف الارتباط هو ملف نصي صغير يُخزن في متصفح المستخدم.

### إنشاء ملف تعريف الارتباط: setcookie()
- \`setcookie(name, value, expiration)\`
- يجب استدعاؤه قبل أي إخراج HTML
- الانتهاء هو طابع زمني Unix

### قراءة وحذف
- قراءة: \`\$_COOKIE["name"]\`
- حذف: \`setcookie("name", "", time()-3600)\``,
    category: 'Web avec PHP',
    hasQuiz: true,
  },
  {
    order: 11,
    titleFr: 'Les Sessions',
    titleEn: 'Sessions',
    titleAr: 'الجلسات',
    contentFr: `Une session permet de conserver des donnees d'un utilisateur entre plusieurs pages. Les donnees sont stockees cote serveur.

### Fonctions essentielles
- \`session_start()\` — demarre/reprend la session (toujours en premier !)
- \`\$_SESSION["cle"] = valeur\` — stocker une donnee
- \`\$_SESSION["cle"]\` — lire une donnee
- \`unset(\$_SESSION["cle"])\` — supprimer une variable
- \`session_destroy()\` — detruire toute la session (deconnexion)

### Sessions vs Cookies
- **Sessions** — stockees serveur, plus securisees, expirent a la fermeture
- **Cookies** — stockes client, persistent plus longtemps, limites a 4Ko`,
    contentEn: `A session allows preserving user data across multiple pages. Data is stored server-side.

### Essential functions
- \`session_start()\` — starts/resumes session (always first!)
- \`\$_SESSION["key"] = value\` — store data
- \`\$_SESSION["key"]\` — read data
- \`unset(\$_SESSION["key"])\` — delete variable
- \`session_destroy()\` — destroy entire session (logout)

### Sessions vs Cookies
- **Sessions** — stored server-side, more secure, expire on close
- **Cookies** — stored client-side, persist longer, limited to 4KB`,
    contentAr: `الجلسة تسمح بحفظ بيانات المستخدم عبر صفحات متعددة. البيانات تُخزن على الخادم.

### الدوال الأساسية
- \`session_start()\` — تبدأ/تستأنف الجلسة (دائماً أولاً!)
- \`\$_SESSION["key"] = value\` — تخزين البيانات
- \`\$_SESSION["key"]\` — قراءة البيانات
- \`unset(\$_SESSION["key"])\` — حذف متغير
- \`session_destroy()\` — تدمير الجلسة كاملة (تسجيل خروج)`,
    category: 'Web avec PHP',
    hasQuiz: true,
  },
  {
    order: 12,
    titleFr: 'Classes & Objets (POO)',
    titleEn: 'Classes & Objects (OOP)',
    titleAr: 'الفئات والكائنات (OOP)',
    contentFr: `La Programmation Orientee Objet (POO) organise le code autour d'objets.

### Concepts cles
- **Classe** — le plan/modele de l'objet
- **Objet** — instance d'une classe
- **Propriete** — variable d'un objet
- **Methode** — fonction d'un objet
- **__construct()** — constructeur, appele a l'instanciation
- **\$this** — reference a l'objet courant

### Exemple
\`\`\`php
class Animal {
    public \$nom;
    private \$age;

    public function __construct(\$nom, \$age) {
        \$this->nom = \$nom;
        \$this->age = \$age;
    }

    public function presenter() {
        return "Je suis " . \$this->nom;
    }
}

\$chat = new Animal("Minou", 3);
echo \$chat->presenter();
\`\`\``,
    contentEn: `Object-Oriented Programming (OOP) organizes code around objects.

### Key concepts
- **Class** — the blueprint/model of the object
- **Object** — instance of a class
- **Property** — variable of an object
- **Method** — function of an object
- **__construct()** — constructor, called on instantiation
- **\$this** — reference to the current object

### Example
\`\`\`php
class Animal {
    public \$name;
    private \$age;

    public function __construct(\$name, \$age) {
        \$this->name = \$name;
        \$this->age = \$age;
    }

    public function introduce() {
        return "I am " . \$this->name;
    }
}

\$cat = new Animal("Whiskers", 3);
echo \$cat->introduce();
\`\`\``,
    contentAr: `البرمجة كائنية التوجه (OOP) تنظم الكود حول الكائنات.

### المفاهيم الأساسية
- **الفئة (Class)** — المخطط/النموذج للكائن
- **الكائن (Object)** — نسخة من الفئة
- **الخاصية (Property)** — متغير الكائن
- **الدالة (Method)** — دالة الكائن
- **__construct()** — الباني، يُستدعى عند الإنشاء
- **\$this** — مرجع للكائن الحالي`,
    category: 'POO',
    hasQuiz: true,
  },
];

// ── Python Course Lessons (extracted from apprendre-python-app.html) ──
const pythonLessons = [
  {
    order: 1,
    titleFr: "C'est quoi Python ?",
    titleEn: "What is Python?",
    titleAr: "ما هو Python؟",
    contentFr: `Python est un langage de programmation polyvalent, lisible et puissant. Cree par Guido van Rossum en 1991, il est aujourd'hui l'un des langages les plus populaires au monde.

### Pourquoi Python ?
- Syntaxe simple et lisible
- Utilise en IA, data science, web, automatisation
- Grande communaute et ecosysteme de librairies
- Multi-paradigme : procedural, objet, fonctionnel
- Interprete et multi-plateforme

### Ou est utilise Python ?
- Google, YouTube, Instagram, Spotify, Dropbox
- Intelligence artificielle (TensorFlow, PyTorch)
- Analyse de donnees (Pandas, NumPy)
- Developpement web (Django, Flask)
- Scripting et automatisation`,
    contentEn: `Python is a versatile, readable, and powerful programming language. Created by Guido van Rossum in 1991, it is one of the most popular languages in the world.

### Why Python?
- Simple and readable syntax
- Used in AI, data science, web, automation
- Large community and library ecosystem
- Multi-paradigm: procedural, object-oriented, functional
- Interpreted and cross-platform

### Where is Python used?
- Google, YouTube, Instagram, Spotify, Dropbox
- Artificial Intelligence (TensorFlow, PyTorch)
- Data analysis (Pandas, NumPy)
- Web development (Django, Flask)
- Scripting and automation`,
    contentAr: `Python هي لغة برمجة متعددة الاستخدامات وقوية وسهلة القراءة. أنشأها Guido van Rossum عام 1991.

### لماذا Python؟
- صيغة بسيطة وسهلة القراءة
- تُستخدم في الذكاء الاصطناعي وعلم البيانات
- مجتمع كبير ونظام مكتبات ضخم
- متعددة الأنماط
- مفسرة ومتعددة المنصات`,
    category: 'Introduction',
    hasQuiz: true,
  },
  {
    order: 2,
    titleFr: 'Variables et Types',
    titleEn: 'Variables and Types',
    titleAr: 'المتغيرات والأنواع',
    contentFr: `Python est dynamiquement type — pas besoin de declarer le type.

### Types de bases
- **str** — chaine de caracteres : \`"hello"\`
- **int** — nombre entier : \`42\`
- **float** — nombre decimal : \`3.14\`
- **bool** — booleen : \`True\`, \`False\`
- **list** — liste : \`[1, 2, 3]\`
- **dict** — dictionnaire : \`{"nom": "Alice"}\`
- **None** — absence de valeur

### Variables
\`\`\`python
nom = "Alice"
age = 25
taille = 1.68
est_etudiant = True
notes = [15, 18, 12]
\`\`\`

### Verification de type
\`\`\`python
type(nom)    # <class 'str'>
isinstance(age, int)  # True
\`\`\``,
    contentEn: `Python is dynamically typed — no need to declare the type.

### Basic types
- **str** — string: \`"hello"\`
- **int** — integer: \`42\`
- **float** — decimal: \`3.14\`
- **bool** — boolean: \`True\`, \`False\`
- **list** — list: \`[1, 2, 3]\`
- **dict** — dictionary: \`{"name": "Alice"}\`
- **None** — absence of value

### Variables
\`\`\`python
name = "Alice"
age = 25
height = 1.68
is_student = True
grades = [15, 18, 12]
\`\`\``,
    contentAr: `Python ذات typing ديناميكي — لا حاجة لتعريف النوع.

### الأنواع الأساسية
- **str** — نص
- **int** — عدد صحيح
- **float** — عدد عشري
- **bool** — منطقي
- **list** — قائمة
- **dict** — قاموس
- **None** — بدون قيمة`,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 3,
    titleFr: 'Conditions',
    titleEn: 'Conditions',
    titleAr: 'الشروط',
    contentFr: `Les structures conditionnelles en Python utilisent l'indentation.

### if / elif / else
\`\`\`python
age = 17
if age >= 18:
    print("Majeur")
elif age >= 16:
    print("Bientot majeur")
else:
    print("Mineur")
\`\`\`

### Operateurs de comparaison
- \`==\` egal, \`!=\` different
- \`<\`, \`>\`, \`<=\`, \`>=\`
- \`is\` identite, \`in\` appartenance

### Operateurs logiques
- \`and\`, \`or\`, \`not\`

### Ternaire
\`\`\`python
statut = "majeur" if age >= 18 else "mineur"
\`\`\``,
    contentEn: `Conditional structures in Python use indentation.

### if / elif / else
\`\`\`python
age = 17
if age >= 18:
    print("Adult")
elif age >= 16:
    print("Almost adult")
else:
    print("Minor")
\`\`\`

### Comparison operators
- \`==\` equal, \`!=\` not equal
- \`<\`, \`>\`, \`<=\`, \`>=\`
- \`is\` identity, \`in\` membership

### Logical operators
- \`and\`, \`or\`, \`not\`

### Ternary
\`\`\`python
status = "adult" if age >= 18 else "minor"
\`\`\``,
    contentAr: `الهياكل الشرطية في Python تستخدم المسافات البادئة.

### if / elif / else
\`\`\`python
age = 17
if age >= 18:
    print("بالغ")
else:
    print("قاصر")
\`\`\``,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 4,
    titleFr: 'Les Boucles',
    titleEn: 'Loops',
    titleAr: 'الحلقات',
    contentFr: `Python propose \`for\` et \`while\` pour les boucles.

### for — parcourir une sequence
\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

fruits = ["pomme", "banane", "cerise"]
for fruit in fruits:
    print(fruit)
\`\`\`

### while — tant que condition vraie
\`\`\`python
x = 0
while x < 5:
    print(x)
    x += 1
\`\`\`

### break et continue
\`\`\`python
for i in range(10):
    if i == 3:
        continue  # saute 3
    if i == 7:
        break     # arrete a 7
    print(i)
\`\`\``,
    contentEn: `Python offers \`for\` and \`while\` for loops.

### for — iterate over a sequence
\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
\`\`\`

### while — as long as condition is true
\`\`\`python
x = 0
while x < 5:
    print(x)
    x += 1
\`\`\``,
    contentAr: `Python تقدم \`for\` و\`while\` للحلقات.

### for — تكرار على تسلسل
\`\`\`python
for i in range(5):
    print(i)
\`\`\`

### while — طالما الشرط صحيح
\`\`\`python
x = 0
while x < 5:
    print(x)
    x += 1
\`\`\``,
    category: 'Bases du langage',
    hasQuiz: true,
  },
  {
    order: 5,
    titleFr: 'Les Listes',
    titleEn: 'Lists',
    titleAr: 'القوائم',
    contentFr: `Les listes sont des collections ordonnees et modifiables.

### Creation et acces
\`\`\`python
fruits = ["pomme", "banane", "cerise"]
print(fruits[0])    # "pomme"
print(fruits[-1])   # "cerise" (dernier)
print(fruits[1:3])  # ["banane", "cerise"]
\`\`\`

### Methodes principales
- \`append(x)\` — ajouter a la fin
- \`insert(i, x)\` — inserer a la position i
- \`remove(x)\` — supprimer la premiere occurrence
- \`pop()\` — supprimer et retourner le dernier
- \`sort()\` — trier sur place
- \`reverse()\` — inverser
- \`len(liste)\` — longueur

### List comprehension
\`\`\`python
carres = [x**2 for x in range(10)]
pairs = [x for x in range(20) if x % 2 == 0]
\`\`\``,
    contentEn: `Lists are ordered, mutable collections.

### Creation and access
\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])    # "apple"
print(fruits[-1])   # "cherry" (last)
print(fruits[1:3])  # ["banana", "cherry"]
\`\`\`

### Main methods
- \`append(x)\` — add to end
- \`insert(i, x)\` — insert at position i
- \`remove(x)\` — remove first occurrence
- \`pop()\` — remove and return last
- \`sort()\` — sort in place
- \`reverse()\` — reverse
- \`len(list)\` — length

### List comprehension
\`\`\`python
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
\`\`\``,
    contentAr: `القوائم هي مجموعات مرتبة وقابلة للتعديل.

### الإنشاء والوصول
\`\`\`python
fruits = ["تفاح", "موز", "كرز"]
print(fruits[0])    # "تفاح"
\`\`\`

### الدوال الرئيسية
- \`append(x)\` — إضافة في النهاية
- \`insert(i, x)\` — إدراج في الموضع i
- \`remove(x)\` — حذف أول ظهور
- \`pop()\` — حذف وإرجاع الأخير
- \`sort()\` — ترتيب
- \`len(list)\` — الطول`,
    category: 'Structures de donnees',
    hasQuiz: true,
  },
  {
    order: 6,
    titleFr: 'Les Dictionnaires',
    titleEn: 'Dictionaries',
    titleAr: 'القواميس',
    contentFr: `Les dictionnaires stockent des paires cle-valeur.

### Creation et acces
\`\`\`python
personne = {
    "nom": "Alice",
    "age": 25,
    "ville": "Paris"
}
print(personne["nom"])  # "Alice"
print(personne.get("age", 0))  # 25 (avec defaut)
\`\`\`

### Methodes principales
- \`keys()\` — toutes les cles
- \`values()\` — toutes les valeurs
- \`items()\` — paires (cle, valeur)
- \`get(cle, defaut)\` — acces avec valeur par defaut
- \`update()\` — fusionner un autre dictionnaire
- \`pop(cle)\` — supprimer et retourner la valeur

### Iteration
\`\`\`python
for cle, valeur in personne.items():
    print(f"{cle}: {valeur}")
\`\`\``,
    contentEn: `Dictionaries store key-value pairs.

### Creation and access
\`\`\`python
person = {
    "name": "Alice",
    "age": 25,
    "city": "Paris"
}
print(person["name"])  # "Alice"
print(person.get("age", 0))  # 25 (with default)
\`\`\`

### Main methods
- \`keys()\` — all keys
- \`values()\` — all values
- \`items()\` — (key, value) pairs
- \`get(key, default)\` — access with default
- \`update()\` — merge another dictionary
- \`pop(key)\` — remove and return value

### Iteration
\`\`\`python
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\``,
    contentAr: `القواميس تخزن أزواج المفتاح-القيمة.

### الإنشاء والوصول
\`\`\`python
person = {
    "name": "Alice",
    "age": 25,
    "city": "Paris"
}
print(person["name"])  # "Alice"
\`\`\`

### الدوال الرئيسية
- \`keys()\` — جميع المفاتيح
- \`values()\` — جميع القيم
- \`items()\` — أزواج (مفتاح، قيمة)
- \`get(key, default)\` — وصول مع قيمة افتراضية
- \`pop(key)\` — حذف وإرجاع القيمة`,
    category: 'Structures de donnees',
    hasQuiz: true,
  },
  {
    order: 7,
    titleFr: 'Les Fonctions',
    titleEn: 'Functions',
    titleAr: 'الدوال',
    contentFr: `Les fonctions permettent de repeter du code de maniere organisee.

### Definition
\`\`\`python
def saluer(nom, titre="M."):
    return f"Bonjour {titre} {nom}"

print(saluer("Dupont"))       # Bonjour M. Dupont
print(saluer("Martin", "Mme")) # Bonjour Mme Martin
\`\`\`

### Parametres speciaux
\`\`\`python
def somme(*args):
    return sum(args)

somme(1, 2, 3, 4)  # 10

def afficher(**kwargs):
    for cle, val in kwargs.items():
        print(f"{cle}: {val}")
\`\`\`

### Lambda
\`\`\`python
carre = lambda x: x ** 2
carre(5)  # 25
\`\`\`

### Decorateurs
\`\`\`python
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Temps: {time.time() - start:.4f}s")
        return result
    return wrapper
\`\`\``,
    contentEn: `Functions allow organizing reusable code.

### Definition
\`\`\`python
def greet(name, title="Mr."):
    return f"Hello {title} {name}"

print(greet("Smith"))        # Hello Mr. Smith
print(greet("Jones", "Mrs.")) # Hello Mrs. Jones
\`\`\`

### Special parameters
\`\`\`python
def total(*args):
    return sum(args)

total(1, 2, 3, 4)  # 10

def display(**kwargs):
    for key, val in kwargs.items():
        print(f"{key}: {val}")
\`\`\`

### Lambda
\`\`\`python
square = lambda x: x ** 2
square(5)  # 25
\`\`\``,
    contentAr: `الدوال تسمح بتنظيم الكود القابل لإعادة الاستخدام.

### التعريف
\`\`\`python
def greet(name, title="Mr."):
    return f"Hello {title} {name}"
\`\`\`

### المعاملات الخاصة
\`\`\`python
def total(*args):
    return sum(args)
\`\`\`

### Lambda
\`\`\`python
square = lambda x: x ** 2
\`\`\``,
    category: 'Fonctions',
    hasQuiz: true,
  },
  {
    order: 8,
    titleFr: 'Fichiers et Exceptions',
    titleEn: 'Files and Exceptions',
    titleAr: 'الملفات والاستثناءات',
    contentFr: `Python permet de lire et ecrire des fichiers facilement.

### Lire un fichier
\`\`\`python
with open("data.txt", "r") as f:
    contenu = f.read()        # tout le contenu
    lignes = f.readlines()    # liste de lignes
\`\`\`

### Ecrire un fichier
\`\`\`python
with open("output.txt", "w") as f:
    f.write("Hello World\\n")
    f.write("Deuxieme ligne\\n")
\`\`\`

### Gestion des exceptions
\`\`\`python
try:
    resultat = 10 / 0
except ZeroDivisionError:
    print("Division par zero !")
except Exception as e:
    print(f"Erreur: {e}")
finally:
    print("Toujours execute")
\`\`\``,
    contentEn: `Python makes it easy to read and write files.

### Read a file
\`\`\`python
with open("data.txt", "r") as f:
    content = f.read()        # entire content
    lines = f.readlines()     # list of lines
\`\`\`

### Write a file
\`\`\`python
with open("output.txt", "w") as f:
    f.write("Hello World\\n")
    f.write("Second line\\n")
\`\`\`

### Exception handling
\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Division by zero!")
except Exception as e:
    print(f"Error: {e}")
finally:
    print("Always executed")
\`\`\``,
    contentAr: `Python يسهل قراءة وكتابة الملفات.

### قراءة ملف
\`\`\`python
with open("data.txt", "r") as f:
    content = f.read()
\`\`\`

### كتابة ملف
\`\`\`python
with open("output.txt", "w") as f:
    f.write("Hello World\\n")
\`\`\`

### معالجة الاستثناءات
\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("القسمة على صفر!")
\`\`\``,
    category: 'Fichiers',
    hasQuiz: true,
  },
  {
    order: 9,
    titleFr: 'POO en Python',
    titleEn: 'OOP in Python',
    titleAr: 'OOP في Python',
    contentFr: `Python supporte la programmation orientee objet.

### Classe de base
\`\`\`python
class Animal:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def presenter(self):
        return f"Je suis {self.nom}, j'ai {self.age} ans"

chat = Animal("Minou", 3)
print(chat.presenter())
\`\`\`

### Heritage
\`\`\`python
class Chien(Animal):
    def __init__(self, nom, age, race):
        super().__init__(nom, age)
        self.race = race

    def aboyer(self):
        return "Woof!"
\`\`\`

### Proprietes
\`\`\`python
class Compte:
    def __init__(self):
        self._solde = 0

    @property
    def solde(self):
        return self._solde
\`\`\``,
    contentEn: `Python supports object-oriented programming.

### Base class
\`\`\`python
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        return f"I am {self.name}, {self.age} years old"

cat = Animal("Whiskers", 3)
print(cat.introduce())
\`\`\`

### Inheritance
\`\`\`python
class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)
        self.breed = breed

    def bark(self):
        return "Woof!"
\`\`\``,
    contentAr: `Python تدعم البرمجة كائنية التوجه.

### الفئة الأساسية
\`\`\`python
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        return f"I am {self.name}, {self.age} years old"
\`\`\`

### الوراثة
\`\`\`python
class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)
        self.breed = breed
\`\`\``,
    category: 'POO',
    hasQuiz: true,
  },
  {
    order: 10,
    titleFr: 'Modules et Pip',
    titleEn: 'Modules and Pip',
    titleAr: 'الوحدات وPip',
    contentFr: `Python dispose d'un ecosysteme riche de modules.

### Importer des modules
\`\`\`python
import math
print(math.pi)  # 3.14159...

from datetime import datetime
now = datetime.now()

import random
print(random.randint(1, 10))
\`\`\`

### Installer avec pip
\`\`\`bash
pip install requests
pip install pandas
pip install flask
\`\`\`

### Modules populaires
- **requests** — requetes HTTP
- **pandas** — analyse de donnees
- **numpy** — calcul numerique
- **flask** — framework web leger
- **django** — framework web complet
- **matplotlib** — visualisation de donnees`,
    contentEn: `Python has a rich ecosystem of modules.

### Import modules
\`\`\`python
import math
print(math.pi)  # 3.14159...

from datetime import datetime
now = datetime.now()

import random
print(random.randint(1, 10))
\`\`\`

### Install with pip
\`\`\`bash
pip install requests
pip install pandas
pip install flask
\`\`\`

### Popular modules
- **requests** — HTTP requests
- **pandas** — data analysis
- **numpy** — numerical computing
- **flask** — lightweight web framework
- **django** — full web framework
- **matplotlib** — data visualization`,
    contentAr: `Python لديه نظام غني بالوحدات.

### استيراد الوحدات
\`\`\`python
import math
print(math.pi)

from datetime import datetime
now = datetime.now()
\`\`\`

### التثبيت بـ pip
\`\`\`bash
pip install requests
pip install pandas
\`\`\``,
    category: 'Modules',
    hasQuiz: true,
  },
];

// ── n8n Course Lessons ──
const n8nLessons = [
  {
    order: 1,
    titleFr: "C'est quoi n8n ?",
    titleEn: "What is n8n?",
    titleAr: "ما هو n8n؟",
    contentFr: `n8n est un outil d'automatisation open-source de type "workflow automation". Il permet de connecter des applications et services entre eux sans code ou avec du code JavaScript.

### Pourquoi n8n ?
- Open-source et auto-hebergeable
- Interface visuelle drag-and-drop
- Supporte les webhooks, API, JavaScript
- Plus de 400 integrations natives
- Alternative open-source a Zapier et Make

### Concepts cles
- **Workflow** — ensemble d'etapes automatisees
- **Node** — chaque etape du workflow
- **Trigger** — ce qui declenche le workflow
- **Connection** — lien entre les nodes`,
    contentEn: `n8n is an open-source "workflow automation" tool. It allows connecting applications and services together without code or with JavaScript.

### Why n8n?
- Open-source and self-hostable
- Visual drag-and-drop interface
- Supports webhooks, API, JavaScript
- 400+ native integrations
- Open-source alternative to Zapier and Make

### Key concepts
- **Workflow** — set of automated steps
- **Node** — each step in the workflow
- **Trigger** — what starts the workflow
- **Connection** — link between nodes`,
    contentAr: `n8n هي أداة أتمتة مفتوحة المصدر من نوع "أتمتة سير العمل". تسمح بربط التطبيقات والخدمات معاً بدون كود أو باستخدام JavaScript.

### لماذا n8n؟
- مفتوحة المصدر وقابلة للاستضافة الذاتية
- واجهة بصرية بالسحب والإفلات
- تدعم webhooks وAPI وJavaScript
- أكثر من 400 تكامل أصلي`,
    category: 'Introduction',
    hasQuiz: true,
  },
  {
    order: 2,
    titleFr: 'Installation et Configuration',
    titleEn: 'Installation and Setup',
    titleAr: 'التثبيت والإعداد',
    contentFr: `n8n peut etre installe de plusieurs facons.

### Methode 1 : npx (la plus simple)
\`\`\`bash
npx n8n
\`\`\`

### Methode 2 : Docker
\`\`\`bash
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  n8nio/n8n
\`\`\`

### Methode 3 : npm global
\`\`\`bash
npm install n8n -g
n8n start
\`\`\`

### Acceder a l'interface
Une fois lance, ouvrez http://localhost:5678 dans votre navigateur.`,
    contentEn: `n8n can be installed in several ways.

### Method 1: npx (simplest)
\`\`\`bash
npx n8n
\`\`\`

### Method 2: Docker
\`\`\`bash
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  n8nio/n8n
\`\`\`

### Method 3: npm global
\`\`\`bash
npm install n8n -g
n8n start
\`\`\`

### Access the interface
Once running, open http://localhost:5678 in your browser.`,
    contentAr: `يمكن تثبيت n8n بعدة طرق.

### الطريقة 1: npx (الأسهل)
\`\`\`bash
npx n8n
\`\`\`

### الطريقة 2: Docker
\`\`\`bash
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  n8nio/n8n
\`\`\``,
    category: 'Installation',
    hasQuiz: true,
  },
  {
    order: 3,
    titleFr: 'Premier Workflow',
    titleEn: 'First Workflow',
    titleAr: 'سير العمل الأول',
    contentFr: `Creons notre premier workflow dans n8n.

### Etapes
1. Cliquez sur "Add Workflow"
2. Ajoutez un node **Webhook** comme trigger
3. Ajoutez un node **HTTP Request** pour appeler une API
4. Ajoutez un node **Set** pour transformer les donnees
5. Connectez les nodes entre eux
6. Cliquez sur "Execute Workflow"

### Exemple : Recupere la meteo
\`\`\`
Webhook → HTTP Request (api.openweathermap.org) → Set (extraire temperature) → Respond to Webhook
\`\`\`

### Les donnees dans n8n
Chaque node recoit et envoie des objets JSON. Les donnees du node precedent sont accessibles via \`$input.all()\` ou \`$json\`.`,
    contentEn: `Let's create our first workflow in n8n.

### Steps
1. Click "Add Workflow"
2. Add a **Webhook** node as trigger
3. Add an **HTTP Request** node to call an API
4. Add a **Set** node to transform data
5. Connect the nodes together
6. Click "Execute Workflow"

### Example: Get weather
\`\`\`
Webhook → HTTP Request (api.openweathermap.org) → Set (extract temperature) → Respond to Webhook
\`\`\`

### Data in n8n
Each node receives and sends JSON objects. Previous node data is accessible via \`$input.all()\` or \`$json\`.`,
    contentAr: `لننشئ سير العمل الأول في n8n.

### الخطوات
1. انقر على "Add Workflow"
2. أضف node **Webhook** كمحفز
3. أضف node **HTTP Request** لاستدعاء API
4. أضف node **Set** لتحويل البيانات
5. اربط العقد معاً
6. انقر على "Execute Workflow"`,
    category: 'Workflows',
    hasQuiz: true,
  },
  {
    order: 4,
    titleFr: 'Webhooks et Triggers',
    titleEn: 'Webhooks and Triggers',
    titleAr: 'Webhooks والمحفزات',
    contentFr: `Les triggers sont le point d'entree de chaque workflow.

### Types de triggers
- **Webhook** — declenche par une requete HTTP
- **Schedule/Cron** — declenche a intervalle regulier
- **Manual** — declenche manuellement
- **App triggers** — declenche par un evenement d'app (GitHub, Slack, etc.)

### Webhook node
\`\`\`
Method: POST
Path: /mon-webhook
Response: JSON
\`\`\`

### Exemple avec cURL
\`\`\`bash
curl -X POST http://localhost:5678/webhook/mon-webhook \\
  -H "Content-Type: application/json" \\
  -d '{"nom": "Alice", "action": "saluer"}'
\`\`\``,
    contentEn: `Triggers are the entry point of every workflow.

### Trigger types
- **Webhook** — triggered by HTTP request
- **Schedule/Cron** — triggered at regular intervals
- **Manual** — triggered manually
- **App triggers** — triggered by app event (GitHub, Slack, etc.)

### Webhook node
\`\`\`
Method: POST
Path: /my-webhook
Response: JSON
\`\`\``,
    contentAr: `المحفزات هي نقطة الدخول لكل سير عمل.

### أنواع المحفزات
- **Webhook** — يُطلق بطلب HTTP
- **Schedule/Cron** — يُطلق على فترات منتظمة
- **Manual** — يُطلق يدوياً
- **App triggers** — يُطلق بحدث من تطبيق`,
    category: 'Triggers',
    hasQuiz: true,
  },
  {
    order: 5,
    titleFr: 'API et HTTP Request',
    titleEn: 'API and HTTP Request',
    titleAr: 'API وطلبات HTTP',
    contentFr: `Le node HTTP Request permet d'appeler n'importe quelle API REST.

### Configuration
- **Method** : GET, POST, PUT, DELETE, PATCH
- **URL** : endpoint de l'API
- **Authentication** : Basic, Bearer Token, API Key, OAuth2
- **Headers** : Content-Type, Authorization, etc.
- **Body** : JSON, form-data, raw

### Exemple : Appeler l'API GitHub
\`\`\`
Method: GET
URL: https://api.github.com/users/octocat
Headers: Accept: application/vnd.github.v3+json
\`\`\`

### Exemple : Envoyer un POST
\`\`\`
Method: POST
URL: https://jsonplaceholder.typicode.com/posts
Body: {"title": "Mon titre", "body": "Mon contenu"}
\`\`\``,
    contentEn: `The HTTP Request node allows calling any REST API.

### Configuration
- **Method**: GET, POST, PUT, DELETE, PATCH
- **URL**: API endpoint
- **Authentication**: Basic, Bearer Token, API Key, OAuth2
- **Headers**: Content-Type, Authorization, etc.
- **Body**: JSON, form-data, raw`,
    contentAr: `node طلب HTTP يسمح باستدعاء أي REST API.

### الإعداد
- **Method**: GET, POST, PUT, DELETE, PATCH
- **URL**: نقطة نهاية API
- **Authentication**: Basic, Bearer Token, API Key, OAuth2`,
    category: 'API',
    hasQuiz: true,
  },
  {
    order: 6,
    titleFr: 'Code Node (JavaScript)',
    titleEn: 'Code Node (JavaScript)',
    titleAr: 'Code Node (JavaScript)',
    contentFr: `Le node Code permet d'ecrire du JavaScript personnalise dans vos workflows.

### Acceder aux donnees
\`\`\`javascript
// Obtenir tous les items d'entree
const items = $input.all();

// Acceder au JSON du premier item
const data = items[0].json;
console.log(data.nom);
\`\`\`

### Transformer les donnees
\`\`\`javascript
const results = [];
for (const item of $input.all()) {
  results.push({
    json: {
      nom: item.json.nom.toUpperCase(),
      age: item.json.age * 2
    }
  });
}
return results;
\`\`\`

### Utiliser des librairies
n8n inclut des librairies comme \`lodash\`, \`moment\`, \`crypto\`.`,
    contentEn: `The Code node allows writing custom JavaScript in your workflows.

### Access data
\`\`\`javascript
// Get all input items
const items = $input.all();

// Access JSON of first item
const data = items[0].json;
console.log(data.name);
\`\`\`

### Transform data
\`\`\`javascript
const results = [];
for (const item of $input.all()) {
  results.push({
    json: {
      name: item.json.name.toUpperCase(),
      age: item.json.age * 2
    }
  });
}
return results;
\`\`\``,
    contentAr: `node Code يسمح بكتابة JavaScript مخصص في سير العمل.

### الوصول للبيانات
\`\`\`javascript
const items = $input.all();
const data = items[0].json;
\`\`\`

### تحويل البيانات
\`\`\`javascript
const results = [];
for (const item of $input.all()) {
  results.push({
    json: {
      name: item.json.name.toUpperCase()
    }
  });
}
return results;
\`\`\``,
    category: 'JavaScript',
    hasQuiz: true,
  },
  {
    order: 7,
    titleFr: 'Conditions et IF',
    titleEn: 'Conditions and IF',
    titleAr: 'الشروط وIF',
    contentFr: `Le node IF permet de creer des branches conditionnelles.

### Configuration du node IF
- **Condition** : String, Number, Boolean, Date, etc.
- **Operation** : Equal, Not Equal, Contains, Greater Than, etc.
- **Value 1** : la valeur a tester
- **Value 2** : la valeur de comparaison

### Exemple : Filtrer par age
\`\`\`
IF: age >= 18
  → True: envoyer email de bienvenue
  → False: envoyer email parental
\`\`\`

### Node Switch (multi-branches)
Le node Switch permet de router vers plusieurs branches selon la valeur d'un champ.`,
    contentEn: `The IF node allows creating conditional branches.

### IF node configuration
- **Condition**: String, Number, Boolean, Date, etc.
- **Operation**: Equal, Not Equal, Contains, Greater Than, etc.
- **Value 1**: value to test
- **Value 2**: comparison value

### Example: Filter by age
\`\`\`
IF: age >= 18
  → True: send welcome email
  → False: send parent email
\`\`\``,
    contentAr: `node IF يسمح بإنشاء فروع شرطية.

### إعداد node IF
- **Condition**: String, Number, Boolean, Date
- **Operation**: Equal, Not Equal, Contains, Greater Than

### مثال: التصفية حسب العمر
\`\`\`
IF: age >= 18
  → True: إرسال بريد ترحيب
  → False: إرسال بريد للوالدين
\`\`\``,
    category: 'Conditions',
    hasQuiz: true,
  },
  {
    order: 8,
    titleFr: 'Integrations populaires',
    titleEn: 'Popular Integrations',
    titleAr: 'التكاملات الشائعة',
    contentFr: `n8n dispose de plus de 400 integrations natives.

### Communication
- **Slack** — envoyer des messages, notifications
- **Discord** — bots, webhooks
- **Email (SMTP/IMAP)** — envoyer et recevoir des emails
- **Telegram** — bots, notifications

### Productivite
- **Google Sheets** — lire/ecrire des feuilles
- **Notion** — creer des pages, bases de donnees
- **GitHub** — issues, pull requests, webhooks
- **Trello** — cartes, listes, boards

### CRM et Marketing
- **Stripe** — paiements, evenements
- **Mailchimp** — newsletters, campagnes
- **HubSpot** — contacts, deals`,
    contentEn: `n8n has 400+ native integrations.

### Communication
- **Slack** — send messages, notifications
- **Discord** — bots, webhooks
- **Email (SMTP/IMAP)** — send and receive emails
- **Telegram** — bots, notifications

### Productivity
- **Google Sheets** — read/write sheets
- **Notion** — create pages, databases
- **GitHub** — issues, pull requests, webhooks
- **Trello** — cards, lists, boards`,
    contentAr: `n8n لديه أكثر من 400 تكامل أصلي.

### التواصل
- **Slack** — إرسال رسائل وإشعارات
- **Discord** — bots وwebhooks
- **Email** — إرسال واستقبال رسائل

### الإنتاجية
- **Google Sheets** — قراءة وكتابة جداول
- **Notion** — إنشاء صفحات وقواعد بيانات
- **GitHub** — issues وpull requests`,
    category: 'Integrations',
    hasQuiz: true,
  },
  {
    order: 9,
    titleFr: 'Variables et Environnement',
    titleEn: 'Variables and Environment',
    titleAr: 'المتغيرات والبيئة',
    contentFr: `Les variables permettent de stocker des valeurs reutilisables.

### Variables de workflow
\`\`\`
{{ $workflow.name }}
{{ $workflow.id }}
\`\`\`

### Variables d'environnement
\`\`\`
{{ $env.MA_CLE_API }}
{{ $env.BASE_URL }}
\`\`\`

### Expressions
\`\`\`
{{ $json.nom }}
{{ $now.format('yyyy-MM-dd') }}
{{ $json.prix * 1.2 }}
{{ $json.email.toLowerCase() }}
\`\`\`

### Credentials
n8n permet de stocker les cles API et tokens de maniere securisee dans les Credentials.`,
    contentEn: `Variables allow storing reusable values.

### Workflow variables
\`\`\`
{{ $workflow.name }}
{{ $workflow.id }}
\`\`\`

### Environment variables
\`\`\`
{{ $env.MY_API_KEY }}
{{ $env.BASE_URL }}
\`\`\`

### Expressions
\`\`\`
{{ $json.name }}
{{ $now.format('yyyy-MM-dd') }}
{{ $json.price * 1.2 }}
{{ $json.email.toLowerCase() }}
\`\`\``,
    contentAr: `المتغيرات تسمح بتخزين قيم قابلة لإعادة الاستخدام.

### متغيرات سير العمل
\`\`\`
{{ $workflow.name }}
{{ $workflow.id }}
\`\`\`

### متغيرات البيئة
\`\`\`
{{ $env.MY_API_KEY }}
{{ $env.BASE_URL }}
\`\`\``,
    category: 'Variables',
    hasQuiz: true,
  },
  {
    order: 10,
    titleFr: 'Projet : Workflow complet',
    titleEn: 'Project: Complete Workflow',
    titleAr: 'مشروع: سير عمل كامل',
    contentFr: `Creons un workflow complet qui combine tout ce que nous avons appris.

### Projet : Systeme de notification
1. **Trigger** : Webhook POST avec donnees utilisateur
2. **IF** : Verifier si l'email est valide
3. **HTTP Request** : Appeler une API de verification
4. **Code** : Transformer les donnees en JavaScript
5. **Set** : Preparer le message
6. **Slack/Email** : Envoyer la notification
7. **Respond** : Retourner la reponse au webhook

### Workflow final
\`\`\`
Webhook → IF (email valide?) → HTTP Request (API) → Code (transform) → Set (message) → Slack → Respond
\`\`\``,
    contentEn: `Let's create a complete workflow combining everything we've learned.

### Project: Notification system
1. **Trigger**: Webhook POST with user data
2. **IF**: Check if email is valid
3. **HTTP Request**: Call a verification API
4. **Code**: Transform data in JavaScript
5. **Set**: Prepare the message
6. **Slack/Email**: Send notification
7. **Respond**: Return response to webhook`,
    contentAr: `لننشئ سير عمل كامل يجمع كل ما تعلمناه.

### مشروع: نظام الإشعارات
1. **Trigger**: Webhook POST ببيانات المستخدم
2. **IF**: التحقق من صحة البريد
3. **HTTP Request**: استدعاء API تحقق
4. **Code**: تحويل البيانات بـ JavaScript
5. **Set**: تحضير الرسالة
6. **Slack/Email**: إرسال الإشعار
7. **Respond**: إرجاع الرد`,
    category: 'Projet',
    hasQuiz: true,
  },
];

// ── OpenClaw Course Lessons ──
const openclawLessons = [
  {
    order: 1,
    titleFr: "C'est quoi OpenClaw ?",
    titleEn: "What is OpenClaw?",
    titleAr: "ما هو OpenClaw؟",
    contentFr: `OpenClaw est un agent IA personnel local-first. Il permet de controler et scripter des agents d'intelligence artificielle avec un acces systeme complet.

### Pourquoi OpenClaw ?
- Local-first : vos donnees restent chez vous
- Acces systeme complet (fichiers, terminal, reseau)
- Scriptable en langage naturel
- Extensible avec des plugins
- Alternative open-source aux assistants cloud

### Cas d'usage
- Automatisation de taches repetitives
- Analyse de fichiers et donnees
- Gestion de projets et organisation
- Scripting systeme en langage naturel`,
    contentEn: `OpenClaw is a local-first personal AI agent. It allows controlling and scripting AI agents with full system access.

### Why OpenClaw?
- Local-first: your data stays with you
- Full system access (files, terminal, network)
- Scriptable in natural language
- Extensible with plugins
- Open-source alternative to cloud assistants

### Use cases
- Repetitive task automation
- File and data analysis
- Project management and organization
- System scripting in natural language`,
    contentAr: `OpenClaw هو وكيل ذكاء اصطناعي شخصي محلي أولاً. يسمح بالتحكم وبرمجة وكلاء الذكاء الاصطناعي مع وصول كامل للنظام.

### لماذا OpenClaw؟
- محلي أولاً: بياناتك تبقى عندك
- وصول كامل للنظام (ملفات، طرفية، شبكة)
- قابل للبرمجة باللغة الطبيعية
- قابل للتوسع بإضافات

### حالات الاستخدام
- أتمتة المهام المتكررة
- تحليل الملفات والبيانات
- إدارة المشاريع والتنظيم`,
    category: 'Introduction',
    hasQuiz: true,
  },
  {
    order: 2,
    titleFr: 'Installation et Configuration',
    titleEn: 'Installation and Setup',
    titleAr: 'التثبيت والإعداد',
    contentFr: `Installer OpenClaw sur votre machine.

### Pre-requis
- Node.js 18+
- npm ou yarn
- Un modele LLM local (Ollama, llama.cpp) ou API

### Installation
\`\`\`bash
npm install -g openclaw
openclaw init
\`\`\`

### Configuration
\`\`\`bash
openclaw config set model ollama/llama3
openclaw config set api_url http://localhost:11434
\`\`\`

### Premier lancement
\`\`\`bash
openclaw start
\`\`\`

### Verifier l'installation
\`\`\`bash
openclaw status
\`\`\``,
    contentEn: `Install OpenClaw on your machine.

### Prerequisites
- Node.js 18+
- npm or yarn
- A local LLM model (Ollama, llama.cpp) or API

### Installation
\`\`\`bash
npm install -g openclaw
openclaw init
\`\`\`

### Configuration
\`\`\`bash
openclaw config set model ollama/llama3
openclaw config set api_url http://localhost:11434
\`\`\``,
    contentAr: `تثبيت OpenClaw على جهازك.

### المتطلبات
- Node.js 18+
- npm أو yarn
- نموذج LLM محلي (Ollama, llama.cpp) أو API

### التثبيت
\`\`\`bash
npm install -g openclaw
openclaw init
\`\`\``,
    category: 'Installation',
    hasQuiz: true,
  },
  {
    order: 3,
    titleFr: 'Premiers pas avec OpenClaw',
    titleEn: 'Getting Started with OpenClaw',
    titleAr: 'البدء مع OpenClaw',
    contentFr: `Decouvrez les commandes de base d'OpenClaw.

### Commandes principales
- \`openclaw chat\` — demarrer une conversation
- \`openclaw run "commande"\` — executer une commande
- \`openclaw file "description"\` — manipuler des fichiers
- \`openclaw search "requete"\` — rechercher dans les fichiers

### Exemples
\`\`\`bash
# Poser une question
openclaw chat "Explique-moi les closures en JavaScript"

# Creer un fichier
openclaw file "Creer un fichier README.md avec un titre et une description"

# Analyser un fichier
openclaw run "Analyse le fichier package.json et liste les dependances"
\`\`\`

### Permissions
OpenClaw demande confirmation avant les actions destructrices (suppression, modification).`,
    contentEn: `Discover OpenClaw's basic commands.

### Main commands
- \`openclaw chat\` — start a conversation
- \`openclaw run "command"\` — execute a command
- \`openclaw file "description"\` — manipulate files
- \`openclaw search "query"\` — search in files

### Examples
\`\`\`bash
# Ask a question
openclaw chat "Explain closures in JavaScript"

# Create a file
openclaw file "Create a README.md with a title and description"

# Analyze a file
openclaw run "Analyze package.json and list dependencies"
\`\`\``,
    contentAr: `اكتشف الأوامر الأساسية لـ OpenClaw.

### الأوامر الرئيسية
- \`openclaw chat\` — بدء محادثة
- \`openclaw run "command"\` — تنفيذ أمر
- \`openclaw file "description"\` — التعامل مع الملفات
- \`openclaw search "query"\` — البحث في الملفات`,
    category: 'Bases',
    hasQuiz: true,
  },
  {
    order: 4,
    titleFr: 'Scripting avec OpenClaw',
    titleEn: 'Scripting with OpenClaw',
    titleAr: 'البرمجة مع OpenClaw',
    contentFr: `OpenClaw peut executer des scripts complexes.

### Scripts en langage naturel
\`\`\`bash
openclaw run "
  1. Lis le fichier config.json
  2. Modifie la valeur de 'port' a 8080
  3. Sauvegarde le fichier
  4. Verifie que le fichier est valide
"
\`\`\`

### Pipelines
\`\`\`bash
openclaw run "Recupere les donnees de l'API" | openclaw run "Convertit en CSV"
\`\`\`

### Automatisation
\`\`\`bash
# Cron job avec OpenClaw
openclaw schedule "every day at 9am" "Generer le rapport quotidien"
\`\`\``,
    contentEn: `OpenClaw can execute complex scripts.

### Natural language scripts
\`\`\`bash
openclaw run "
  1. Read config.json
  2. Change 'port' value to 8080
  3. Save the file
  4. Verify the file is valid
"
\`\`\`

### Pipelines
\`\`\`bash
openclaw run "Fetch API data" | openclaw run "Convert to CSV"
\`\`\``,
    contentAr: `OpenClaw يمكنه تنفيذ سكريبتات معقدة.

### سكريبتات باللغة الطبيعية
\`\`\`bash
openclaw run "
  1. اقرأ config.json
  2. غيّر قيمة 'port' إلى 8080
  3. احفظ الملف
"
\`\`\``,
    category: 'Scripting',
    hasQuiz: true,
  },
  {
    order: 5,
    titleFr: 'Acces Systeme',
    titleEn: 'System Access',
    titleAr: 'الوصول للنظام',
    contentFr: `OpenClaw a acces complet au systeme.

### Operations sur les fichiers
\`\`\`bash
# Lire un fichier
openclaw file read "chemin/vers/fichier.txt"

# Ecrire un fichier
openclaw file write "chemin/vers/fichier.txt" "contenu"

# Lister un repertoire
openclaw file list "/chemin/repertoire"

# Rechercher
openclaw file search "mot-cle" --path "/chemin"
\`\`\`

### Commandes systeme
\`\`\`bash
openclaw run "Execute 'ls -la' dans le repertoire courant"
openclaw run "Installe le package npm express"
openclaw run "Verifie l'espace disque disponible"
\`\`\`

### Securite
- Sandbox pour les commandes dangereuses
- Confirmation avant suppression
- Logs de toutes les actions`,
    contentEn: `OpenClaw has full system access.

### File operations
\`\`\`bash
# Read a file
openclaw file read "path/to/file.txt"

# Write a file
openclaw file write "path/to/file.txt" "content"

# List a directory
openclaw file list "/path/directory"

# Search
openclaw file search "keyword" --path "/path"
\`\`\`

### System commands
\`\`\`bash
openclaw run "Run 'ls -la' in current directory"
openclaw run "Install npm package express"
openclaw run "Check available disk space"
\`\`\``,
    contentAr: `OpenClaw لديه وصول كامل للنظام.

### عمليات الملفات
\`\`\`bash
# قراءة ملف
openclaw file read "path/to/file.txt"

# كتابة ملف
openclaw file write "path/to/file.txt" "content"

# قائمة مجلد
openclaw file list "/path/directory"
\`\`\``,
    category: 'Systeme',
    hasQuiz: true,
  },
  {
    order: 6,
    titleFr: 'Plugins et Extensions',
    titleEn: 'Plugins and Extensions',
    titleAr: 'الإضافات والتوسعات',
    contentFr: `Etendez les capacites d'OpenClaw avec des plugins.

### Installer un plugin
\`\`\`bash
openclaw plugin install nom-du-plugin
\`\`\`

### Creer un plugin
\`\`\`javascript
// mon-plugin.js
module.exports = {
  name: 'mon-plugin',
  description: 'Ma fonctionnalite personnalisee',
  async execute(context, args) {
    // Votre logique ici
    return { result: 'succes' };
  }
};
\`\`\`

### Plugins populaires
- **web-scraper** — extraire des donnees du web
- **db-connector** — se connecter a des bases de donnees
- **git-helper** — commandes Git en langage naturel
- **email-sender** — envoyer des emails`,
    contentEn: `Extend OpenClaw's capabilities with plugins.

### Install a plugin
\`\`\`bash
openclaw plugin install plugin-name
\`\`\`

### Create a plugin
\`\`\`javascript
// my-plugin.js
module.exports = {
  name: 'my-plugin',
  description: 'My custom feature',
  async execute(context, args) {
    // Your logic here
    return { result: 'success' };
  }
};
\`\`\``,
    contentAr: `وسّع قدرات OpenClaw بالإضافات.

### تثبيت إضافة
\`\`\`bash
openclaw plugin install plugin-name
\`\`\`

### إنشاء إضافة
\`\`\`javascript
module.exports = {
  name: 'my-plugin',
  async execute(context, args) {
    return { result: 'success' };
  }
};
\`\`\``,
    category: 'Plugins',
    hasQuiz: true,
  },
  {
    order: 7,
    titleFr: 'Agents IA Multi-modeles',
    titleEn: 'Multi-Model AI Agents',
    titleAr: 'وكلاء ذكاء اصطناعي متعدد النماذج',
    contentFr: `OpenClaw supporte plusieurs modeles d'IA.

### Modeles supportes
- **Ollama** (local) — llama3, mistral, codellama
- **OpenAI** (cloud) — GPT-4, GPT-3.5
- **Anthropic** (cloud) — Claude
- **Google** (cloud) — Gemini

### Configuration multi-modeles
\`\`\`bash
openclaw config set default_model ollama/llama3
openclaw config set fallback_model openai/gpt-4
\`\`\`

### Router par tache
\`\`\`bash
# Code → modele code-specialise
openclaw run --model codellama "Ecris une fonction de tri"

# Creative → modele creatif
openclaw run --model gpt-4 "Ecris un poeme"
\`\`\``,
    contentEn: `OpenClaw supports multiple AI models.

### Supported models
- **Ollama** (local) — llama3, mistral, codellama
- **OpenAI** (cloud) — GPT-4, GPT-3.5
- **Anthropic** (cloud) — Claude
- **Google** (cloud) — Gemini

### Multi-model configuration
\`\`\`bash
openclaw config set default_model ollama/llama3
openclaw config set fallback_model openai/gpt-4
\`\`\``,
    contentAr: `OpenClaw يدعم عدة نماذج ذكاء اصطناعي.

### النماذج المدعومة
- **Ollama** (محلي) — llama3, mistral, codellama
- **OpenAI** (سحابي) — GPT-4, GPT-3.5
- **Anthropic** (سحابي) — Claude

### التكوين متعدد النماذج
\`\`\`bash
openclaw config set default_model ollama/llama3
\`\`\``,
    category: 'IA',
    hasQuiz: true,
  },
  {
    order: 8,
    titleFr: 'Projet : Assistant personnel',
    titleEn: 'Project: Personal Assistant',
    titleAr: 'مشروع: مساعد شخصي',
    contentFr: `Creons un assistant personnel complet avec OpenClaw.

### Objectif
Un assistant qui :
1. Lit vos emails chaque matin
2. Resume votre journee (calendrier)
3. Prepare une liste de taches priorisees
4. Vous envoie un recap par email/Slack

### Implementation
\`\`\`bash
# 1. Script principal
openclaw file write "assistant.js" "
  // Lire les emails non lus
  // Analyser le calendrier
  // Generer la liste de taches
  // Envoyer le recap
"

# 2. Planification
openclaw schedule "every day at 8am" "node assistant.js"
\`\`\``,
    contentEn: `Let's create a complete personal assistant with OpenClaw.

### Objective
An assistant that:
1. Reads your emails every morning
2. Summarizes your day (calendar)
3. Prepares a prioritized task list
4. Sends you a recap via email/Slack`,
    contentAr: `لننشئ مساعد شخصي كامل مع OpenClaw.

### الهدف
مساعد يقوم بـ:
1. قراءة بريدك كل صباح
2. تلخيص يومك (التقويم)
3. إعداد قائمة مهام مرتبة حسب الأولوية
4. إرسال ملخص عبر البريد/Slack`,
    category: 'Projet',
    hasQuiz: true,
  },
  {
    order: 9,
    titleFr: 'Bonnes pratiques et Securite',
    titleEn: 'Best Practices and Security',
    titleAr: 'أفضل الممارسات والأمان',
    contentFr: `Utilisez OpenClaw de maniere securisee.

### Regles de securite
- Ne jamais donner un acces root sans restriction
- Utiliser le mode sandbox pour les commandes inconnues
- Verifier les logs regulierement
- Sauvegarder vos configurations

### Bonnes pratiques
- Utiliser des modeles locaux pour les donnees sensibles
- Limiter les permissions au minimum necessaire
- Tester les scripts dans un environnement isole
- Documenter vos workflows et scripts

### Monitoring
\`\`\`bash
openclaw logs --last 24h
openclaw status
openclaw audit
\`\`\``,
    contentEn: `Use OpenClaw securely.

### Security rules
- Never give root access without restrictions
- Use sandbox mode for unknown commands
- Check logs regularly
- Backup your configurations

### Best practices
- Use local models for sensitive data
- Limit permissions to minimum necessary
- Test scripts in isolated environment
- Document your workflows and scripts`,
    contentAr: `استخدم OpenClaw بشكل آمن.

### قواعد الأمان
- لا تمنح وصول root بدون قيود
- استخدم وضع العزل للأوامر المجهولة
- تحقق من السجلات بانتظام
- انسخ تكويناتك احتياطياً

### أفضل الممارسات
- استخدم النماذج المحلية للبيانات الحساسة
- حد الصلاحيات للحد الأدنى الضروري
- اختبر السكريبتات في بيئة معزولة`,
    category: 'Securite',
    hasQuiz: true,
  },
  {
    order: 10,
    titleFr: 'Projet final : Automation complete',
    titleEn: 'Final Project: Complete Automation',
    titleAr: 'المشروع النهائي: أتمتة كاملة',
    contentFr: `Combine tout ce que vous avez appris dans un projet final.

### Projet : Pipeline CI/CD intelligent
1. Surveille un depot GitHub (webhook)
2. Analyse les pull requests avec IA
3. Execute les tests automatiquement
4. Genere un resume des changements
5. Notifie l'equipe sur Slack
6. Deploie si tous les tests passent

### Architecture
\`\`\`
GitHub Webhook → OpenClaw (analyse PR) → Tests → Slack Notification → Deploy
\`\`\`

### Bonus
- Dashboard de suivi en temps reel
- Rapport hebdomadaire automatique
- Alertes intelligentes (anomalies detectees par IA)`,
    contentEn: `Combine everything you've learned in a final project.

### Project: Intelligent CI/CD Pipeline
1. Monitor a GitHub repository (webhook)
2. Analyze pull requests with AI
3. Run tests automatically
4. Generate change summary
5. Notify team on Slack
6. Deploy if all tests pass

### Architecture
\`\`\`
GitHub Webhook → OpenClaw (analyze PR) → Tests → Slack Notification → Deploy
\`\`\``,
    contentAr: `اجمع كل ما تعلمته في مشروع نهائي.

### مشروع: خط أنابيب CI/CD ذكي
1. مراقبة مستودع GitHub (webhook)
2. تحليل pull requests بالذكاء الاصطناعي
3. تشغيل الاختبارات تلقائياً
4. إنشاء ملخص التغييرات
5. إشعار الفريق على Slack
6. النشر إذا نجحت جميع الاختبارات`,
    category: 'Projet',
    hasQuiz: true,
  },
];

// ── Main seed function ──
async function seedLessons() {
  console.log('Seeding lessons...');

  const courseMap: Record<string, any[]> = {
    php: phpLessons,
    python: pythonLessons,
    n8n: n8nLessons,
    openclaw: openclawLessons,
  };

  let totalLessons = 0;

  for (const [slug, lessons] of Object.entries(courseMap)) {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) {
      console.log(`  ⚠ Course "${slug}" not found, skipping.`);
      continue;
    }

    for (const lesson of lessons) {
      await prisma.lesson.upsert({
        where: {
          courseId_order: {
            courseId: course.id,
            order: lesson.order,
          },
        },
        update: {
          titleFr: lesson.titleFr,
          titleEn: lesson.titleEn,
          titleAr: lesson.titleAr,
          contentFr: lesson.contentFr,
          contentEn: lesson.contentEn,
          contentAr: lesson.contentAr,
          category: lesson.category,
          hasQuiz: lesson.hasQuiz,
        },
        create: {
          courseId: course.id,
          order: lesson.order,
          titleFr: lesson.titleFr,
          titleEn: lesson.titleEn,
          titleAr: lesson.titleAr,
          contentFr: lesson.contentFr,
          contentEn: lesson.contentEn,
          contentAr: lesson.contentAr,
          category: lesson.category,
          hasQuiz: lesson.hasQuiz,
        },
      });
      totalLessons++;
    }

    console.log(`  ✓ ${slug}: ${lessons.length} lessons`);
  }

  console.log(`\nSeeded ${totalLessons} lessons across ${Object.keys(courseMap).length} courses!`);
}

async function main() {
  console.log('=== Smartcodai V2 - Lesson Seeder ===\n');

  // First run the course seed if needed
  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    console.log('No courses found. Running course seed first...\n');
    // Run the original seed
    const { main: courseSeed } = await import('./seed');
    await courseSeed();
    console.log('');
  }

  await seedLessons();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
