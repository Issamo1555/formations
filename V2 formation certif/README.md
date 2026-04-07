# Smartcodai Academy V2

Plateforme de formation multilingue (Francais, Anglais, Arabe) avec gestion des utilisateurs, deblocage de cours par l'admin, certificats avec QR code et verification.

## Stack Technique

- **Frontend**: Next.js 15 (App Router) + React 19 + TailwindCSS
- **Backend**: Next.js API Routes (Serverless)
- **Base de donnees**: PostgreSQL + Prisma ORM
- **Authentification**: Sessions HTTP-only cookies + bcrypt
- **Langues**: Francais, Anglais, Arabe (avec support RTL)
- **Theme**: Clair / Sombre

## Installation

```bash
# 1. Installer les dependances
npm install

# 2. Configurer la base de donnees
# Modifier le fichier .env avec votre URL PostgreSQL
# Puis creer le schema:
npx prisma db push

# 3. (Optionnel) Seeder la base avec des donnees de test
npm run db:seed

# 4. Lancer le serveur de developpement
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Comptes

### Admin par defaut
Inscrivez-vous avec l'email `admin@smartcodai.com` pour obtenir automatiquement le role administrateur.

### Utilisateur standard
Inscrivez-vous avec n'importe quel autre email.

## Fonctionnalites

### Pour les etudiants
- Inscription / Connexion
- Tableau de bord avec progression
- Cours verrouilles/deverrouilles
- Certificats avec QR code
- Partage LinkedIn
- Verification de certificat publique

### Pour l'admin
- Voir tous les utilisateurs inscrits
- Debloquer/Verrouiller les cours par utilisateur
- Debloquer/Verrouiller tous les cours d'un coup
- Statistiques en temps reel

### Multilingue
- **Francais** (par defaut)
- **English**
- **العربية** (avec support RTL)

Le changement de langue est persiste dans le localStorage.

## Structure du projet

```
V2 formation certif/
├── prisma/
│   └── schema.prisma          # Modeles de base de donnees
├── src/
│   ├── app/
│   │   ├── page.tsx           # Page d'accueil (landing)
│   │   ├── layout.tsx         # Layout racine
│   │   ├── globals.css        # Styles globaux
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (main)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── admin/page.tsx
│   │   │   └── verify/page.tsx
│   │   └── api/
│   │       ├── auth/          # Login, Register, Me, Logout
│   │       ├── admin/         # Users, Unlock
│   │       └── certificates/  # Verify
│   ├── components/            # Composants React
│   ├── context/               # Context providers (Locale, Theme)
│   ├── i18n/                  # Traductions (fr, en, ar)
│   └── lib/
│       └── prisma.ts          # Client Prisma
├── .env                       # Variables d'environnement
├── next.config.js
├── tailwind.config.js
└── package.json
```

## API Endpoints

| Methode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Creer un compte |
| POST | `/api/auth/login` | Se connecter |
| GET | `/api/auth/me` | Obtenir l'utilisateur courant |
| POST | `/api/auth/logout` | Se deconnecter |
| GET | `/api/admin/users` | Lister tous les utilisateurs (admin) |
| POST | `/api/admin/unlock` | Debloquer/Verrouiller un cours (admin) |
| GET | `/api/certificates/verify?ref=XXX` | Verifier un certificat |

## Modeles de donnees

- **User**: id, name, email, passwordHash, role (USER/ADMIN)
- **Course**: id, slug, title (JSON multilingue), description, modulesCount
- **UserCourse**: userId, courseId, unlockedAt, unlockedBy, progressPct
- **Lesson**: id, courseId, order, title, content, category, hasQuiz
- **LessonProgress**: userId, lessonId, completed, completedAt
- **Certificate**: id, certReference, userId, courseId, studentName, score, issuedAt

## Deploiement

### Vercel (recommande)

```bash
# Installer Vercel CLI
npm i -g vercel

# Deployer
vercel
```

### Variables d'environnement en production

- `DATABASE_URL`: URL PostgreSQL (Neon, Supabase, Railway...)
- `NEXTAUTH_SECRET`: Cle secrete (generer avec `openssl rand -base64 32`)
- `NEXTAUTH_URL`: URL de production (ex: `https://smartcodai.vercel.app`)

## License

MIT - Smartcodai Academy 2026
