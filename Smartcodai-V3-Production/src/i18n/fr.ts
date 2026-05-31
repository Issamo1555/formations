export const fr = {
  // Navigation
  nav: {
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    courses: 'Formations',
    certificates: 'Certificats',
    admin: 'Administration',
    login: 'Connexion',
    register: 'Creer un compte',
    logout: 'Deconnexion',
    profile: 'Profil',
    settings: 'Parametres',
  },

  // Landing page
  landing: {
    hero: {
      eyebrow: 'Nouvelle session 2026 • Python, PHP, n8n et IA',
      title: 'Apprenez a coder <span>en produisant du concret</span>.',
      subtitle: 'Smartcodai transforme chaque lecon en terrain de pratique. Vous codez, vous testez, vous validez vos acquis et vous avancez vers une certification sans installation complexe ni perte de temps.',
      cta: 'Commencer gratuitement',
      ctaSecondary: 'Voir les parcours',
      proof: '100% dans le navigateur',
      proofCert: 'Certificat verifiable',
    },
    features: {
      title: 'Pourquoi choisir Smartcodai ?',
      structured: {
        title: 'Apprentissage structure',
        desc: 'Des parcours "Zero to Hero" concus par des professionnels pour vous mener des bases jusqu\'a la maitrise.',
      },
      certificates: {
        title: 'Certificats reconnus',
        desc: 'Obtenez des certificats telechargeables et verifiables pour valoriser vos competences aupres des employeurs.',
      },
      practical: {
        title: 'Projets pratiques',
        desc: 'Codez des le premier jour avec des exercices concrets, des projets reels et un suivi de progression detaille.',
      },
    },
    cta: {
      title: 'Pret a commencer votre parcours ?',
      subtitle: 'Rejoignez des centaines d\'etudiants et apprenez a votre rythme.',
      btn: 'Entrer dans la plateforme',
    },
    footer: '© 2026 Smartcodai Academy. Formation orientee pratique, progression et certification.',
  },

  // Auth
  auth: {
    login: {
      title: 'Connexion',
      subtitle: 'Accedez a votre espace d\'apprentissage',
      email: 'Adresse email',
      password: 'Mot de passe',
      submit: 'Se connecter',
      loading: 'Connexion en cours...',
      noAccount: 'Pas encore de compte ?',
      createAccount: 'Creer un compte',
      backHome: 'Retour a l\'accueil',
      error: 'Email ou mot de passe incorrect.',
    },
    register: {
      title: 'Creer un compte',
      subtitle: 'Commencez votre parcours d\'apprentissage gratuitement',
      name: 'Nom complet',
      email: 'Adresse email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      submit: 'Creer mon compte',
      loading: 'Creation du compte...',
      hasAccount: 'Deja un compte ?',
      login: 'Se connecter',
      backHome: 'Retour a l\'accueil',
      passwordMin: 'Minimum 6 caracteres requis',
      passwordWeak: 'Faible - ajoutez des majuscules, chiffres ou symboles',
      passwordMedium: 'Moyen - pas mal, mais peut etre ameliore',
      passwordStrong: 'Fort - excellent mot de passe !',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
      emailExists: 'Un compte avec cet email existe deja.',
      features: [
        'Acces gratuit a tous les cursus de base',
        'Suivi de progression personnalise',
        'Certificats telechargeables a la fin',
      ],
    },
  },

  // Dashboard
  dashboard: {
    title: 'Tableau de bord',
    welcome: {
      badge: 'Acces illimite a tous les cursus',
      title: 'Investissez dans votre carriere avec Smartcodai',
      subtitle: 'Accedez a des parcours de qualite professionnelle en PHP, Python, n8n et IA. Apprenez a votre rythme, construisez des projets concrets, et obtenez des certificats reconnus.',
      cta: 'Explorer les cursus',
      ctaSecondary: 'Decouvrir les certificats',
    },
    stats: {
      lessonsCompleted: 'Lecons completees',
      certificates: 'Certificats',
      practiceTime: 'Temps de pratique',
      week: 'Semaine',
    },
    courses: {
      title: 'Vos cursus',
      new: 'Nouveau',
      inProgress: 'En cours',
      completed: 'Termine',
      locked: 'Verrouille',
      start: 'Commencer',
      continue: 'Continuer',
      modules: 'modules',
      accessInfo: {
        title: 'Comment acceder aux formations ?',
        desc: 'Vos formations sont verrouillees. Pour les debloquer, <strong>contactez l\'administrateur</strong> de la plateforme. Il pourra activer vos acces depuis le panneau d\'administration.',
      },
    },
    certificates: {
      title: 'Certificats',
      empty: 'Vos certificats apparaitront ici',
      desc: 'Quand un cursus est termine, vous pourrez retrouver, previsualiser et telecharger votre certificat depuis ce tableau de bord.',
      viewExample: 'Voir l\'exemple',
    },
    settings: {
      title: 'Parametres',
      theme: 'Theme',
      toggleTheme: 'Basculer le theme',
    },
  },

  // Admin
  admin: {
    title: 'Gestion des utilisateurs',
    subtitle: 'Gerer les inscriptions et debloquer les formations pour chaque etudiant.',
    stats: {
      users: 'Utilisateurs',
      phpUnlocked: 'PHP debloque',
      pythonUnlocked: 'Python debloque',
      n8nUnlocked: 'n8n debloque',
      openclawUnlocked: 'OpenClaw debloque',
    },
    table: {
      title: 'Utilisateurs inscrits',
      search: 'Rechercher par nom ou email...',
      user: 'Utilisateur',
      date: 'Date d\'inscription',
      courses: 'Formations debloquees',
      actions: 'Actions',
      unlockAll: 'Tout debloquer',
      lockAll: 'Tout verrouiller',
      empty: 'Aucun utilisateur inscrit pour le moment.',
      noResults: 'Aucun resultat trouve.',
    },
    toast: {
      unlocked: 'debloque pour',
      locked: 'verrouille pour',
      allUnlocked: 'Toutes les formations debloquees !',
      allLocked: 'Toutes les formations verrouillees.',
    },
  },

  // Course
  course: {
    backToDashboard: 'Retour au tableau de bord',
    lesson: 'Lecon',
    of: 'sur',
    next: 'Suivant',
    previous: 'Precedent',
    quiz: 'Quiz',
    submit: 'Soumettre',
    correct: 'Correct !',
    incorrect: 'Incorrect.',
    certificate: {
      title: 'Certificat',
      locked: 'Certificat verrouille',
      remaining: 'Il vous reste {count} lecon(s) a completer pour debloquer le certificat.',
      congrats: 'Formation complete — Felicitations !',
      download: 'Telecharger PNG',
      print: 'Imprimer / Exporter PDF',
      shareLinkedin: 'Partager sur LinkedIn',
      copyLink: 'Copier le lien de verification',
      reference: 'Reference du certificat',
      verify: 'Verifier ce certificat',
      scanToVerify: 'Scannez pour verifier',
    },
  },

  // Verification
  verify: {
    title: 'Verification du certificat',
    subtitle: 'Entrez l\'identifiant du certificat pour verifier son authenticite',
    input: 'Ex: PHP-2026-ABCDEF-4821',
    submit: 'Verifier',
    valid: {
      title: 'Certificat authentique',
      subtitle: 'Ce certificat a ete emis par Smartcodai Academy et est valide.',
    },
    invalid: {
      title: 'Certificat introuvable',
      subtitle: 'Aucun certificat ne correspond a cette reference. Verifiez l\'identifiant ou contactez Smartcodai.',
    },
    details: {
      student: 'Etudiant',
      course: 'Formation',
      reference: 'Reference',
      date: 'Date d\'emission',
      score: 'Score',
    },
    share: {
      title: 'Partager ce certificat',
      linkedin: 'LinkedIn',
      copy: 'Copier le lien',
      copied: 'Copie !',
    },
    backHome: 'Retour a l\'accueil',
  },

  // Common
  common: {
    loading: 'Chargement...',
    error: 'Une erreur est survenue.',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    search: 'Rechercher...',
    noData: 'Aucune donnee disponible.',
  },

  // Course names
  courses: {
    php: 'Developpement Web Backend avec PHP',
    python: 'Programmation en Python',
    n8n: 'Automatisation avec n8n',
    openclaw: 'Maitrise de l\'IA OpenClaw',
  },
};
