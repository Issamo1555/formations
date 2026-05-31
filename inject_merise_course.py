import re
import shutil

def generate_merise_app():
    # Start from an existing template, such as apprendre-php-app.html
    shutil.copyfile('apprendre-php-app.html', 'apprendre-merise-app.html')

    with open('apprendre-merise-app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Generic Replacements for Title and Theme
    content = content.replace('<title>Apprendre PHP — Interactif</title>', '<title>Apprendre MERISE — Interactif</title>')
    content = content.replace('<div class="logo"><span>&lt;</span>PHP<span>/&gt;</span> <em>Apprendre</em></div>', '<div class="logo"><span>[</span>MERISE<span>]</span> <em>Apprendre</em></div>')
    content = content.replace('<h1>Maîtriser PHP<br>pas à pas</h1>', '<h1>Maîtriser MERISE<br>pas à pas</h1>')
    content = content.replace('<p>Cours interactifs · Exercices pratiques · Quiz intégrés</p>', '<p>Base de données · Conceptualisation · Modélisation</p>')
    content = content.replace('Aide-mémoire PHP', 'Aide-mémoire MERISE')
    content = content.replace('Testez vos connaissances PHP', 'Testez vos connaissances MERISE')
    content = content.replace("parcours d'apprentissage PHP", "parcours d'apprentissage MERISE")

    lessons = """const lessons = [
  {
    id: 'intro', icon: '📊', category: 'Chapitre 1', title: 'Introduction à MERISE',
    tag: 'Débutant',
    content: `
      <p><strong>MERISE</strong> (Méthode d\\'Étude et de Réalisation Informatique pour les Systèmes d\\'Entreprise) est une méthode utilisée pour concevoir des bases de données et des systèmes d\\'information.</p>
      <h3>La séparation en 3 niveaux</h3>
      <p>MERISE sépare toujours les <strong>données</strong> (comment elles sont structurées) des <strong>traitements</strong> (ce qu\\'on en fait), à chaque niveau :</p>
      <ul>
        <li><strong>Conceptuel (quoi ?)</strong> : La réalité métier sans se soucier de la technique.</li>
        <li><strong>Logique / Organisationnel (comment ?)</strong> : L\\'organisation des données et qui fait quoi.</li>
        <li><strong>Physique (avec quoi ?)</strong> : L\\'implémentation réelle sur la machine (SGBD).</li>
      </ul>
    `,
    code: `// Flux global MERISE\\n[Conceptuel (MCD / MCT)]\\n       ↓\\n[Logique (MLD / MOT)]\\n       ↓\\n[Physique (MPD)]`,
    sandbox: `// MERISE se concentre sur l'organisation de l'information.\\n// Observer le cheminement : Quoi -> Comment -> Avec quoi.\\n`,
    quiz: {
      question: 'Quels sont les 3 niveaux de conception de la méthode MERISE ?',
      options: ['Front, Back, Data', 'Conceptuel, Logique, Physique', 'MCD, MLD, MPD', 'Planification, Création, Test'],
      correct: 1,
      explain: 'MERISE repose sur trois niveaux d\\'abstraction : Conceptuel, Logique/Organisationnel, et Physique.'
    }
  },
  {
    id: 'niveaux', icon: '📐', category: 'Chapitre 1', title: 'Les Modèles par Niveau',
    tag: 'Débutant',
    content: `
      <p>A chaque niveau, on crée des modèles distincts pour les <strong>Données</strong> et les <strong>Traitements</strong>.</p>
      <h3>Niveau Conceptuel</h3>
      <ul>
        <li><strong>MCD</strong> (Modèle Conceptuel des Données)</li>
        <li><strong>MCT</strong> (Modèle Conceptuel des Traitements)</li>
      </ul>
      <h3>Niveau Logique / Organisationnel</h3>
      <ul>
        <li><strong>MLD</strong> (Modèle Logique des Données) : souvent des tables relationnelles.</li>
        <li><strong>MOT</strong> (Modèle Organisationnel des Traitements)</li>
      </ul>
      <h3>Niveau Physique</h3>
      <ul>
        <li><strong>MPD</strong> (Modèle Physique des Données) : choix du SGBD, SQL, index...</li>
      </ul>
    `,
    code: `// Correspondances\\nDonnées : MCD -> MLD -> MPD\\nTraité :  MCT -> MOT -> (Code/Logiciel)`,
    sandbox: `// Imaginez que vous listez un besoin Client.\\n// Le MCD dessinera les entités, le MLD donnera les tables,\\n// et le MPD donnera les CREATE TABLE SQL.`,
    quiz: {
      question: 'Quel modèle correspond à la conception Logique des Données ?',
      options: ['MCD', 'MCT', 'MLD', 'MPD'],
      correct: 2,
      explain: 'Le Modèle Logique des Données (MLD) se situe au niveau Logique.'
    }
  },
  {
    id: 'dico', icon: '📖', category: 'Chapitre 2', title: 'Dictionnaire de données',
    tag: 'Débutant',
    content: `
      <p>Le <strong>Dictionnaire de données</strong> est une étape préalable primordiale. C\\'est un tableau recensant chaque donnée du système.</p>
      <h3>Que contient-il ?</h3>
      <p>Il définit rigoureusement toutes les informations à traiter :</p>
      <ul>
        <li><strong>Nom de la propriété</strong> (ex: ref_produit, nom_client)</li>
        <li><strong>Type d\\'information</strong> (texte, numérique, date...)</li>
        <li><strong>Taille</strong> (nombre de caractères maximum)</li>
        <li><strong>Contraintes ou Remarques</strong> (ex: Unique, Clé primaire, etc.)</li>
      </ul>
    `,
    code: `// Extrait d'un Dictionnaire de Données\\nNom       | Code         | Type | Taille | Remarques\\n----------------------------------------------------\\nRéférence | ref_produit  | AN   | 10     | Identifiant\\nLibellé   | lib_produit  | AN   | 50     | \\nPrix unitaire| prix_ht   | DEC  | 8,2    |`,
    sandbox: `{"dico": [\\n  {"code": "id_client", "type": "Numérique", "taille": 11, "remarque": "Identifiant"}\\n]}`,
    quiz: {
      question: 'À quoi sert le dictionnaire de données ?',
      options: ['A traduire l\\'application en plusieurs langues', 'À lister et définir avec précision chaque donnée du système', 'A écrire des algorithmes complexes', 'A générer des rapports'],
      correct: 1,
      explain: 'C\\'est l\\'inventaire exhaustif des propriétés qui seront modélisées dans le MCD.'
    }
  },
  {
    id: 'types_info', icon: '🔠', category: 'Chapitre 2', title: 'Types d\\'informations',
    tag: 'Intermédiaire',
    content: `
      <p>En MERISE, on classe généralement les données selon <strong>6 grands types</strong> :</p>
      <ul>
        <li><strong>Numérique</strong> : Nombres entiers utiles aux calculs.</li>
        <li><strong>Alphanumérique</strong> : Texte court, codes (ex: numéro de téléphone, immatriculation).</li>
        <li><strong>Date / Heure</strong></li>
        <li><strong>Booléen</strong> : Vrai/Faux.</li>
        <li><strong>Texte long</strong> : Description détaillée.</li>
        <li><strong>Décimal / Monétaire</strong> : Pour les prix, poids.</li>
      </ul>
      <p><em>Attention :</em> On distingue les données "élémentaires" (à stocker) des données "calculées" (ex: Total de la commande), que l\\'on ne garde pas dans le dictionnaire de base.</p>
    `,
    code: `// Exemples de règles MERISE\\n- Un Code Postal est Alphanumérique (car on ne l'ajoute pas, et il peut y avoir un zéro devant, ou "2A" en Corse).\\n- Un prix est un Décimal.`,
    sandbox: `// Définissez le type pour le numéro de Sécurité Sociale :\\n// Numérique ou Alphanumérique ?\\n// Réponse : Alphanumérique ! (Peut contenir 'A' ou 'B' pour la Corse)`,
    quiz: {
      question: 'Quel est le type recommandé pour un numéro de téléphone en MERISE ?',
      options: ['Numérique', 'Monétaire', 'Booléen', 'Alphanumérique'],
      correct: 3,
      explain: 'Bien que composé de chiffres, un numéro de téléphone ne sert pas pour des calculs et commence souvent par zero. Il doit être stocké en Alphanumérique.'
    }
  },
  {
    id: 'dependances', icon: '🔗', category: 'Chapitre 3', title: 'Dépendances fonctionnelles (DF)',
    tag: 'Avancé',
    content: `
      <p>Avant le MCD, on construit parfois un <strong>Graphe de Dépendances Fonctionnelles</strong>. Il permet d\\'identifier qui "détermine" qui.</p>
      <h3>Le concept</h3>
      <p>On dit que A → B (A détermine B ou B dépend de A), si en connaissant A, on a une SEULE valeur possible pour B.</p>
      <p>Exemple : <code>num_client → nom_client</code>.</p>
      <h3>DF Concaténée</h3>
      <p>Parfois, une donnée a besoin de plusieurs éléments combinés pour être déterminée.<br>
      Ex: La quantité commandée dépend du numéro de la commande ET de la ref. du produit : <code>(num_commande + ref_produit) → quantite</code>.</p>
    `,
    code: `[num_client] ──────→ [nom_client]\\n[num_commande] ────→ [date_commande]\\n\\n[num_commande]\\n      +        ──> [quantite]\\n[ref_produit]` ,
    sandbox: `// Essayez de voir d'autres dépendances fonctionnelles.\\n// Le matricule d'un employé détermine son nom et prénom :\\n// matricule -> nom, prénom`,
    quiz: {
      question: 'Si A → B, cela signifie que...',
      options: ['Connaissant B, je peux deviner A', 'A et B sont toujours égaux', 'À chaque valeur de A correspond au plus une seule valeur de B', 'B est une donnée cryptée'],
      correct: 2,
      explain: 'La dépendance A → B signifie que A (la source) détermine de manière unique B (la cible).'
    }
  },
  {
    id: 'mcd', icon: '🛠️', category: 'Chapitre 4', title: 'Comprendre le MCD',
    tag: 'Avancé',
    content: `
      <p>Le <strong>Modèle Conceptuel des Données (MCD)</strong> est la représentation graphique principale de l\\'information.</p>
      <h3>Entités et Associations</h3>
      <ul>
        <li><strong>Entités (Rectangles)</strong> : Objets principaux avec un identifiant fort (ex: Client, Produit).</li>
        <li><strong>Associations (Ellipses)</strong> : Liens entre les entités (ex: ACHETER, CONTIENT).</li>
        <li><strong>Attributs</strong> : Propriétés attachées à l\\'entité ou à l\\'association.</li>
      </ul>
      <p>La donnée <code>quantite</code> apparaîtra souvent comme attribut <strong>porté par</strong> l\\'association (ex: CONTIENT), car elle dépend de la commande ET du produit !</p>
    `,
    code: `+------------+       (ACHETER)       +---------------+\\n|   CLIENT   |-------(       )-------|    PRODUIT    |\\n+------------+ 1,n           0,n +---------------+\\n| num_client |                       | ref_produit   |\\n| nom_cient  |                       | libelle       |\\n+------------+                       +---------------+`,
    sandbox: `// Identifiez l'erreur dans la phrase suivante : \\n// "La quantité est une propriété de l'entité Produit" \\n// Résultat : Faux, elle dépend de la commande et du produit (association portée).`,
    quiz: {
      question: 'Comment représente-t-on une entité dans un MCD ?',
      options: ['Un losange', 'Un rectangle', 'Une ellipse', 'Une flèche'],
      correct: 1,
      explain: 'Les entités sont dessinées sous forme de rectangles, tandis que les relations (associations) sont traditionnellement dans des ellipses.'
    }
  }
];"""

    cheatData = """const cheatData = [
  { title: 'Niveaux MERISE', code: `Conceptuel (Quoi)\\nLogique (Comment)\\nPhysique (Avec Quoi)` },
  { title: 'MCD (Modèle Conceptuel)', code: `Entités : Rectangles\\nRelation/Assoc. : Ellipses\\nIdentifiant souligné` },
  { title: 'MLD (Modèle Logique)', code: `Les entités -> Tables\\nLes relations (*,n) -> Tables de liaison (Clés étrangères)` },
  { title: 'Dictionnaire', code: `Liste exhausive des propriétés.\\nTypes: AlphaNum, Num, Date, Bool, Deci...` },
  { title: 'Dépendance simple', code: `A → B (ex: id_facture → date_facture)` },
  { title: 'Dépendance concaténée', code: `(A + B) → C (ex: id_facture + ref_produit → qte_livree)` },
];"""

    quickQuizzes = """const quickQuizzes = [
  { q: 'Que signifie le \'C\' dans MCD et MCT ?', opts: ['Calculé', 'Complet', 'Conceptuel', 'Central'], ans: 2 },
  { q: 'Si j\\'ai 1 association n:n entre Client et Produit, où va se loger l\\'attribut de Quantité Achetée ?', opts: ['Dans Produit', 'Sur l\\'association elle-même', 'Dans Client', 'Nulle part'], ans: 1 },
  { q: 'Que sépare la méthode MERISE tout au long de sa conception ?', opts: ['Les serveurs Cloud des bases locales', 'Le Web et le Mobile', 'Les Données d\\'un côté, et les Traitements de l\\'autre', 'Les Clients et les Fournisseurs'], ans: 2 },
  { q: 'La taille d\\'une donnée (ex: 50 caractères) se trouve dans :', opts: ['Le MCT', 'Le Dictionnaire de données', 'Le Diagramme des flux', 'Le Motif'], ans: 1 },
  { q: 'Lequel de ces modèles contient la syntaxe SQL (varchar, int...) ?', opts: ['MCD', 'MLD', 'MPD', 'MOT'], ans: 2 }
];"""

    content = re.sub(r'const lessons = \[[\s\S]*?(?=\nconst cheatData)', lessons, content, count=1)
    content = re.sub(r'const cheatData = \[[\s\S]*?(?=\nconst quickQuizzes)', cheatData, content, count=1)
    content = re.sub(r'const quickQuizzes = \[[\s\S]*?(?=\n// ===== STATE =====)', quickQuizzes, content, count=1)

    with open('apprendre-merise-app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    generate_merise_app()
    print("Mise à jour réussie : Le cours MERISE est généré.")
