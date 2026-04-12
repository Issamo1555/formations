# 🐳 Déploiement Smartcodai V2 avec Docker sur Hostinger

## Architecture

```
┌──────────────────────────────────────────────┐
│  VPS Hostinger (Ubuntu)                       │
│                                               │
│  Port 80/443                                  │
│  ┌─────────────────────────────────────────┐ │
│  │  Nginx (Reverse Proxy)                  │ │
│  │  - Gzip compression                     │ │
│  │  - SSL via Certbot                      │ │
│  │  - Rate limiting                        │ │
│  └──────────────┬──────────────────────────┘ │
│                 │                            │
│  ┌──────────────▼──────────────────────────┐ │
│  │  Next.js App (Node.js 20 + PHP-CLI)     │ │
│  │  - /api/execute → PHP natif             │ │
│  │  - /api/auth → NextAuth                 │ │
│  │  - Prisma ORM                           │ │
│  └──────────────┬──────────────────────────┘ │
│                 │                            │
│  ┌──────────────▼──────────────────────────┐ │
│  │  PostgreSQL 17                          │ │
│  │  - Volumes persistants                  │ │
│  │  - Healthcheck                          │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

## 📋 Prérequis

- VPS Hostinger (Ubuntu 22.04+, minimum 2 GB RAM)
- Accès root SSH
- Domaine configuré (optionnel, HTTP sans)

---

## 🚀 Déploiement en 5 étapes

### 1. SSH sur le VPS

```bash
ssh root@VOTRE_IP
```

### 2. Installer Docker

```bash
# Installer Docker + Compose
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker
docker --version
docker compose version
```

### 3. Cloner le projet

```bash
mkdir -p /opt/smartcodai
cd /opt/smartcodai
git clone https://github.com/Issamo1555/formations.git .
cd "V2 formation certif"
```

### 4. Configurer l'environnement

```bash
# Générer un secret NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" > .env.production

# Configurer les variables
cat >> .env.production << 'EOF'
NODE_ENV=production
NEXTAUTH_URL=http://VOTRE_IP
DATABASE_URL=postgresql://smartcodai:Smartcodai2026@postgres:5432/smartcodai_v2
EOF

# Remplacer VOTRE_IP par votre vrai IP ou domaine
nano .env.production
```

### 5. Démarrer !

```bash
docker compose up -d --build
```

**C'est tout !** Le premier démarrage prend ~3 minutes (build + seed DB).

---

## 🔍 Vérifier que tout fonctionne

```bash
# Voir les containers
docker compose ps

# Voir les logs de l'app
docker compose logs -f app

# Voir les logs de Nginx
docker compose logs -f nginx

# Tester l'app
curl http://localhost
```

---

## 🔐 Activer HTTPS (avec domaine)

```bash
# 1. Arrêter Nginx temporairement
docker compose stop nginx

# 2. Obtenir le certificat
docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d votre-domaine.com \
  --email admin@votre-domaine.com \
  --agree-tos --non-interactive

# 3. Décommenter le bloc HTTPS dans nginx.conf
nano nginx.conf
# → Décommenter le bloc "server { listen 443 ssl; ... }"
# → Remplacer "votre-domaine.com" par votre domaine

# 4. Redémarrer
docker compose up -d
```

---

## 📊 Commandes utiles

```bash
# Voir les containers
docker compose ps

# Logs en temps réel
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f postgres

# Redémarrer l'app
docker compose restart app

# Mettre à jour le code
cd /opt/smartcodai/"V2 formation certif"
git pull
docker compose up -d --build

# Accéder à la DB
docker compose exec postgres psql -U smartcodai -d smartcodai_v2

# Accéder au container app
docker compose exec app sh

# Arrêter tout
docker compose down

# Arrêter + supprimer les volumes (⚠️ supprime les données !)
docker compose down -v
```

---

## 🔄 Mettre à jour l'application

```bash
cd /opt/smartcodai/"V2 formation certif"
git pull
docker compose down
docker compose up -d --build
```

---

## 🔑 Comptes par défaut

**Admin :**
- Email: `admin@smartcodai.com`
- Password: `admin123`

⚠️ **Changez le mot de passe admin après le premier login !**

---

## 🐛 Résolution de problèmes

### L'app ne démarre pas

```bash
docker compose logs app
# Chercher les erreurs
```

### PostgreSQL n'est pas prêt

```bash
docker compose logs postgres
# Attendre le message "database system is ready"
```

### Port 80 déjà utilisé

```bash
sudo lsof -i :80
# Arrêter le service qui utilise le port 80
sudo systemctl stop apache2  # si Apache est installé
```

### Erreur de seed

```bash
docker compose exec app npx tsx prisma/seed-lessons.ts
```

### DB vide

```bash
docker compose exec app npx prisma db push --accept-data-loss
docker compose exec app npx tsx prisma/seed.ts
docker compose exec app npx tsx prisma/seed-lessons.ts
docker compose exec app npx tsx prisma/seed-quizzes.ts
```

---

**Votre plateforme est prête ! 🎉**

Accédez à : `http://VOTRE_IP` (ou `https://votre-domaine.com`)
