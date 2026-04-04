import re

def expand_python_app():
    with open('apprendre-python-app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    lessons = """const lessons = [
  {
    id: 'intro', icon: '🐍', category: 'Chapitre 1', title: 'Introduction à Python',
    tag: 'Débutant',
    content: `
      <p>Bienvenue dans ce cours basé sur le célèbre support de <em>Patrick Fuchs et Pierre Poulain</em>. Python est un langage interprété, facile à lire et extrêmement puissant.</p>
      <h3>Caractéristiques</h3>
      <ul>
        <li><strong>Interprété</strong> : pas besoin de compiler, le code s\\'exécute ligne par ligne.</li>
        <li><strong>Lisibilité</strong> : l\\'indentation (espaces au début des lignes) est obligatoire et structure le code.</li>
        <li><strong>Typage dynamique</strong> : le type des variables est deviné automatiquement.</li>
      </ul>
    `,
    code: `# Mon premier script Python\\nprint("Hello World!")\\n\\n# L'indentation est cruciale !\\nif True:\\n    print("Ceci est indenté de 4 espaces")`,
    sandbox: `print("Bienvenue dans l\\'apprentissage de Python !")`,
    quiz: {
      question: 'Qu\\'est-ce qui délimite les blocs de code en Python ?',
      options: ['Les accolades { }', 'Les mots-clés BEGIN et END', 'L\\'indentation (les espaces)', 'Les points-virgules ;'],
      correct: 2,
      explain: 'En Python, c\\'est l\\'indentation (le décalage vers la droite) qui définit visuellement et logiquement les blocs d\\'instructions.'
    }
  },
  {
    id: 'variables', icon: '📦', category: 'Chapitre 2', title: 'Variables et Types',
    tag: 'Débutant',
    content: `
      <p>Une variable est une zone de la mémoire où l\\'on stocke une valeur. En Python, l\\'affectation se fait avec le signe <code>=</code>.</p>
      <h3>Types de base</h3>
      <ul>
        <li><strong>Entiers (int)</strong> : 1, 42, -5</li>
        <li><strong>Flottants (float)</strong> : 3.14, -0.001</li>
        <li><strong>Chaînes (str)</strong> : "Texte", \\'Bonjour\\'</li>
        <li><strong>Booléens (bool)</strong> : True, False</li>
      </ul>
      <p>La fonction <code>type()</code> permet de connaître le type d\\'une variable.</p>
    `,
    code: `x = 42          # int\\npi = 3.1415     # float\\nnom = "Alice"   # str\\nvrai = True     # bool\\n\\nprint(type(pi)) # <class 'float'>`,
    sandbox: `a = 10\\nb = 3.5\\ntotal = a + b\\nprint("Le total est", total)\\nprint(type(total))`,
    quiz: {
      question: 'Quel est le type de la variable x = "42" ?',
      options: ['int', 'float', 'str', 'bool'],
      correct: 2,
      explain: 'Les guillemets indiquent une chaîne de caractères (string ou str), même si elle contient des chiffres.'
    }
  },
  {
    id: 'affichage', icon: '🖨️', category: 'Chapitre 3', title: 'Affichage (print) & F-strings',
    tag: 'Débutant',
    content: `
      <p>La fonction <code>print()</code> permet d\\'afficher du texte et le contenu des variables.</p>
      <h3>Formatage moderne (f-strings)</h3>
      <p>Depuis Python 3.6, les f-strings (format strings) sont la méthode recommandée pour insérer des variables dans du texte. Il suffit de placer un <code>f</code> avant les guillemets et de mettre les variables entre accolades <code>{}</code>.</p>
    `,
    code: `age = 25\\nnom = "Bob"\\n\\n# Méthode classique\\nprint("Il s'appelle", nom, "et a", age, "ans.")\\n\\n# F-String (Recommandé)\\nprint(f"Il s'appelle {nom} et a {age} ans.")`,
    sandbox: `langage = "Python"\\nannee = 1991\\n# Utilisez une f-string pour afficher : "Python a été créé en 1991"\\nprint(f"A COMPLETER")`,
    quiz: {
      question: 'Quelle est la syntaxe correcte pour une f-string ?',
      options: ['print("Nom: {nom}")', 'print(f"Nom: {nom}")', 'print("Nom: %s" % nom)', 'print("Nom: " + {nom})'],
      correct: 1,
      explain: 'Le préfixe f avant les guillemets permet à Python d\\'évaluer les variables entre {accolades}.'
    }
  },
  {
    id: 'listes', icon: '🗂️', category: 'Chapitre 4', title: 'Les Listes',
    tag: 'Intermédiaire',
    content: `
      <p>Les listes stockent des collections d\\'éléments. Elles sont définies par des crochets <code>[]</code>.</p>
      <h3>Opérations courantes</h3>
      <ul>
        <li><strong>Indices</strong> : le 1er élément est à l\\'indice 0 (<code>liste[0]</code>).</li>
        <li><strong>Tranches (Slicing)</strong> : <code>liste[0:2]</code> extrait du 1er au 2ème élément.</li>
        <li><strong>Ajouter</strong> : <code>liste.append(element)</code> ajoute à la fin.</li>
        <li><strong>Taille</strong> : <code>len(liste)</code> donne le nombre d\\'éléments.</li>
      </ul>
    `,
    code: `animaux = ["chat", "chien", "oiseau"]\\n\\nprint(animaux[0])   # chat\\nprint(animaux[-1])  # oiseau (dernier)\\n\\nanimaux.append("poisson")\\nprint(len(animaux)) # 4`,
    sandbox: `nombres = [10, 20, 30]\\n# Ajoutez 40 à la liste et affichez le premier élément\\n\\nprint(nombres)`,
    quiz: {
      question: 'Que renvoie ma_liste[-1] ?',
      options: ['Une erreur', 'Le premier élément', 'Le dernier élément', 'L\\'avant-dernier élément'],
      correct: 2,
      explain: 'L\\'index -1 est un raccourci très pratique en Python pour accéder au tout dernier élément de la liste.'
    }
  },
  {
    id: 'boucles', icon: '🔄', category: 'Chapitre 5', title: 'Les Boucles (for et while)',
    tag: 'Intermédiaire',
    content: `
      <p>Les boucles répètent un bloc d\\'instructions.</p>
      <h3>La boucle for</h3>
      <p>Elle parcourt les éléments d\\'une séquence (comme une liste). On l\\'utilise souvent avec <code>range(n)</code> pour répéter n fois.</p>
      <h3>La boucle while</h3>
      <p>Elle s\\'exécute "tant que" la condition est True.</p>
    `,
    code: `for i in range(3):\\n    print(i) # Affiche 0, 1, 2\\n\\nfruits = ["pomme", "poire"]\\nfor f in fruits:\\n    print(f)\\n\\nx = 0\\nwhile x < 2:\\n    print("x vaut", x)\\n    x += 1`,
    sandbox: `for i in range(5):\\n    print(f"Ligne {i}")`,
    quiz: {
      question: 'Quelles valeurs génère range(1, 4) ?',
      options: ['1, 2, 3, 4', '0, 1, 2, 3', '1, 2, 3', '2, 3, 4'],
      correct: 2,
      explain: 'range(début, fin_exclue) commence à "début" et s\\'arrête juste AVANT "fin_exclue".'
    }
  },
  {
    id: 'tests', icon: '🔀', category: 'Chapitre 6', title: 'Tests et Conditions (if)',
    tag: 'Intermédiaire',
    content: `
      <p>Les structures conditionnelles permettent de prendre des décisions.</p>
      <h3>Syntaxe (if, elif, else)</h3>
      <p>L\\'indentation est vitale ici pour délimiter chaque bloc.</p>
      <h3>Opérateurs logiques</h3>
      <p>On utilise <code>and</code> (ET), <code>or</code> (OU) et <code>not</code> (NON).</p>
    `,
    code: `note = 14\\n\\nif note >= 16:\\n    print("Très bien")\\nelif note >= 12:\\n    print("Assez bien")\\nelse:\\n    print("Insuffisant")\\n\\n# Conditions multiples\\nif note > 10 and note < 15:\\n    print("Dans la moyenne")`,
    sandbox: `age = 20\\nmajeur = True\\n\\nif age >= 18 and majeur:\\n    print("Accès autorisé")\\nelse:\\n    print("Accès refusé")`,
    quiz: {
      question: 'Quel est l\\'opérateur pour "OU logique" en Python ?',
      options: ['||', 'OR', 'or', '|'],
      correct: 2,
      explain: 'Python utilise le mot-clé explicite en minuscules `or` (et `and` pour ET).'
    }
  },
  {
    id: 'fichiers', icon: '📁', category: 'Chapitre 7', title: 'Lecture & Écriture de Fichiers',
    tag: 'Avancé',
    content: `
      <p>Python interagit facilement avec le système de fichiers.</p>
      <h3>Le gestionnaire de contexte (with)</h3>
      <p>Il est recommandé d\\'utiliser <code>with open("fichier", "mode") as f:</code> car cela ferme le fichier automatiquement à la fin du bloc, même en cas d\\'erreur.</p>
      <ul>
        <li><strong>Mode "r"</strong> : Lecture (read)</li>
        <li><strong>Mode "w"</strong> : Écriture (write, écrase)</li>
        <li><strong>Mode "a"</strong> : Ajout (append)</li>
      </ul>
    `,
    code: `# Écriture\\nwith open("test.txt", "w") as f:\\n    f.write("Ligne 1\\n")\\n\\n# Lecture\\nwith open("test.txt", "r") as f:\\n    lignes = f.readlines()\\n    for l in lignes:\\n        print(l.strip())`,
    sandbox: `print("Les fichiers locaux ne sont pas supportés dans cette simulation, mais c\\'est l\\'endroit idéal pour essayer read() !")\\ndata = "simulated_data"\\nprint(data)`,
    quiz: {
      question: 'Quel est l\\'avantage de "with open(...) as f:" ?',
      options: ['C\\'est plus rapide', 'Ça ferme automatiquement le fichier à la fin', 'Ça lit tout le fichier d\\'un coup', 'Ça compresse le fichier'],
      correct: 1,
      explain: 'Le mot-clé with (gestionnaire de contexte) s\\'assure que f.close() est appelé de façon invisible une fois le bloc terminé.'
    }
  },
  {
    id: 'dictionnaires', icon: '📕', category: 'Chapitre 8', title: 'Dictionnaires et Tuples',
    tag: 'Intermédiaire',
    content: `
      <p>En plus des listes, Python a d\\'autres structures de données fondamentales.</p>
      <h3>Dictionnaires (dict)</h3>
      <p>Ils stockent des associations <strong>Clé : Valeur</strong>. Utilisent les accolades <code>{}</code>.</p>
      <h3>Tuples</h3>
      <p>Similaires aux listes, mais <strong>immuables</strong> (on ne peut plus les modifier une fois créés). Utilisent des parenthèses <code>()</code>.</p>
    `,
    code: `# Dictionnaire\\nuser = {\\n    "nom": "Alice",\\n    "age": 25\\n}\\nprint(user["nom"]) # Alice\\nuser["ville"] = "Paris"\\n\\n# Tuple\\ncoordonnees = (48.85, 2.35)\\nprint(coordonnees[0])\\n# coordonnees[0] = 50.0  <- ERREUR!`,
    sandbox: `inventaire = { "pommes": 10, "poires": 5 }\\nprint(inventaire.keys())\\nprint(inventaire.values())`,
    quiz: {
      question: 'Quelle est la particularité d\\'un Tuple par rapport à une Liste ?',
      options: ['Il ne contient que des nombres', 'Il est limité à 2 éléments', 'Il est immuable (non modifiable)', 'Il demande moins de mémoire mais est plus lent'],
      correct: 2,
      explain: 'Contrairement aux listes [], les tuples () ne supportent pas l\\'ajout, la modification ou la suppression de leurs éléments.'
    }
  },
  {
    id: 'fonctions', icon: '⚙️', category: 'Chapitre 9', title: 'Les Fonctions (def)',
    tag: 'Intermédiaire',
    content: `
      <p>Les fonctions regroupent du code réutilisable. Elles sont définies par le mot-clé <code>def</code>.</p>
      <h3>Arguments et Retour</h3>
      <p>Une fonction peut accepter des paramètres (avec ou sans valeurs par défaut) et renvoyer un résultat avec <code>return</code>.</p>
    `,
    code: `def addition(a, b=10):\\n    return a + b\\n\\nres1 = addition(5, 5) # 10\\nres2 = addition(5)    # 15 (utilise le défaut)\\nprint(f"Résultats: {res1}, {res2}")`,
    sandbox: `def au_carre(x):\\n    return x ** 2\\n\\nprint("Le carré de 7 est :", au_carre(7))`,
    quiz: {
      question: 'Quel mot-clé est utilisé pour renvoyer une valeur hors de la fonction ?',
      options: ['yield', 'export', 'output', 'return'],
      correct: 3,
      explain: 'Le mot-clé return interrompt la fonction et renvoie la valeur spécifiée.'
    }
  },
  {
    id: 'modules', icon: '🧩', category: 'Chapitre 10', title: 'Modules et Importations',
    tag: 'Avancé',
    content: `
      <p>Un module est un fichier contenant du code Python que vous pouvez utiliser dans votre propre code. L\\'écosystème Python (stdlib) est riche en modules intégrés (math, random, os, datetime...)</p>
      <h3>Différentes syntaxes</h3>
      <ul>
        <li><code>import math</code> : importe tout le module math (on utilise <code>math.sqrt()</code>)</li>
        <li><code>from random import randint</code> : importe juste la fonction ciblée</li>
      </ul>
    `,
    code: `import math\\nprint(math.pi) # 3.14159...\\n\\nfrom random import randint\\n# Un dé à 6 faces\\nde = randint(1, 6)\\nprint("Jet de dé :", de)`,
    sandbox: `import math\\nprint("Racine carrée de 16 :", math.sqrt(16))`,
    quiz: {
      question: 'Comment importer uniquement la fonction "sqrt" du module "math" ?',
      options: ['import sqrt from math', 'from math import sqrt', 'include math.sqrt', 'import math(sqrt)'],
      correct: 1,
      explain: 'La syntaxe pour une importation sélective est "from [module] import [fonction]".'
    }
  }
];"""

    cheatData = """const cheatData = [
  { title: 'Variables', code: `a = 5         # int\\nb = 3.2       # float\\nc = "Texte"   # str\\nd = False     # bool` },
  { title: 'Affichage & f-string', code: `print("Bonjour")\\nnom = "Max"\\nprint(f"Hello {nom}")` },
  { title: 'Opérateurs', code: `x + y, x - y\\nx * y, x / y\\nx ** 2  # Puissance\\nx % 2   # Modulo` },
  { title: 'Conditions', code: `if x > 10:\\n  print("Grand")\\nelif x == 10:\\n  print("Egal")\\nelse:\\n  print("Petit")` },
  { title: 'Boucles', code: `# For (0 à 4)\\nfor i in range(5):\\n  print(i)\\n\\n# While\\nwhile x > 0:\\n  x -= 1` },
  { title: 'Listes', code: `L = [1, 2, 3]\\nL.append(4)\\nL[0] = 99\\nL[1:3] # Tranche` },
  { title: 'Dictionnaires', code: `D = {"cle": "val"}\\nD["new"] = 42\\nprint(D.keys())` },
  { title: 'Fonctions', code: `def calc(a, b=0):\\n  return a + b` },
  { title: 'Fichiers', code: `with open("f.txt", "w") as f:\\n  f.write("OK")` },
  { title: 'Modules', code: `import math\\nfrom random import choice` }
];"""

    quickQuizzes = """const quickQuizzes = [
  { q: 'Qui a créé le langage Python ?', opts: ['Linus Torvalds', 'Guido van Rossum', 'Brendan Eich', 'Dennis Ritchie'], ans: 1 },
  { q: 'Comment définir un bloc de code (une condition ou une boucle) en Python ?', opts: ['Avec des accolades {}', 'Avec des balises < >', 'Avec l\\'indentation', 'Avec Begin/End'], ans: 2 },
  { q: 'Quelle méthode ajoute un élément à la fin d\\'une liste ?', opts: ['add()', 'push()', 'insert()', 'append()'], ans: 3 },
  { q: 'Quelle est la bonne façon d\\'utiliser une f-string ?', opts: ['f"Bonjour {nom}"', '"Bonjour {nom}".f()', 'f("Bonjour {nom}")', '"Bonjour f{nom}"'], ans: 0 },
  { q: 'Que fait "import math" ?', opts: ['Affiche des maths', 'Importe le module mathématique', 'Crée une variable math', 'Rien'], ans: 1 }
];"""

    content = re.sub(r'const lessons = \[[\s\S]*?(?=\nconst cheatData)', lessons, content, count=1)
    content = re.sub(r'const cheatData = \[[\s\S]*?(?=\nconst quickQuizzes)', cheatData, content, count=1)
    content = re.sub(r'const quickQuizzes = \[[\s\S]*?(?=\n// ===== STATE =====)', quickQuizzes, content, count=1)

    with open('apprendre-python-app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    expand_python_app()
    print("Mise à jour détaillée du cours Python réussie : 10 chapitres !")
