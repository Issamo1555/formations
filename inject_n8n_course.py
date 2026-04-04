import re

def expand_n8n_app():
    with open('apprendre-n8n-app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    lessons = """const lessons = [
  {
    id: 'intro', icon: '🚀', category: 'Chapitre 1', title: 'Introduction à n8n (Zero to Hero)',
    tag: 'Débutant',
    content: `
      <p>Bienvenue dans ce cours basé sur le célèbre tutoriel <em>Zero to Hero</em>. n8n est une plateforme d\\'automatisation des flux de travail (workflows) nouvelle génération, conçue pour les développeurs et les "makers".</p>
      <h3>Pourquoi n8n se démarque ?</h3>
      <ul>
        <li><strong>Open-Ecosystem & Fair-code</strong> : Vous pouvez l\\'héberger vous-même gratuitement ou utiliser le Cloud.</li>
        <li><strong>Données JSON natives</strong> : Tout ce qui circule entre les étapes est du JSON brut, facile à manipuler.</li>
        <li><strong>Nœud Code (JavaScript)</strong> : Dès qu\\'une limite est atteinte, vous pouvez coder en JS.</li>
      </ul>
    `,
    code: `// Chaque donnée est une liste d'objets JSON (Items)\\n[\\n  {\\n    "json": {\\n      "message": "Bienvenue dans n8n !"\\n    }\\n  }\\n]`,
    sandbox: `{\\n  "bienvenue": "Testez la donnée JSON ici",\\n  "version": "1.0"\\n}`,
    quiz: {
      question: 'Quel format de données est utilisé par défaut entre tous les nœuds de n8n ?',
      options: ['XML', 'YAML', 'JSON', 'Texte Brut'],
      correct: 2,
      explain: 'Le format JSON (JavaScript Object Notation) est la lingua franca absolue de n8n. Tout nœud reçoit et produit du JSON.'
    }
  },
  {
    id: 'nodes_workflows', icon: '🔗', category: 'Chapitre 2', title: 'Workflows & Nodes',
    tag: 'Débutant',
    content: `
      <p>Un <strong>Workflow</strong> (flux de travail) est composé de plusieurs <strong>Nodes</strong> (Nœuds) reliés par des fils.</p>
      <h3>La structure de base</h3>
      <ul>
        <li><strong>Trigger Nodes</strong> : Démarrent le workflow (ex: Schedule, Webhook, On Email). Il y en a toujours au moins un au lancement.</li>
        <li><strong>Action Nodes</strong> : Effectuent une action externe (ex: Créer une ligne Google Sheets, Envoyer un Slack).</li>
        <li><strong>Core Nodes</strong> : Manipulent la donnée interne (ex: Set, IF, Switch, Merge).</li>
      </ul>
    `,
    code: `// Flux conceptuel\\n[Webhook Trigger] -> [Set Node] -> [Slack Node]\\n\\n// Le Webhook reçoit les données, Set les formate, Slack les envoie.`,
    sandbox: `{\\n  "trigger": "Webhook reçu",\\n  "data": "Hello World"\\n}`,
    quiz: {
      question: 'Que fait un "Trigger Node" ?',
      options: ['Il met en pause le workflow', 'Il manipule la donnée', 'Il déclenche le démarrage automatique du workflow', 'Il renvoie une erreur'],
      correct: 2,
      explain: 'Un Trigger (déclencheur) attend un événement (ou une planification) pour instancier et démarrer automatiquement un workflow.'
    }
  },
  {
    id: 'webhooks', icon: '🌐', category: 'Chapitre 3', title: 'Le Trigger Webhook',
    tag: 'Débutant',
    content: `
      <p>Le <strong>Webhook</strong> est le Trigger le plus essentiel dans n8n. Il crée une URL unique sur laquelle n8n "écoute" l\\'arrivée de données.</p>
      <h3>Tests vs Production</h3>
      <p>n8n fournit deux URLs par Webhook :</p>
      <ul>
        <li><strong>Test URL</strong> : Active uniquement avec le workflow ouvert sur votre écran, affiche les données en temps réel pour tester.</li>
        <li><strong>Production URL</strong> : Active de façon permanente une fois le workflow activé.</li>
      </ul>
    `,
    code: `// Exemple de requête POST vers n8n\\nPOST https://votre-n8n.com/webhook/12345\\nContent-Type: application/json\\n\\n{\\n  "client": "Alice",\\n  "action": "Achat"\\n}`,
    sandbox: `{\\n  "client": "Bob",\\n  "action": "Inscription",\\n  "source": "Site Web"\\n}`,
    quiz: {
      question: 'À quoi sert la "Test URL" d\\'un Webhook n8n ?',
      options: ['À recevoir des appels en continu 24h/24', 'À tester la construction d\\'un workflow en récupérant des données immédiates', 'À contourner la sécurité', 'À facturer les API'],
      correct: 1,
      explain: 'La Test URL est temporaire et sert uniquement pour capter des données d\\'essai pendant que vous construisez le workflow dans l\\'éditeur.'
    }
  },
  {
    id: 'set_node', icon: '📝', category: 'Chapitre 4', title: 'Node Set et Expressions',
    tag: 'Intermédiaire',
    content: `
      <p>Le <strong>Set Node</strong> est le couteau suisse pour définir de nouvelles valeurs ou en modifier des existantes.</p>
      <h3>Expressions dynamiques</h3>
      <p>Au lieu d\\'un texte fixe, vous pouvez utiliser les doubles accolades <code>{{ }}</code> pour récupérer des données dynamiques du nœud précédent.</p>
      <ul>
        <li><code>{{ $json.email }}</code> -> la clé email du nœud.</li>
        <li><code>{{ $now }}</code> -> la date et heure actuelle (format Luxon).</li>
      </ul>
    `,
    code: `// Dans un champ du "Set Node" :\\nBonjour {{ $json.prenom }}, il est {{ $now.toFormat('HH:mm') }}.\\n\\n// Résultat généré automatiquement :\\nBonjour Alice, il est 14:30.`,
    sandbox: `{\\n  "prenom": "Charlie",\\n  "expression": "{{ $json.prenom }} a été traité."\\n}`,
    quiz: {
      question: 'Comment accède-t-on à la clé "total" du JSON reçu ?',
      options: ['json.total', '{{ $json.total }}', '{ json.total }', '<json.total>'],
      correct: 1,
      explain: 'La syntaxe standard des expressions n8n utilise {{ }} et référence toujours la donnée courante via la variable $json.'
    }
  },
  {
    id: 'core_logic', icon: '🔀', category: 'Chapitre 5', title: 'Logique : IF et Switch',
    tag: 'Intermédiaire',
    content: `
      <p>n8n permet de créer des embranchements selon la donnée reçue (Routesnement conditionnel).</p>
      <h3>IF Node</h3>
      <p>Compare deux valeurs. Répartit les items en deux flux : <strong>True</strong> ou <strong>False</strong>.</p>
      <h3>Switch Node</h3>
      <p>Route un item vers plusieurs sorties possibles (0, 1, 2, 3) selon la valeur d\\'un champ. Parfait pour les choix multiples (Menu 1, Menu 2...).</p>
    `,
    code: `// Condition IF (Exemple : Score >= 10)\\nIF: {{ $json.score }} >= 10\\n  -> Sortie True : Envoie un e-mail de succès\\n  -> Sortie False : Envoie un rappel d'échec`,
    sandbox: `{\\n  "score": 15,\\n  "status": "Ceci irait vers True dans un nœud IF >= 10"\\n}`,
    quiz: {
      question: 'Lequel de ces nœuds est le plus adapté pour tester si un statut vaut "Nouveau", "En cours", "Terminé" ou "Archivé" ?',
      options: ['IF', 'Set', 'Switch', 'Code'],
      correct: 2,
      explain: 'Le Switch node permet de créer plusieurs routes spécifiques selon la valeur exacte du paramètre (Switch-case).'
    }
  },
  {
    id: 'http_request', icon: '📡', category: 'Chapitre 6', title: 'Le Node HTTP Request',
    tag: 'Intermédiaire',
    content: `
      <p>L\\'une des forces majeures de n8n. Le <strong>HTTP Request</strong> permet d\\'appeler n\\'importe quelle API du monde, même si n8n n\\'a pas de nœud officiel pour ce service.</p>
      <h3>C\\'est comme Postman ou cURL</h3>
      <ul>
        <li><strong>Method</strong> : GET, POST, PUT, DELETE...</li>
        <li><strong>URL</strong> : L\\'adresse de l\\'API.</li>
        <li><strong>Headers & Body</strong> : Utile pour s\\'authentifier et envoyer du JSON (POST).</li>
      </ul>
    `,
    code: `// Pour appeler une API météo\\nGET https://api.weatherapi.com/v1/current.json?q={{ $json.ville }}\\nHeaders: { "Authorization": "Bearer MON_TOKEN" }`,
    sandbox: `{\\n  "api_simulation": "Appel fictif réussi",\\n  "status_code": 200\\n}`,
    quiz: {
      question: 'À quoi sert le nœud HTTP Request ?',
      options: ['À héberger un site web', 'À effectuer des appels depuis n8n vers une API externe quelconque', 'À sécuriser la connexion n8n', 'À lire des fichiers locaux'],
      correct: 1,
      explain: 'Il agit comme le client HTTP de votre workflow, permettant des requêtes standardisées (GET/POST) vers n\\'importe quelle ressource web.'
    }
  },
  {
    id: 'lists_loops', icon: '📃', category: 'Chapitre 7', title: 'Item Lists et Boucles',
    tag: 'Avancé',
    content: `
      <p>Dans n8n, <strong>le cœur de l\\'exécution se fait Élément par Élément (Item).</strong> Si un nœud reçoit 10 items, il s\\'exécutera 10 fois automatiquement.</p>
      <h3>Scinder ou fusionner l\\'information</h3>
      <ul>
        <li><strong>Item Lists</strong> : Permet de séparer (Split) un gros tableau JSON en de multiples petits Items indépendants.</li>
        <li><strong>Merge Node</strong> : Attend que plusieurs branches se terminent pour regrouper les données d\\'une seule traite.</li>
      </ul>
      <p>Astuce : Le nœud <em>Loop (Split in Batches)</em> permet de faire des boucles chronométrées pour éviter de spammer une API (Rate Limits).</p>
    `,
    code: `// Donnée d'un API (1 seul Item contenant un grand tableau)\\n"utilisateurs": [ "Alice", "Bob", "Chloé" ]\\n\\n// Après Node Item Lists (Split Out) -> devient 3 Items !\\nItem 1: { "nom": "Alice" }\\nItem 2: { "nom": "Bob" }\\nItem 3: { "nom": "Chloé" }`,
    sandbox: `[\\n  { "nom": "A" },\\n  { "nom": "B" },\\n  { "nom": "C" }\\n]`,
    quiz: {
      question: 'Si un nœud Slack reçoit simultanément 3 Items, que se passe-t-il ?',
      options: ['Il plante en erreur', 'Il envoie 1 seul message avec les 3', 'Il s\\'exécute 3 fois, envoyant 3 messages distincts', 'Seul le premier passe'],
      correct: 2,
      explain: 'L\\'exécution automatique "par Item" est le fondement de n8n. Tout nœud qui reçoit plusieurs items s\\'exécute sur chacun d\\'eux séquentiellement.'
    }
  },
  {
    id: 'errors', icon: '🚨', category: 'Chapitre 8', title: 'Gestion des Erreurs',
    tag: 'Avancé',
    content: `
      <p>Lorsqu\\'une API plante (404), le workflow échoue. Il faut gérer cela habilement en production.</p>
      <h3>Continue On Fail</h3>
      <p>Dans les paramètres (Settings) de n\\'importe quel nœud, vous pouvez activer <em>"Continue On Fail"</em>. Si le nœud échoue, l\\"item" passe quand même au prochain nœud avec une propriété <code>"error"</code>.</p>
      <h3>Error Trigger Node</h3>
      <p>Un Trigger spécial que l\\'on place dans un sous-workflow de gestion. Il s\\'active automatiquement dès qu\\'un autre workflow de votre n8n échoue (très pratique pour vous notifier par e-mail ou Slack d\\'un plantage !)</p>
    `,
    code: `// Structure de la donnée si "Continue On Fail" est activé\\n{\\n  "ok": false,\\n  "error": "Timeout - API n'a pas répondu",\\n  "httpStatusCode": 504\\n}`,
    sandbox: `{\\n  "error": "Simulated Error 401 Authorized",\\n  "fallback": "On prépare un plan B"\\n}`,
    quiz: {
      question: 'Où se trouve l\\'option "Continue On Fail" ?',
      options: ['Dans un nœud IF dédié', 'Dans les paramètres avancés de chaque Nœud (engrenage)', 'Uniquement dans les workflows cloud', 'Il faut l\\'acheter'],
      correct: 1,
      explain: 'L\\'option est disponible dans l\\'onglet Settings de tous les nœuds, utile pour la résilience de vos processus !'
    }
  },
  {
    id: 'credentials', icon: '🔑', category: 'Chapitre 9', title: 'Authentification (Credentials)',
    tag: 'Débutant',
    content: `
      <p>Pour se connecter à Telegram, Google, etc., n8n vous demande des "Credentials" (Identifiants).</p>
      <h3>Sécurité</h3>
      <p>n8n stocke les Credentials de manière chiffrée. Une fois renseignés (ex: Clé API, OAuth2), ils sont stockés à part du workflow.</p>
      <p><strong>Avantage</strong> : Vous pouvez lier 10 workflows au même compte Gmail avec 1 seul Credential partagé. Et surtout, vous pouvez exporter le Workflow sans divulguer vos précieux mots de passe (seulement l\\'ID d\\'exportation de la clé est partagé).</p>
    `,
    code: `// Type d'authentification\\n- Header Auth (Clé API classique)\\n- OAuth2 (Page de connexion Google)\\n- Basic Auth (User/Password)`,
    sandbox: `{\\n  "auth_type": "OAuth2",\\n  "status": "Connecté à Google Drive"\\n}`,
    quiz: {
      question: 'Pourquoi les Credentials sont-ils détachés du fichier JSON du workflow ?',
      options: ['Pour ralentir n8n', 'Pour la sécurité (ex: exporter le workflow ne partage pas les mots de passe)', 'Car JSON ne gère pas les passwords', 'C\\'est faux, ils sont dans le workflow'],
      correct: 1,
      explain: 'Vos clés APIs sont très sensibles : les lier mais les stocker à part permet de partager votre workflow avec la communauté sans compromettre votre compte !'
    }
  },
  {
    id: 'code_node', icon: '💻', category: 'Chapitre 10', title: 'Le Node Code (JavaScript)',
    tag: 'Expert',
    content: `
      <p>La limite du No-code est très vite contournée via le <strong>Code Node</strong>. En y injectant quelques lignes de JavaScript (ou Python dans les versions récentes), vous pouvez reformater la data JSON reçue exactement comme vous le souhaitez, avant de la redonner au workflow.</p>
      <h3>Utilisation</h3>
      <ul>
        <li>S\\'abonne aux objets via <code>items</code> ou à l\\'item courant (ex: <code>$input.item.json</code>)</li>
        <li>Permet de faire des <code>.map()</code>, des mathématiques complexes, parser les dates, etc.</li>
      </ul>
    `,
    code: `// Code JS inséré dans un Code Node\\nfor (const item of $input.all()) {\\n  item.json.nouveau_champ = item.json.prix * 1.20; // TTC\\n  item.json.nom = item.json.nom.toUpperCase();\\n}\\nreturn $input.all();`,
    sandbox: `{\\n  "prix": 100,\\n  "commentaire": "Ajout du champ via node Code"\\n}`,
    quiz: {
      question: 'En quel langage programme-t-on nativement dans le Code Node de n8n ?',
      options: ['PHP', 'C#', 'JavaScript', 'Go'],
      correct: 2,
      explain: 'n8n étant construit sur NodeJS (JavaScript), son Code Node historique (et majoritairement utilisé) évalue directement du Vanilla JavaScript.'
    }
  }
];"""

    cheatData = """const cheatData = [
  { title: 'Expression JSON de base', code: `{{ $json.monChamp }}` },
  { title: 'Accès profond JSON', code: `{{ $json.commande.details[0].prix }}` },
  { title: 'Date et Heure', code: `{{ $now.toFormat('yyyy-MM-dd HH:mm') }}\\n{{ $now.plus({days: 1}) }}` },
  { title: 'Opérateur Ternaire (IF court)', code: `{{ $json.score >= 10 ? 'Reçu' : 'Refusé' }}` },
  { title: 'Nœud Code (JavaScript)', code: `const d = $input.item.json;\\nreturn { json: { total: d.qte * d.px } };` },
  { title: 'Types de Triggers', code: `Webhook (URL externe)\\nSchedule (Cron/Temporel)\\nOn App Event (Discord, Slack, Git...)` },
  { title: 'Gestion d\\'erreur n8n', code: `Activer "Continue On Fail" dans Node Settings\\nUtiliser Error Trigger Node` }
];"""

    quickQuizzes = """const quickQuizzes = [
  { q: 'Que signifie "Zero to Hero" ?', opts: ['Un super-héros n8n', 'De débutant à expert', 'Avoir 0 erreur', 'Un type de node'], ans: 1 },
  { q: 'Comment exécuter un nœud sur 1 seul Item s\\'il en reçoit 10 ?', opts: ['Mettre Delete Item', 'Settings > Execute Once', 'Utiliser IF', 'Couper le réseau'], ans: 1 },
  { q: 'Quel objet pointe sur la donnée courante ?', opts: ['$data', '$json', '$payload', '$item'], ans: 1 },
  { q: 'À quoi sert le nœud Merge ?', opts: ['Supprimer les doublons', 'Faire un appel HTTP', 'Rassembler deux flux parallèles en 1', 'Faire une boucle loop'], ans: 2 },
  { q: 'Qui peut héberger (host) n8n ?', opts: ['Seulement n8n Cloud', 'Uniquement Google Cloud', 'Tout le monde via Desktop ou Serveur Docker (C\\'est open-ecosystem !)', 'Les entreprises certifiées'], ans: 2 }
];"""

    content = re.sub(r'const lessons = \[[\s\S]*?(?=\nconst cheatData)', lessons, content, count=1)
    content = re.sub(r'const cheatData = \[[\s\S]*?(?=\nconst quickQuizzes)', cheatData, content, count=1)
    content = re.sub(r'const quickQuizzes = \[[\s\S]*?(?=\n// ===== STATE =====)', quickQuizzes, content, count=1)

    with open('apprendre-n8n-app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    expand_n8n_app()
    print("Mise à jour détaillée du cours n8n réussie : 10 chapitres !")
