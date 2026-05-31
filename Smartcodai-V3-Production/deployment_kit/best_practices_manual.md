# Manuel des Bonnes Pratiques de Déploiement (Ref: Skill)

Ce manuel définit les standards de qualité pour tous les projets Smartcodai. Son respect garantit un déploiement en moins de 5 minutes sans erreur.

## 1. Hygiène des Fichiers et Dossiers
> [!IMPORTANT]
> **Interdiction absolue des espaces** dans les noms de dossiers et de fichiers.
- **Pourquoi ?** Casse les scripts SSH, SCP et Docker.
- **Alternative** : Utiliser le `kebab-case` (ex: `smartcodai-v2`) ou le `snake_case` (ex: `smartcodai_v2`).

## 2. Gestion des Dépendances et Parité
> [!IMPORTANT]
> **Règle de la Parité** : La version de Node.js et de Prisma doit être IDENTIQUE sur votre Mac et sur le Serveur.
- **Node.js** : Utiliser la version LTS actuelle (v22 recommandée). Vérifier avec `node -v` des deux côtés.
- **Docker** : Ne jamais utiliser le tag `:latest` pour vos images de base. Utilisez par exemple `node:22-alpine`.
- **Prisma** : Verrouiller la version dans `package.json` (ex: `"prisma": "6.2.0"` sans le symbole `^`). Cela empêche l'installation accidentelle d'une version 7.x incompatible.

## 3. Sécurité et Cookies
- **Règle** : Pas de HTTPS = Pas de Cookies de session.
- **Pratique** : En environnement local, utiliser des cookies non sécurisés. En production, activer le SSL **avant** de tester l'authentification.
- **Nginx** : Toujours utiliser `proxy_set_header X-Forwarded-Proto $scheme` pour que l'application sache si elle est en HTTPS.

## 4. cycle de vie des Secrets (.env)
- **Règle** : Le `.env` ne voyage jamais sur Git.
- **Pratique** : Créer un `.env.example` avec des valeurs bidon pour guider le prochain déploiement.
- **Stockage** : Utiliser un gestionnaire de secrets ou un fichier `.env.production` géré via SCP uniquement vers le serveur.

## 5. Workflow de Déploiement
> [!TIP]
> **Git est votre ami, SCP est votre ennemi.**
1. Pousser sur GitHub.
2. `git pull` sur le serveur.
3. `docker compose build`.
- Cette méthode évite d'oublier des fichiers ou d'envoyer des dossiers volumineux (comme `node_modules`).

---

## 🎨 Consistance Design & UX
*   **Règle** : Le design en Production doit être identique au Local.
*   **Risque** : Purge CSS incorrecte ou cache serveur désynchronisé.
*   **Action** : Consulter et appliquer la check-list du fichier [ux_deployment_consistency.md](file:///Users/admin/Desktop/formation%20certif/V2%20formation%20certif/deployment_kit/ux_deployment_consistency.md).

> [!TIP]
> En cas de "mélange" visuel sur le serveur, forcer un build Docker avec `--no-cache`.

## 🧪 Standards de Test (Qualité)

### Règle : Nettoyage Prioritaire (Zero Residue)
*   **Action** : Systématiquement vider les champs `login` et `password` avant toute saisie.
*   **Pourquoi** : Garantir l'intégrité des données de test et éviter les erreurs d'authentification "fantômes".
*   **Exécution** : Obligatoire pour **chaque test**, qu'il soit manuel ou automatisé.

> [!NOTE]
> Reportez-vous au fichier [testing_best_practices.md](file:///Users/admin/Desktop/formation%20certif/V2%20formation%20certif/deployment_kit/testing_best_practices.md) pour les détails techniques.
*Ce document fait foi pour tout nouveau projet sur le VPS.*
