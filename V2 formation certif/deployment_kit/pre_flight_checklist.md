# Check-list Pre-Flight (Go / No-Go)

Avant de lancer `docker compose up`, vérifiez scrupuleusement ces 10 points.

### 🏗️ Infrastructure
1.  **DNS** : Est-ce que mon nom de domaine pointe bien vers l'IP du serveur ? (Vérifier avec `nslookup`).
2.  **Ports** : Le port 80 et 443 sont-ils libres ? (Attention aux conteneurs Certbot fantômes ! Vérifier avec `vps_audit.sh`).
3.  **Stockage** : Reste-t-il au moins 2 GB d'espace disque libre ?

### 📦 Application & Docker
4.  **Versions** : La version de Node (v22) et de Prisma (6.2.0) est-elle identique sur Mac et Dockerfile ? (Vérifié avec `vps_audit.sh`).
5.  **Build** : Ai-je bien fait un `npm run build` localement pour m'assurer que le TypeScript compile ?
6.  **Entrypoint** : Le script de démarrage a-t-il bien les droits d'exécution (`chmod +x`) ?

### 🔒 Sécurité & Config
7.  **Secrets** : Mon fichier `.env.production` est-il à jour avec les bons mots de passe de la DB du serveur ?
8.  **URL** : La variable `NEXTAUTH_URL` pointe-t-elle bien vers le domaine en `https://` ?
9.  **SSL** : Mes certificats Certbot sont-ils bien présents dans le dossier monté par Docker ?

### 🏁 Finalisation
10. **Clean** : Ai-je bien supprimé les anciens conteneurs orphelins avant de relancer ? (`docker system prune -f`).

---
> [!CAUTION]
> Si vous ignorez un seul de ces points, vous risquez une erreur 502 ou un crash de session.
