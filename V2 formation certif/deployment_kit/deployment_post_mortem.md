# Analyse Technique (Post-Mortem) : Smartcodai V2

Ce document recense les erreurs critiques survenues lors de la mise en production sur le VPS Hostinger afin d'éviter leur répétition.

## 1. Conflit de Versions Prisma
- **Erreur** : Crash au démarrage avec `Prisma 7.7.0 required, but 6.2.0 found`.
- **Cause** : Installation par défaut de la dernière version majeure (7.x) sans verrouillage strict dans le `package.json` ou absence de `npm install` correct dans le Dockerfile.
- **Leçon** : Toujours utiliser des versions exactes (`6.2.0` au lieu de `^6.2.0`) pour les moteurs de base de données.

## 2. Le "Auth Loop" (Boucle d'Authentification)
- **Erreur** : Impossible de rester connecté sur l'adresse IP.
- **Cause** : Cookies de session configurés avec `secure: true`. Le navigateur refuse de stocker ces cookies si le site n'est pas en **HTTPS**. 
- **Leçon** : Ne jamais tester une authentification sécurisée sur une adresse IP brute. Utiliser toujours un domaine SSL pour les tests de session.

## 3. Outils Manquants en Production
- **Erreur** : Commande `tsx` non trouvée dans le conteneur final.
- **Cause** : Utilisation d'outils de développement (`tsx`) pour lancer des scripts de production, alors que le Dockerfile n'installe que les dépendances de production (`npm install --omit=dev`).
- **Leçon** : Les scripts de démarrage en production doivent utiliser `node` pur. Compiler le TypeScript en JavaScript (`tsc`) avant de lancer le serveur.

## 4. Chemins avec Espaces
- **Erreur** : Échec des commandes `scp`, `cd` et `docker compose`.
- **Cause** : Dossier nommé `V2 formation certif`. Sous Unix/Linux, les espaces sont des séparateurs de commandes.
- **Leçon** : **ZÉRO ESPACE**. Utiliser des tirets (`v2-formation-certif`) ou des underscores.

## 5. Blocage de l'Entrée Docker (Entrypoint)
- **Erreur** : Certbot se fermait immédiatement sans générer de certificat.
- **Cause** : Le fichier `docker-compose.yml` définissait un `entrypoint` avec une boucle shell infinie qui ignorait les commandes passées manuellement.
- **Leçon** : Pour lancer une commande unique dans un conteneur persistant, utiliser `--entrypoint`.

## 6. Conflits de Ports "Fantômes"
- **Erreur** : `bind: address already in use` sur le port 443.
- **Cause** : Des conteneurs `certbot-run` orphelins (issus de tentatives précédentes interrompues) occupaient le port 443, même si le projet principal était arrêté.
- **Leçon** : Toujours vérifier avec `docker ps` si des conteneurs isolés n'utilisent pas les ports 80/443 avant de relancer un projet.

---
*Document mis à jour le 15 Avril 2026 par Smartcodai Architect.*
