# 🚀 Guide de Deploiement - Smartcodai V2

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Vercel (CDN)                   │
│  Next.js 15 App Router + API Routes (Serverless) │
└──────────────────────┬──────────────────────────┘
                       │
                       │ Prisma ORM
                       │
┌──────────────────────▼──────────────────────────┐
│           Neon PostgreSQL (Cloud)                │
│  Users, Courses, Lessons, Progress, Certificates │
│  Blog Posts                                      │
└─────────────────────────────────────────────────┘
```

---

## Methode 1 : Deploiement via Vercel UI (Recommande - 10 min)

### Etape 1 : Creer la base de donnees PostgreSQL (3 min)

1. Aller sur **[neon.tech](https://neon.tech)**
2. S'inscrire avec GitHub
3. Click **"New Project"** → Nom : `smartcodai-v2`
4. Click **"Connect"** → Copier l'URL **Connection string (URI)** :
   ```
   postgresql://smartcodai_v2_user:xxx@ep-xxx.region.aws.neon.tech/smartcodai_v2?sslmode=require
   ```

### Etape 2 : Pousser le code sur GitHub (2 min)

```bash
cd "/Users/admin/Desktop/formation certif"

# Initialiser le repo si pas fait
git init
git add .
git commit -m "Smartcodai V2 - Production ready"

# Creer le repo sur GitHub puis :
git remote add origin https://github.com/VOTRE_USERNAME/smartcodai-v2.git
git branch -M main
git push -u origin main
```

### Etape 3 : Deployer sur Vercel (5 min)

1. Aller sur **[vercel.com](https://vercel.com)** → Sign up with GitHub
2. Click **"Add New..."** → **Project**
3. Importer le repo `smartcodai-v2`
4. **Configure Project** :
   - **Framework Preset** : Next.js
   - **Root Directory** : `V2 formation certif`
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`

5. **Environment Variables** (click "Environment Variables") :

   | Cle | Valeur |
   |---|---|
   | `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` |
   | `NEXTAUTH_SECRET` | Generer avec `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | `https://votre-projet.vercel.app` |
   | `NODE_ENV` | `production` |

6. Click **Deploy** 🎉

### Etape 4 : Initialiser la base de donnees (2 min)

Apres le deploiement, initialiser la DB :

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
cd "V2 formation certif"
vercel link

# Pull les variables d'env
vercel env pull .env.production.local

# Pousser le schema
DATABASE_URL="votre-url-neon" npx prisma db push --accept-data-loss

# Seeder les donnees
DATABASE_URL="votre-url-neon" npx tsx prisma/seed.ts
DATABASE_URL="votre-url-neon" npx tsx prisma/seed-lessons.ts
DATABASE_URL="votre-url-neon" npx tsx prisma/seed-quizzes.ts
DATABASE_URL="votre-url-neon" npx tsx prisma/seed-blog.ts
```

Ou alternativement, via le dashboard Vercel :
- Aller dans **Storage** → **Neon** → Connecter
- Puis utiliser l'onglet **Data** pour verifier

### Etape 5 : Verifier le deploiement

Tester ces URLs :

| URL | Attendu |
|---|---|
| `https://votre-projet.vercel.app` | Page d'accueil |
| `https://votre-projet.vercel.app/register` | Inscription |
| `https://votre-projet.vercel.app/dashboard` | Dashboard (redirect login) |
| `https://votre-projet.vercel.app/blog` | Blog |
| `https://votre-projet.vercel.app/verify?cert=XXX` | Verification certificat |

### Etape 6 : Creer le compte admin

1. Aller sur `/register`
2. Nom : `Admin Smartcodai`
3. Email : `admin@smartcodai.com`
4. Mot de passe : (mot de passe fort)

Le role `ADMIN` est automatiquement attribue a cet email.

---

## Methode 2 : Deploiement automatique via GitHub Actions

### Pre-requis

1. Repo GitHub avec le code
2. Projet Vercel cree (Methode 1, etapes 1-3)

### Configuration

1. Obtenir les secrets Vercel :
   ```bash
   vercel link
   vercel env pull .env.local
   ```

2. Ajouter les secrets GitHub (Settings → Secrets → Actions) :
   - `VERCEL_TOKEN` : Token Vercel (vercel.com/account/tokens)
   - `VERCEL_ORG_ID` : ID de l'organisation
   - `VERCEL_PROJECT_ID` : ID du projet
   - `DATABASE_URL` : URL PostgreSQL
   - `NEXTAUTH_SECRET` : Cle secrete
   - `NEXTAUTH_URL` : URL de l'app

3. Pusher sur `main` → Le deploiement est automatique !

---

## Commands utiles

```bash
# Developpement
npm run dev              # Serveur de dev
npm run build            # Build production
npm run start            # Start production

# Base de donnees
npx prisma studio        # Interface visuelle DB
npx prisma db push       # Synchroniser schema
npx prisma generate      # Regenerer client

# Seed
npm run db:seed:all      # Cours + lecons + quiz
npm run db:seed:blog     # Articles blog
```

---

## Couts

| Service | Plan | Prix |
|---|---|---|
| **Vercel** | Hobby | **Gratuit** |
| **Neon PostgreSQL** | Free | **Gratuit** (0.5 GB) |
| **GitHub Actions** | Free | **Gratuit** (2000 min/mois) |
| **Total** | | **$0/mois** |

Pour monter en charge :
- Vercel Pro : $20/mois
- Neon Standard : $19/mois

---

## Troubleshooting

### Erreur "Route API introuvable"
- Redemarrer le serveur : `npm run dev`
- Verifier que les fichiers `page.tsx` existent

### Erreur Prisma
```bash
npx prisma generate
npx prisma db push
```

### Erreur de connexion DB
- Verifier que `DATABASE_URL` est correct
- Pour Neon : ajouter `?sslmode=require` a l'URL

### Erreur de build Vercel
- Verifier les logs dans Vercel → Deployments
- S'assurer que `npm run build` passe en local

### Le blog n'affiche pas d'articles
- Verifier que les articles sont seeds : `npm run db:seed:blog`
- Verifier que `isPublished` est `true`
