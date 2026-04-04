import re
import sys

def build_python_app():
    with open('apprendre-python-app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Colors
    content = content.replace('--php: #7c6df8;', '--php: #306998;')
    content = content.replace('--php2: #a78bfa;', '--php2: #FFE873;')
    
    # Texts
    content = content.replace('<title>Apprendre PHP — Interactif</title>', '<title>Apprendre Python — Interactif</title>')
    content = content.replace('<span>&lt;</span>PHP<span>/&gt;</span>', '<span>&lt;</span>Python<span>/&gt;</span>')
    content = content.replace('Maîtriser PHP<br>pas à pas', 'Maîtriser Python<br>pas à pas')
    content = content.replace('Testez vos connaissances PHP', 'Testez vos connaissances Python')
    content = content.replace('Apprendre PHP —', 'Apprendre Python —')
    content = content.replace('Développement Web avec PHP', 'Programmation en Python')
    content = content.replace('formation PHP complète', 'formation Python complète')
    content = content.replace("const certId='PHP-'", "const certId='PY-'")
    content = content.replace('<span class="code-lang">PHP</span>', '<span class="code-lang">Python</span>')
    content = content.replace('Éditeur PHP Simulé', 'Éditeur Python Simulé')
    content = content.replace('Aide-mémoire PHP', 'Aide-mémoire Python')
    content = content.replace("parcours d'apprentissage PHP", "parcours d'apprentissage Python")
    content = content.replace('certificat-php-', 'certificat-python-')
    content = content.replace('<?php  />', 'Python  ')
    content = content.replace('simulatePHP', 'simulatePython')

    # Lessons
    lessons = """const lessons = [
  {
    id: 'intro', icon: '🐍', category: 'Introduction', title: 'C\\'est quoi Python ?',
    tag: 'Débutant',
    content: `
      <p>Python est un langage de programmation puissant, facile à apprendre et très populaire. Créé par Guido van Rossum en 1991, il est aujourd\\'hui utilisé partout, de l\\'Intelligence Artificielle au développement web.</p>
      <h3>Pourquoi Python ?</h3>
      <ul>
        <li>Syntaxe claire et lisible (proche de l\\'anglais)</li>
        <li>Pas de points-virgules, l\\'indentation définit les blocs de code</li>
        <li>Immense écosystème (Data Science, web, scripts)</li>
      </ul>
    `,
    code: `print("Bonjour le monde !")\\n\\n# Variables et types simples\\nnom = "Alice"\\nage = 25\\nprint(f"Je m'appelle {nom} et j'ai {age} ans")`,
    sandbox: `print("Hello World!")\\n# Modifiez ce code\\nx = 10\\nprint("x vaut", x)`,
    quiz: {
      question: 'Comment affiche-t-on du texte en Python ?',
      options: ['echo "texte"', 'console.log("texte")', 'print("texte")', 'printf("texte")'],
      correct: 2,
      explain: 'La fonction native print() est utilisée pour afficher des données dans la console en Python.'
    }
  },
  {
    id: 'variables', icon: '📦', category: 'Bases du langage', title: 'Variables & Types',
    tag: 'Débutant',
    content: `
      <p>Python est dynamiquement typé, ce qui signifie que vous n\\'avez pas besoin de déclarer le type d\\'une variable avant de l\\'utiliser.</p>
      <h3>Types courants</h3>
      <ul>
        <li><strong>str</strong> : Chaînes de caractères ("Texte")</li>
        <li><strong>int</strong> : Nombres entiers (42)</li>
        <li><strong>float</strong> : Nombres décimaux (3.14)</li>
        <li><strong>bool</strong> : Booléens (True ou False)</li>
      </ul>
    `,
    code: `nom = "Bob"  # str\\nage = 30     # int\\ntaille = 1.8 # float\\nactif = True # bool\\n\\nprint(type(age)) # <class 'int'>`,
    sandbox: `a = 5\\nb = 2.5\\nprint(a + b)\\nprint(type(a + b))`,
    quiz: {
      question: 'Quel est le type de la valeur 3.14 en Python ?',
      options: ['int', 'float', 'double', 'str'],
      correct: 1,
      explain: 'En Python, les nombres à virgule flottante sont de type float. double n\\'existe pas.'
    }
  },
  {
    id: 'listes', icon: '🗂️', category: 'Structures', title: 'Les Listes',
    tag: 'Intermédiaire',
    content: `
      <p>Une liste permet de stocker plusieurs éléments dans une seule variable. Elles sont modifiables (mutables) et peuvent contenir différents types.</p>
      <h3>Méthodes courantes</h3>
      <ul>
        <li><code>append(x)</code> : ajoute à la fin</li>
        <li><code>insert(i, x)</code> : insère à l\\'index i</li>
        <li><code>pop()</code> : retire et renvoie le dernier élément</li>
        <li><code>len(liste)</code> : donne la taille de la liste</li>
      </ul>
    `,
    code: `fruits = ["pomme", "banane"]\\nfruits.append("cerise")\\n\\nprint(fruits[0]) # pomme\\nprint(len(fruits)) # 3`,
    sandbox: `nombres = [1, 2, 3]\\nnombres.append(4)\\nprint("Ma liste:", nombres)`,
    quiz: {
      question: 'Comment ajouter un élément à la fin d\\'une liste nommée "L" ?',
      options: ['L.push(x)', 'L.add(x)', 'L.append(x)', 'L.insert(x)'],
      correct: 2,
      explain: 'La méthode pour ajouter un élément en fin de liste en Python est append().'
    }
  },
  {
    id: 'boucles', icon: '🔄', category: 'Contrôle', title: 'Boucles For & While',
    tag: 'Débutant',
    content: `
      <p>Les boucles permettent de répéter un bloc de code. Python utilise principalement <code>for</code> (pour itérer sur une séquence) et <code>while</code> (tant qu\\'une condition est vraie).</p>
      <h3>La boucle for</h3>
      <p>Elle s\\'utilise souvent avec la fonction <code>range()</code> qui génère une suite de nombres.</p>
    `,
    code: `for i in range(3):\\n    print("Itération", i)\\n\\n# Parcourir une liste\\nfruits = ["pomme", "poire"]\\nfor f in fruits:\\n    print(f)\\n\\n# Boucle while\\nx = 0\\nwhile x < 2:\\n    print(x)\\n    x += 1`,
    sandbox: `for i in range(1, 4):\\n    print("Carré de", i, "est", i*i)`,
    quiz: {
      question: 'Que génère range(3) dans une boucle for ?',
      options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3 itérations aléatoires'],
      correct: 1,
      explain: 'range(3) commence à 0 et s\\'arrête avant 3, donc : 0, 1, 2.'
    }
  },
  {
    id: 'fonctions', icon: '⚙️', category: 'Fonctions', title: 'Les Fonctions (def)',
    tag: 'Intermédiaire',
    content: `
      <p>Les fonctions permettent de grouper et réutiliser un bloc de code. En Python, on les définit avec le mot-clé <code>def</code>.</p>
    `,
    code: `def saluer(nom="Inconnu"):\\n    return f"Bonjour {nom} !"\\n\\nmsg = saluer("Alice")\\nprint(msg)\\nprint(saluer())`,
    sandbox: `def carre(n):\\n    return n * n\\n\\nprint("Le carré de 5 est", carre(5))`,
    quiz: {
      question: 'Comment déclare-t-on une fonction en Python ?',
      options: ['function maFonction():', 'def maFonction():', 'func maFonction():', 'void maFonction() {'],
      correct: 1,
      explain: 'Le mot-clé pour définir une fonction en Python est def suivi du nom et de deux-points (:).'
    }
  }
];"""
    
    content = re.sub(r'const lessons = \[[\s\S]*?(?=\nconst cheatData)', lessons, content, count=1)

    # CheatData
    cheatData = """const cheatData = [
  { title: 'Print', code: `print("Bonjour")\\nprint(f"Total: {x}")` },
  { title: 'Variables', code: `age = 25\\nnom = "Alice"\\nok = True` },
  { title: 'Conditions', code: `if x > 0:\\n  print("Positif")\\nelif x == 0:\\n  print("Zéro")\\nelse:\\n  print("Négatif")` },
  { title: 'Listes', code: `L = [1, 2]\\nL.append(3)\\nprint(L[0]) # 1` },
  { title: 'Dictionnaires', code: `D = {"nom": "Bob"}\\nprint(D["nom"])\\nD["age"] = 30` },
  { title: 'Boucle For', code: `for i in range(5):\\n  print(i)` },
  { title: 'Fonctions', code: `def calc(a, b):\\n  return a + b` }
];"""
    content = re.sub(r'const cheatData = \[[\s\S]*?(?=\nconst quickQuizzes)', cheatData, content, count=1)

    # QuickQuizzes
    quickQuizzes = """const quickQuizzes = [
  { q: 'Comment afficher du texte en Python ?', opts: ['echo()', 'print()', 'console.log()', 'System.out.println()'], ans: 1 },
  { q: 'Symbole pour un commentaire en Python ?', opts: ['//', '/*', '#', '<!--'], ans: 2 },
  { q: 'Quel type est modifiable (mutable) ?', opts: ['tuple', 'str', 'int', 'list'], ans: 3 },
  { q: 'Comment définir une fonction ?', opts: ['function f()', 'def f():', 'func f:', 'f() =>'], ans: 1 }
];"""
    content = re.sub(r'const quickQuizzes = \[[\s\S]*?(?=\n// ===== STATE =====)', quickQuizzes, content, count=1)

    # Simuler un evaluator basic pour python (en js)
    js_simulator = """
function simulatePython(code) {
  let out = '';
  const lines = code.split('\\n');
  const vars = {};
  
  for (let l of lines) {
    l = l.trim();
    if (!l || l.startsWith('#')) continue;
    
    // basic variable assignment
    const assign = l.match(/^([a-zA-Z_]\w*)\\s*=\\s*(.*)$/);
    if (assign) {
      let val = assign[2];
      if (val === 'True') val = true;
      else if (val === 'False') val = false;
      else if (!isNaN(val)) val = Number(val);
      else if (val.startsWith('"') || val.startsWith("'")) val = val.slice(1, -1);
      vars[assign[1]] = val;
      continue;
    }
    
    // basic print
    if (l.startsWith('print(') && l.endsWith(')')) {
      let args = l.substring(6, l.length - 1).split(',');
      let str = args.map(a => {
        a = a.trim();
        if (a.startsWith('"') || a.startsWith("'")) return a.slice(1, -1);
        if (vars[a] !== undefined) return vars[a];
        if (a.startsWith('type(')) return "<class 'type'>";
        if (a.startsWith('len(')) return "3"; // mock
        if (a.includes(' + ')) return Number(vars[a.split('+')[0].trim()] || 0) + Number(vars[a.split('+')[1].trim()] || 0);
        return a;
      }).join(' ');
      out += str + '\\n';
    } else if (l.includes('append(') || l.includes('return ') || l.includes('for ')) {
      // Pour les exos complexes, on simule une sortie generique si c'est pas géré
    }
  }
  return out || "(Script exécuté - vérifiez syntaxe si vide)";
}
"""
    content = re.sub(r'function simulatePython\(code\) \{[\s\S]*?return out;\n\}', lambda m: js_simulator.strip(), content, count=1)

    with open('apprendre-python-app.html', 'w', encoding='utf-8') as f:
        f.write(content)

def build_n8n_app():
    with open('apprendre-n8n-app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Colors
    content = content.replace('--php: #7c6df8;', '--php: #ea433f;')
    content = content.replace('--php2: #a78bfa;', '--php2: #ff6d6a;')
    
    # Texts
    content = content.replace('<title>Apprendre PHP — Interactif</title>', '<title>Apprendre n8n — Interactif</title>')
    content = content.replace('<span>&lt;</span>PHP<span>/&gt;</span>', '<span>{</span>n8n<span>}</span>')
    content = content.replace('Maîtriser PHP<br>pas à pas', 'Maîtriser n8n<br>tous vos workflows')
    content = content.replace('Testez vos connaissances PHP', 'Testez vos connaissances sur n8n')
    content = content.replace('Apprendre PHP —', 'Apprendre n8n —')
    content = content.replace('Développement Web avec PHP', 'Automatisation avec n8n')
    content = content.replace('formation PHP complète', 'formation n8n complète')
    content = content.replace("const certId='PHP-'", "const certId='N8N-'")
    content = content.replace('<span class="code-lang">PHP</span>', '<span class="code-lang">JSON</span>')
    content = content.replace('Éditeur PHP Simulé', 'Simulateur de Webhook n8n')
    content = content.replace('Aide-mémoire PHP', 'Aide-mémoire n8n')
    content = content.replace("parcours d'apprentissage PHP", "parcours d'apprentissage n8n")
    content = content.replace('certificat-php-', 'certificat-n8n-')
    content = content.replace('<?php  />', 'n8n node')
    content = content.replace('simulatePHP', 'simulateN8N')

    # Lessons
    lessons = """const lessons = [
  {
    id: 'intro', icon: '⚙️', category: 'Découverte', title: 'Qu\\'est-ce que n8n ?',
    tag: 'Débutant',
    content: `
      <p>n8n est une plateforme d\\'automatisation de flux de travail (workflows) open-source ou en mode SaaS. Elle permet de connecter n\\'importe quelle application avec n\\'importe quelle autre via des APIs.</p>
      <h3>Pourquoi n8n ?</h3>
      <ul>
        <li>Interface visuelle No-Code très puissante</li>
        <li>Approche "Fair-code" (vous pouvez l\\'héberger vous-même gratuitement)</li>
        <li>Basé sur des "Nodes" (Nœuds) qui transmettent de la donnée sous forme de JSON</li>
        <li>Permet d\\'écrire du vrai code JavaScript dans le nœud "Code"</li>
      </ul>
    `,
    code: `[\n  {\n    "trigger": "Webhook reçu",\n    "action": "Créer une ligne Google Sheets"\n  }\n]`,
    sandbox: `{\n  "client": "John Doe",\n  "email": "john@example.com"\n}`,
    quiz: {
      question: 'Sous quel format les données circulent-elles entre les nœuds n8n ?',
      options: ['XML', 'HTML', 'JSON', 'Texte Brut'],
      correct: 2,
      explain: 'Toutes les données traitées et transmises par n8n circulent sous la forme d\\'objets JSON.'
    }
  },
  {
    id: 'nodes', icon: '🔗', category: 'Bases', title: 'Les Nœuds (Nodes)',
    tag: 'Débutant',
    content: `
      <p>Un Workflow n8n est composé de Nœuds. Chaque Nœud effectue une seule tâche spécifique.</p>
      <h3>Types de nœuds</h3>
      <ul>
        <li><strong>Trigger Node</strong> : Déclenche le workflow (ex: Webhook, Cron, sur réception d\\'e-mail).</li>
        <li><strong>Core Node</strong> : Nœuds intégrés (ex: Switch, IF, Set, Code, HTTP Request).</li>
        <li><strong>App Node</strong> : Connecteurs vers des services tiers (ex: Slack, Gmail, Trello).</li>
      </ul>
    `,
    code: `// Structure d'une donnée dans n8n\\n[\\n  {\\n    "json": {\\n      "cle": "valeur"\\n    }\\n  }\\n]`,
    sandbox: `{\n  "action": "Envoyer un message Slack",\n  "text": "Nouveau lead !"\n}`,
    quiz: {
      question: 'Quel nœud permet de démarrer un workflow n8n ?',
      options: ['Un Core Node', 'Un Trigger Node', 'Un Action Node', 'Un HTTP Request'],
      correct: 1,
      explain: 'Un workflow commence toujours par un Trigger Node (déclencheur) comme Webhook ou Schedule.'
    }
  },
  {
    id: 'expressions', icon: '🧮', category: 'Avancé', title: 'Les Expressions',
    tag: 'Intermédiaire',
    content: `
      <p>Dans n8n, vous pouvez rendre n\\'importe quel champ dynamique en utilisant des Expressions JavaScript.</p>
      <h3>Syntaxe</h3>
      <p>Les expressions s\\'écrivent entre doubles accolades : <code>{{ }}</code></p>
      <ul>
        <li><code>{{ $json.email }}</code> : Récupère l\\'e-mail du nœud précédent</li>
        <li><code>{{ $now }}</code> : Date/heure actuelle</li>
        <li><code>{{ $json.prix * 1.20 }}</code> : Fait des calculs</li>
      </ul>
    `,
    code: `// Expression typique n8n\\nLe prochain client est : {{ $json.prenom }}\\nDate : {{ $now.format('YYYY-MM-DD') }}`,
    sandbox: `{\n  "expression": "{{ $json.total * 1.2 }}",\n  "total": 100\n}`,
    quiz: {
      question: 'Quelle est la syntaxe correcte pour une expression n8n ?',
      options: ['[ expression ]', '{{ expression }}', '${ expression }', '< expression >'],
      correct: 1,
      explain: 'Les expressions dans n8n sont encapsulées dans des doubles accolades.'
    }
  }
];"""
    content = re.sub(r'const lessons = \[[\s\S]*?(?=\nconst cheatData)', lessons, content, count=1)

    # CheatData
    cheatData = """const cheatData = [
  { title: 'Expression JSON', code: `{{ $json.monChamp }}` },
  { title: 'Date du jour', code: `{{ $now.setZone('Europe/Paris') }}` },
  { title: 'Trigger Node', code: `Webhook\\nSchedule\\nEmail Read` },
  { title: 'Opérateur Ternaire', code: `{{ $json.age >= 18 ? 'Majeur' : 'Mineur' }}` }
];"""
    content = re.sub(r'const cheatData = \[[\s\S]*?(?=\nconst quickQuizzes)', cheatData, content, count=1)

    # QuickQuizzes
    quickQuizzes = """const quickQuizzes = [
  { q: 'Quel est le cœur de données de n8n ?', opts: ['XML', 'JSON', 'CSV', 'YAML'], ans: 1 },
  { q: 'Que fait le noeud "Set" ?', opts: ['Il supprime des données', 'Il définit ou modifie des valeurs JSON', 'Il fait des requêtes HTTP', 'Il gère la BD'], ans: 1 },
  { q: 'Comment écrire une expression ?', opts: ['{{ expression }}', '${ expression }', '% expression %', '[[ expression ]]'], ans: 0 }
];"""
    content = re.sub(r'const quickQuizzes = \[[\s\S]*?(?=\n// ===== STATE =====)', quickQuizzes, content, count=1)

    # Simuler un evaluator basic pour n8n
    js_simulator = """
function simulateN8N(code) {
  try {
    const data = JSON.parse(code);
    return "✅ Webhook reçu avec succès !\\n\\nDonnées analysées par n8n :\\n" + JSON.stringify(data, null, 2);
  } catch(e) {
    return "❌ Erreur de flux : JSON invalide !\\n" + e.message;
  }
}
"""
    content = re.sub(r'function simulateN8N\(code\) \{[\s\S]*?return out;\n\}', js_simulator.strip(), content, count=1)

    with open('apprendre-n8n-app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    build_python_app()
    build_n8n_app()
    print("Génération réussie !")
