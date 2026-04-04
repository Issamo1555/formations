import re
import os

def build_openclaw_app():
    # Copy from PHP app
    with open('apprendre-php-app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Colors
    # On choisit un thème AI Tech : Emerald (#10b981) et Slate Dark (#475569)
    content = content.replace('--php: #7c6df8;', '--php: #10b981;')
    content = content.replace('--php2: #a78bfa;', '--php2: #34d399;')
    
    # Texts
    content = content.replace('<title>Apprendre PHP — Interactif</title>', '<title>Apprendre OpenClaw — Interactif</title>')
    content = content.replace('<span>&lt;</span>PHP<span>/&gt;</span>', '<span>[</span>OpenClaw<span>]</span>')
    content = content.replace('Maîtriser PHP<br>pas à pas', 'Maîtriser OpenClaw<br>Votre Assistant IA')
    content = content.replace('Testez vos connaissances PHP', 'Testez vos connaissances sur OpenClaw')
    content = content.replace('Apprendre PHP —', 'Apprendre OpenClaw —')
    content = content.replace('Développement Web avec PHP', "Maîtrise de l'IA OpenClaw")
    content = content.replace('formation PHP complète', 'formation OpenClaw complète')
    content = content.replace("const certId='PHP-'", "const certId='OCLW-'")
    content = content.replace('<span class="code-lang">PHP</span>', '<span class="code-lang">CLI</span>')
    content = content.replace('Éditeur PHP Simulé', 'Terminal OpenClaw Simulé')
    content = content.replace('Aide-mémoire PHP', 'Aide-mémoire OpenClaw')
    content = content.replace("parcours d'apprentissage PHP", "parcours d'apprentissage OpenClaw")
    content = content.replace('certificat-php-', 'certificat-openclaw-')
    content = content.replace('<?php  />', 'OpenClaw Agent')
    content = content.replace('simulatePHP', 'simulateOpenClaw')

    # Lessons
    lessons = """const lessons = [
  {
    id: 'intro', icon: '🤖', category: 'Découverte', title: 'Qu\\'est-ce que OpenClaw ?',
    tag: 'Débutant',
    content: `
      <p><strong>OpenClaw</strong> est une intelligence artificielle personnelle qui fait réellement les choses sur n\\'importe quelle plateforme.</p>
      <h3>Caractéristiques clés</h3>
      <ul>
        <li><strong>Fonctionne sur votre machine</strong> : Un contrôle total de votre ordinateur.</li>
        <li><strong>Intégration d\\'applications</strong> : Contrôlez-le via Telegram, Slack, ou Discord.</li>
        <li><strong>Accès complet au système & Navigateur</strong> : Il peut taper dans le terminal, surfer sur le web et cliquer à votre place.</li>
      </ul>
    `,
    code: `# Installation typique via CLI\\ncurl -sSL https://openclaw.ai/install.sh | bash\\n\\n# Lancement\\nopenclaw start`,
    sandbox: `> OpenClaw, lance-toi et dis-moi bonjour\\n`,
    quiz: {
      question: 'Laquelle de ces affirmations sur OpenClaw est vraie ?',
      options: ['Il ne fonctionne que dans un navigateur web', 'Il fonctionne sur votre propre machine et possède un accès système', 'C\\'est uniquement un générateur d\\'images', 'Il requiert Windows 11 obligatoirement'],
      correct: 1,
      explain: 'OpenClaw se distingue par son accès profond ("Full System Access") à votre machine pour accomplir de vraies tâches.'
    }
  },
  {
    id: 'memory', icon: '🧠', category: 'Découverte', title: 'Mémoire Persistante',
    tag: 'Débutant',
    content: `
      <p>Contrairement aux agents classiques qui oublient tout à chaque nouvelle conversation, OpenClaw possède une <strong>Mémoire Persistante</strong>.</p>
      <h3>Comment ça marche ?</h3>
      <p>Il stocke le contexte, vos préférences et les informations clés des sessions passées (dans une base vectorielle ou un stockage local). Ainsi, il apprend à vous connaître avec le temps.</p>
    `,
    code: `// Exemple d'interaction\\nUSER: "Rappelle-toi que mon projet principal s'appelle Apollo"\\nOPENCLAW: "Mémorisé. Le projet principal est Apollo."\\n\\nUSER: "Ouvre mon projet principal"\\nOPENCLAW: "Ouverture du dossier du projet Apollo..."`,
    sandbox: `> OpenClaw, mémorise que je préfère le thème sombre.\\n> Quel est mon thème préféré ?`,
    quiz: {
      question: 'Quel est l\\'avantage principal de la mémoire persistante ?',
      options: ['Elle accélère le processeur', 'L\\'Agent retient vos préférences et historiques entre les sessions', 'Elle permet de jouer à des jeux vidéo', 'Elle empêche la suppression de fichiers'],
      correct: 1,
      explain: 'La mémoire persistante évite de devoir répéter sans cesse le même contexte à l\\'IA.'
    }
  },
  {
    id: 'chat_apps', icon: '💬', category: 'Intégrations', title: 'Lien avec les Chat Apps',
    tag: 'Intermédiaire',
    content: `
      <p>Vous n\\'avez pas besoin d\\'être devant votre terminal ! OpenClaw se connecte aux applications de messagerie (ex: Telegram, WhatsApp, Slack).</p>
      <h3>Commandement à distance</h3>
      <p>Vous pouvez lui envoyer un message sur Telegram depuis votre téléphone : <em>"Mets en pause le téléchargement sur mon PC"</em>, et il le fera sur votre ordinateur physique.</p>
    `,
    code: `# Relier OpenClaw à Telegram\\nopenclaw link telegram --token="VOTRE_TOKEN_BOT"\\n\\n[Telegram] USER: Ouvre Spotify sur mon Mac\\n[Telegram] OPENCLAW: Spotify est maintenant ouvert.`,
    sandbox: `> openclaw link slack --simulate\\n`,
    quiz: {
      question: 'Pourquoi l\\'intégration aux Chat Apps est-elle révolutionnaire pour un agent local ?',
      options: ['Cela permet de chatter avec ses amis', 'Elle transforme votre téléphone en télécommande universelle pour votre PC via le langage naturel', 'Cela rend le réseau plus rapide', 'Cela permet d\\'éviter les virus'],
      correct: 1,
      explain: 'Contrôler votre ordinateur distant via un simple message Telegram en langage naturel est l\\'une de ses fonctionnalités phares.'
    }
  },
  {
    id: 'browser_ctrl', icon: '🌍', category: 'Fonctionnalités', title: 'Contrôle du Navigateur',
    tag: 'Intermédiaire',
    content: `
      <p>OpenClaw ne se contente pas de faire des requêtes API sous le capot. Il possède un <strong>Browser Control</strong> (Navigation web automatisée).</p>
      <h3>Computer Use</h3>
      <p>Il peut ouvrir Chrome, lire le contenu, cliquer sur des boutons, remplir des formulaires ou extraire des informations d\\'un site web qui n\\'a pas d\\'API.</p>
    `,
    code: `USER: "Va sur Amazon et cherche les claviers mécaniques les mieux notés."\\n\\nOPENCLAW:\\n1. Ouverture du navigateur...\\n2. Navigation vers Amazon.com...\\n3. Recherche de "clavier mécanique"...\\n4. Extraction du Top 3...`,
    sandbox: `> OpenClaw, ouvre duckduckgo et cherche "OpenClaw AI"`,
    quiz: {
      question: 'Comment OpenClaw interagit-il avec un site web sans API ?',
      options: ['Il pirate le site', 'Il contrôle un vrai navigateur pour cliquer et lire la page', 'Il abandonne la tâche', 'Il demande au concepteur du site'],
      correct: 1,
      explain: 'Le Browser Control (Puppeteer/Playwright ou Agentic Computer Use) lui permet d\\'utiliser le web comme un humain.'
    }
  },
  {
    id: 'system_access', icon: '💻', category: 'Fonctionnalités', title: 'Full System Access',
    tag: 'Avancé',
    content: `
      <p>OpenClaw agit comme un développeur sur votre OS. Il exécute des commandes CLI, gère les fichiers, démarre des serveurs.</p>
      <h3>Permissions</h3>
      <p>Ce niveau d\\'accès est puissant mais nécessite un mode de confirmation (Human-in-the-loop) pour les commandes sensibles (ex: <code>rm -rf</code>).</p>
    `,
    code: `USER: "Trouve tous les fichiers PDF de plus de 50 Mo sur le bureau et déplace-les dans un dossier 'Archives'."\\n\\nOPENCLAW: "Exécution de la commande 'find ~/Desktop -name \"*.pdf\" -size +50M -exec mv {} ~/Desktop/Archives/ \\;'... Fait !"`,
    sandbox: `> Crée un dossier "ProjetIA" et ajoute un fichier README vide dedans.`,
    quiz: {
      question: 'Que faut-il surveiller lorsqu\\'on donne un "Full System Access" à une IA ?',
      options: ['La couleur du terminal', 'La sécurité et les validations avant les commandes destructrices', 'L\\'heure à laquelle elle travaille', 'Rien, elle ne fait jamais d\\'erreur'],
      correct: 1,
      explain: 'Il est essentiel d\\'avoir une sécurité "Human-in-the-loop" pour empêcher l\\'IA d\\'effacer ou de modifier accidentellement des fichiers critiques.'
    }
  },
  {
    id: 'skills', icon: '🧩', category: 'Extensibilité', title: 'Skills & Plugins',
    tag: 'Avancé',
    content: `
      <p>Comme toute bonne plateforme moderne, OpenClaw est extensible. Si une fonctionnalité manque, vous pouvez lui ajouter un <strong>Skill</strong> (Compétence).</p>
      <h3>Création de Skills</h3>
      <p>Les outils peuvent être écrits en Python ou en JavaScript, permettant à l\\'agent d\\'utiliser des bibliothèques externes ou des APIs privées.</p>
    `,
    code: `# Ajout d'une compétence existante\\nopenclaw install skill github-manager\\n\\n# Utilisation\\nUSER: "Ferme toutes les issues bloquées sur mon dépôt."`,
    sandbox: `> openclaw list-skills\\n> openclaw install skill weather`,
    quiz: {
      question: 'À quoi servent les "Skills" dans OpenClaw ?',
      options: ['A décorer l\\'interface', 'À étendre les capacités de l\\'IA avec de nouvelles intégrations ou outils locaux', 'À accélérer le téléchargement', 'À jouer de la musique uniquement'],
      correct: 1,
      explain: 'Les Skills ou Plugins sont des morceaux de code qui fournissent de nouveaux "Outils" que l\\'agent peut invoquer lors d\\'une conversation.'
    }
  },
  {
    id: 'auto', icon: '⚡', category: 'Usage', title: 'Automatisations Locales',
    tag: 'Intermédiaire',
    content: `
      <p>OpenClaw excelle pour automatiser les tâches chronophages de votre quotidien.</p>
      <ul>
        <li>Tri de vos e-mails locaux</li>
        <li>Renommage en masse de photos</li>
        <li>Résumé automatique de vos documents Word/PDF locaux</li>
      </ul>
    `,
    code: `USER: "Lis le PDF 'Rapport_Finances.pdf' sur mon bureau et fais-moi un résumé en 3 points."\\nOPENCLAW: "Outil PDFReader utilisé... Voici le résumé :\\n1. Les revenus ont augmenté de 10%.\\n2. Les coûts fixes sont stables.\\n3. Recommandation d'investissement dans l'IA."`,
    sandbox: `> Résume le contenu de dossier "Téléchargements" en m'indiquant les fichiers les plus lourds.`,
    quiz: {
      question: 'Quel type de tâche OpenClaw est-il parfaitement calibré pour accomplir localement ?',
      options: ['Renommer ou trier des dizaines de fichiers selon leur contenu', 'Afficher des films 3D', 'Réparer le hardware', 'Nettoyer l\\'écran fysisquement'],
      correct: 0,
      explain: 'Grâce à son accès système et sa compréhension du langage, l\\'automatisation de l\\'organisation des fichiers est l\\'un de ses meilleurs atouts.'
    }
  },
  {
    id: 'privacy', icon: '🛡️', category: 'Sécurité', title: 'Confidentialité et Local-First',
    tag: 'Débutant',
    content: `
      <p>Avec l\\'IA, la confidentialité des données est primordiale.</p>
      <h3>Local-First</h3>
      <p>Parce qu\\'OpenClaw s\\'exécute sur votre machine, vos fichiers ne sont pas téléchargés sur un serveur distant à votre insu. Vous pouvez même le coupler à un modèle LLM local (ex: Ollama, Llama.cpp) pour une confidentialité totale, sans Internet.</p>
    `,
    code: `# Lancement avec un modèle strictement local\\nopenclaw start --model=ollama/llama3-8b\\n\\nOPENCLAW: "Prêt. Fonctionnement sans connexion Cloud."`,
    sandbox: `> status \\n// Vérifiez les paramètres de confidentialité actuels`,
    quiz: {
      question: 'Comment peut-on garantir une confidentialité totale avec OpenClaw ?',
      options: ['En éteignant l\\'écran', 'En utilisant un Modèle LLM local (comme Ollama) au lieu d\\'une API cloud (comme OpenAI)', 'En tapant les requêtes très vite', 'En écrivant en majuscules'],
      correct: 1,
      explain: 'L\\'association d\\'un Agent local (OpenClaw) et d\\'un Modèle local (Ollama) garantit que strictement aucune donnée ne quitte votre ordinateur.'
    }
  },
  {
    id: 'dev', icon: '🛠️', category: 'Expert', title: 'Dev & API usage',
    tag: 'Expert',
    content: `
      <p>Pour les développeurs, OpenClaw n\\'est pas juste un chat. C\\'est un moteur d\\'exécution.</p>
      <h3>Utilisation Headless</h3>
      <p>Vous pouvez l\\'appeler via une API REST locale ou au sein d\\'un script Python pour déléguer des tâches complexes dans vos propres applications.</p>
    `,
    code: `import openclaw\\n\\nagent = openclaw.Agent()\\nresponse = agent.run("Construis une app React simple avec un bouton bleu")\\nprint("L'agent a terminé:", response)`,
    sandbox: `> generate_script("backup_bdd.sh") qui fait un dump postgres.`,
    quiz: {
      question: 'Que signifie une exécution "Headless" ?',
      options: ['Sans tête', 'Exécution en arrière-plan (sans interface graphique/chat visible) activée par API', 'Sans connexion internet', 'Sans l\\'utilisation de variables'],
      correct: 1,
      explain: '"Headless" signifie programmer et utiliser l\\'agent en arrière-plan via du code ou des requêtes HTTP, sans passer par son interface de Chat.'
    }
  },
  {
    id: 'future', icon: '🚀', category: 'Conclusion', title: 'Le Futur des Agents Personnels',
    tag: 'Expert',
    content: `
      <p>OpenClaw représente la première étape vers des systèmes d\\'exploitation dirigés par l\\'Interface Naturelle (Langage).</p>
      <p>Bientôt, nous ne chercherons plus l\\'application adaptée à notre besoin : l\\'agent la manipulera ou la créera à la volée pour nous.</p>
      <p>Félicitations, vous maîtrisez les concepts fondamentaux d\\'OpenClaw !</p>
    `,
    code: `USER: "Merci pour ton aide aujourd'hui."\\nOPENCLAW: "De rien ! Je passe en mode veille. En attente de nouvelles tâches."`,
    sandbox: `> Écris un mot de conclusion motivant pour ma formation OpenClaw.`,
    quiz: {
      question: 'Quelle est la vision long-terme des agents comme OpenClaw ?',
      options: ['Remplacer le clavier et la souris par des interfaces basées sur les intentions et le langage naturel', 'Supprimer tous les ordinateurs', 'Créer un internet privé', 'Limiter l\\'utilisation de l\\'IA'],
      correct: 0,
      explain: 'La vision est de transformer notre relation à l\\'ordinateur : passer de l\\'utilisation d\\'outils (clics) à la délégation de tâches par intention (langage).'
    }
  }
];"""

    cheatData = """const cheatData = [
  { title: 'Installation', code: `curl -sSL https://openclaw.ai/install.sh | bash` },
  { title: 'Démarrage Local', code: `openclaw start\\nopenclaw start --model ollama/llama3` },
  { title: 'Commandes de base', code: `> Ouvre mon navigateur\\n> Résume le fichier document.txt\\n> Envoie un message à Alice sur Telegram` },
  { title: 'Liaison Chat', code: `openclaw link telegram\\nopenclaw link slack` },
  { title: 'Gestion des Skills', code: `openclaw list-skills\\nopenclaw install skill github` },
  { title: 'Mise à jour Contextuelle', code: `> Oublie cette conversation\\n> Mémorise que mon dossier de test est /tmp/test` }
];"""

    quickQuizzes = """const quickQuizzes = [
  { q: 'C\\'est quoi OpenClaw?', opts: ['Un langage de programmation', 'Un assistant IA personnel avec accès système/navigateur', 'Un éditeur de code', 'Un modèle LLM exclusif'], ans: 1 },
  { q: 'Comment le lier à son téléphone ?', opts: ['Par Bluetooth', 'Par câble USB', 'Via l\\'intégration Chat Apps (ex: Telegram/Slack)', 'Impossible'], ans: 2 },
  { q: 'Qu\\'est-ce que le mode Local-First assure ?', opts: ['Que l\\'IA est plus intelligente', 'Que les données vocales sont sauvegardées', 'La plus haute confidentialité (les données ne quittent pas la machine)', 'L\\'impression locale'], ans: 2 }
];"""

    content = re.sub(r'const lessons = \[[\s\S]*?(?=\nconst cheatData)', lessons, content, count=1)
    content = re.sub(r'const cheatData = \[[\s\S]*?(?=\nconst quickQuizzes)', cheatData, content, count=1)
    content = re.sub(r'const quickQuizzes = \[[\s\S]*?(?=\n// ===== STATE =====)', quickQuizzes, content, count=1)

    # Simulator setup
    js_simulator = """
function simulateOpenClaw(code) {
  const req = code.trim().replace(/^>\\s*/, '');
  if(!req) return "(En attente de commande...)";
  
  if(req.toLowerCase().includes('bonjour')) return "🤖 OpenClaw Assistant: Bonjour ! Je suis en ligne sur votre système et prêt à exécuter des commandes.";
  if(req.toLowerCase().includes('mémorise') || req.toLowerCase().includes('préfère')) return "🧠 OpenClaw: J'ai bien indexé cette information dans ma Mémoire Persistante.";
  if(req.toLowerCase().includes('thème')) return "🧠 OpenClaw: D'après ma mémoire, vous préférez le thème sombre.";
  if(req.toLowerCase().includes('slack') || req.toLowerCase().includes('telegram')) return "🔗 OpenClaw: Demande d'intégration Chat requise.\\n[Simulation] Agent relé en mode écoute distante.";
  if(req.toLowerCase().includes('duckduckgo') || req.toLowerCase().includes('ouvre')) return "🌍 OpenClaw: J'ouvre le navigateur Chromium invisible... Recherche en cours... Voici les 3 premiers résultats trouvés.";
  if(req.toLowerCase().includes('dossier') || req.toLowerCase().includes('crée')) return "💻 OpenClaw: Exécution système -> `mkdir ProjetIA && touch ProjetIA/README.md`. Fait avec succès.";
  if(req.toLowerCase().includes('skill')) return "🧩 OpenClaw: Outil 'weather' installé localement. Je peux maintenant vérifier la météo.";
  if(req.toLowerCase().includes('résume') || req.toLowerCase().includes('pdf') || req.toLowerCase().includes('fichiers')) return "⚡ OpenClaw: Analyse du répertoire... Le plus lourd est 'film.mp4' (2Go).";
  if(req.toLowerCase().includes('generate') || req.toLowerCase().includes('bash')) return "🛠️ OpenClaw: Script généré et sauvegardé. Exécutez ./backup_bdd.sh pour lancer le dump.";
  
  return "⚡ OpenClaw a analysé votre intention : [ " + req + " ]\\n(Action simulée réussie dans l'environnement virtuel)";
}
"""
    content = re.sub(r'function simulateOpenClaw\(code\) \{[\s\S]*?return out;\n\}', lambda m: js_simulator.strip(), content, count=1)

    with open('apprendre-openclaw-app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    build_openclaw_app()
    print("Mise à jour détaillée du cours OpenClaw réussie : 10 chapitres !")
