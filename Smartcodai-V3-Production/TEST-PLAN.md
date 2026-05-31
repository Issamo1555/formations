# Smartcodai V2 - Test Plan & Results

## Test Execution Date: April 7, 2026

---

## Étape 1: Test Fonctionnel (15 min)

### ✅ Test 1.1: Create Admin Account (admin@smartcodai.com)

**Instructions:**
1. Open http://localhost:3000 in your browser
2. Click "Creer un compte" or navigate to http://localhost:3000/register
3. Fill in the registration form:
   - **Name**: `Admin Smartcodai`
   - **Email**: `admin@smartcodai.com`
   - **Password**: `Admin123!` (or any password ≥ 6 chars)
   - **Confirm Password**: Same as above
4. Click "Creer mon compte"

**Expected Result:**
- Account created successfully
- Redirected to /dashboard
- User has ADMIN role (can access /admin page)

**Notes:** 
- The system automatically assigns ADMIN role to admin@smartcodai.com
- The seed script may have already created this account with password: `admin123`
- If account exists, use login page with credentials above

**Status:** ⏳ PENDING - Please test in browser

---

### ✅ Test 1.2: Test Standard User Registration/Login

**Registration:**
1. Open http://localhost:3000/register (or logout if logged in as admin)
2. Fill in:
   - **Name**: `Test User`
   - **Email**: `test@example.com`
   - **Password**: `test123`
   - **Confirm Password**: `test123`
3. Submit

**Expected:** 
- Account created with USER role (not ADMIN)
- Redirected to dashboard
- Courses should appear LOCKED (unlock requires admin)

**Login:**
1. Navigate to http://localhost:3000/login
2. Enter email: `test@example.com`, password: `test123`
3. Click "Se connecter"

**Expected:**
- Successful login
- Redirected to dashboard
- See user name in dashboard

**Status:** ⏳ PENDING - Please test in browser

---

### ✅ Test 1.3: Verify 4 Courses (PHP, Python, N8N, OpenClaw)

**Instructions:**
1. Log in as admin or standard user
2. Go to http://localhost:3000/dashboard
3. Check the courses section

**Expected to see:**
- ✅ **PHP**: "Developpement Web Backend avec PHP" (12 modules)
- ✅ **Python**: "Programmation en Python" (10 modules)
- ✅ **N8N**: "Automatisation avec n8n" (10 modules)
- ✅ **OpenClaw**: "Maitrise de l'IA OpenClaw" (10 modules)

Each course should show:
- Course icon
- Title
- Module count
- Progress indicator (0% if new)
- Lock/unlock status

**Status:** ⏳ PENDING - Please verify in browser

---

### ✅ Test 1.4: Test Admin Panel (Unlock Courses)

**Instructions:**
1. Log in as **admin@smartcodai.com**
2. Navigate to http://localhost:3000/admin
3. You should see:
   - List of all registered users
   - Statistics (total users, courses unlocked)
   - Unlock/Lock buttons for each user and course

**Test Unlock:**
1. Find "Test User" (test@example.com) in the list
2. Click unlock button for "PHP" course
3. Verify the course shows as "unlocked"

**Test Unlock All:**
1. Click "Tout debloquer" (Unlock All) for a user
2. All 4 courses should show as unlocked

**Expected:**
- Success toast notification
- User's dashboard updates to show unlocked courses
- Database updates correctly

**Status:** ⏳ PENDING - Please test in browser

---

### ✅ Test 1.5: Generate Certificate with QR Code

**Prerequisites:**
- Must be logged in as a user with at least one unlocked course
- Complete all lessons in a course (mark lessons as complete)

**Instructions:**
1. Go to dashboard
2. Click on an unlocked course
3. Navigate through lessons and mark them as complete
4. Complete ALL lessons (100% progress)
5. Go to certificate section of the course
6. Click "Generate Certificate"

**Expected:**
- Certificate generated with:
  - Unique reference number (e.g., PHP-2026-ABCDEF-4821)
  - Student name
  - Course name
  - Score/percentage
  - Issue date
  - QR code for verification
- Options to:
  - Download as PNG
  - Print/Export as PDF
  - Share on LinkedIn
  - Copy verification link

**Status:** ⏳ PENDING - Please test in browser

---

### ✅ Test 1.6: Verify Public Verification Page

**Instructions:**
1. Generate a certificate (from Test 1.5)
2. Copy the certificate reference number
3. Open http://localhost:3000/verify in a new tab (no login needed)
4. Enter the reference number
5. Click "Verifier"

**Expected:**
- Shows certificate details:
  - Student name
  - Course name
  - Reference number
  - Issue date
  - Score
  - "Certificat authentique" message
- QR code visible
- Share options available

**Test Invalid Reference:**
1. Enter a fake reference (e.g., "FAKE-1234")
2. Click "Verifier"

**Expected:**
- Shows "Certificat introuvable" message
- Helpful error message displayed

**Status:** ⏳ PENDING - Please test in browser

---

## Étape 2: Test Technique (10 min)

### ✅ Test 2.1: Language Switching (FR/EN/AR)

**Instructions:**
1. On any page (home, dashboard, login), look for language selector (top-left)
2. Click each language:
   - **FR** (Francais) - Default
   - **EN** (English)
   - **AR** (العربية)

**Expected:**
- **FR**: All text in French
- **EN**: All text translates to English
- **AR**: 
  - All text in Arabic
  - Page direction changes to RTL (right-to-left)
  - Layout adjusts properly

**Persistence:**
1. Switch to English
2. Refresh the page (F5)
3. Language should remain English (saved in localStorage)

**Status:** ⏳ PENDING - Please test in browser

---

### ✅ Test 2.2: Dark/Light Mode

**Instructions:**
1. Look for theme toggle button (sun/moon icon, top-right)
2. Click to switch between dark and light modes

**Expected - Dark Mode:**
- Dark background
- Light text
- Proper contrast
- All elements visible

**Expected - Light Mode:**
- Light background
- Dark text
- Proper contrast
- All elements visible

**Persistence:**
1. Switch to light mode
2. Refresh page
3. Theme should remain light (saved in localStorage)

**Status:** ⏳ PENDING - Please test in browser

---

### ✅ Test 2.3: Responsive Design (Mobile/Desktop)

**Desktop:**
1. View on full-screen browser
2. Check all pages load correctly
3. Verify layout is not broken

**Mobile Simulation:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select mobile device (iPhone 12/14, Pixel 5)
4. Test all pages:
   - Home page
   - Login/Register
   - Dashboard
   - Admin panel
   - Course pages

**Expected:**
- All elements responsive
- No horizontal scrolling
- Touch-friendly buttons
- Navigation works on mobile
- Text readable at all sizes
- Forms usable on mobile

**Status:** ⏳ PENDING - Please test in browser

---

### ✅ Test 2.4: Blog and Articles

**Instructions:**
1. Navigate to blog section (if available in navigation)
2. Or access http://localhost:3000/blog (if route exists)
3. Check if blog posts are displayed

**If blog seed data exists:**
- Posts should show title, excerpt, date
- Click to read full article
- Content displays properly

**If no blog data:**
- May need to run: `npm run db:seed:blog`
- Or blog feature may be placeholder only

**Status:** ⏳ PENDING - Please check in browser

---

## Étape 3: Déploiement Production (20 min)

### Prerequisites Checklist

- [ ] Git repository initialized
- [ ] All code committed
- [ ] Production database ready (Neon PostgreSQL)
- [ ] Vercel account created
- [ ] Environment variables prepared

---

### ✅ Step 3.1: Set up PostgreSQL on Neon

**Instructions:**

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up (GitHub/Google/Email)
   - Create new project: "smartcodai-prod"

2. **Create Database**
   - Database name: `smartcodai_v2`
   - Note the connection string

3. **Get Connection String**
   - Go to "Connection Details"
   - Copy Prisma connection string
   - Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/smartcodai_v2?sslmode=require`

**Status:** ⏳ NOT STARTED

---

### ✅ Step 3.2: Configure GitHub Repository

**Instructions:**

```bash
# Navigate to project
cd "/Users/admin/Desktop/formation certif/V2 formation certif"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Smartcodai V2 platform"

# Create remote repository
# Go to GitHub.com → New Repository
# Name: smartcodai-v2
# Copy the remote URL

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/smartcodai-v2.git
git branch -M main
git push -u origin main
```

**Status:** ⏳ NOT STARTED

---

### ✅ Step 3.3: Environment Variables for Production

Create these in Vercel dashboard or `.env.production`:

```bash
# Database - PostgreSQL (Neon)
DB_PROVIDER="postgresql"
DATABASE_URL="postgresql://user:password@host:5432/smartcodai_v2?schema=public&sslmode=require"

# NextAuth - Generate secure secret
# Run: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="https://your-app-name.vercel.app"

# App
NODE_ENV="production"
```

**Status:** ⏳ NOT STARTED

---

### ✅ Step 3.4: Deploy to Vercel

**Option A: Vercel Dashboard (Recommended)**

1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub: `smartcodai-v2`
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `next build`
   - Output Directory: `.next`
5. Add environment variables (from Step 3.3)
6. Click "Deploy"

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts
# - Set up and deploy? Y
# - Which scope? (select yours)
# - Link to existing project? N
# - Project name? smartcodai-v2
# - Directory? ./
# - Override settings? N

# Add environment variables in Vercel dashboard after deploy

# Production deploy
vercel --prod
```

**Status:** ⏳ NOT STARTED

---

### ✅ Step 3.5: Migrate Data to Production

```bash
# After deployment, run database migration
# Set DATABASE_URL to production PostgreSQL

# Push schema to production
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed production data
npm run db:seed:all
```

This will create:
- 4 courses (PHP, Python, N8N, OpenClaw)
- All lessons with content
- Quiz questions
- Admin account (admin@smartcodai.com / admin123)

**Status:** ⏳ NOT STARTED

---

## Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| 1.1 Create Admin Account | ⏳ PENDING | |
| 1.2 Standard User Reg/Login | ⏳ PENDING | |
| 1.3 Verify 4 Courses | ⏳ PENDING | |
| 1.4 Admin Panel (Unlock) | ⏳ PENDING | |
| 1.5 Generate Certificate | ⏳ PENDING | |
| 1.6 Certificate Verification | ⏳ PENDING | |
| 2.1 Language Switching | ⏳ PENDING | |
| 2.2 Dark/Light Mode | ⏳ PENDING | |
| 2.3 Responsive Design | ⏳ PENDING | |
| 2.4 Blog/Articles | ⏳ PENDING | |
| 3.1 Neon PostgreSQL | ⏳ NOT STARTED | |
| 3.2 GitHub Repo | ⏳ NOT STARTED | |
| 3.3 Environment Variables | ⏳ NOT STARTED | |
| 3.4 Deploy to Vercel | ⏳ NOT STARTED | |
| 3.5 Migrate Data | ⏳ NOT STARTED | |

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Sync schema to database
npx prisma db seed       # Run seed script
npm run db:seed:all      # Seed all data (courses + lessons + quizzes)

# Generate secret key
openssl rand -base64 32  # Generate NEXTAUTH_SECRET
```

---

## Default Credentials

### Admin Account
- **Email**: admin@smartcodai.com
- **Password**: admin123
- **Role**: ADMIN (auto-assigned)

### Test User (after seeding)
- Create via registration page
- **Role**: USER (needs admin to unlock courses)

---

## Known Features

✅ User authentication (register/login/logout)  
✅ Role-based access (USER/ADMIN)  
✅ 4 courses with full content  
✅ Lesson progress tracking  
✅ Quiz system  
✅ Certificate generation with QR code  
✅ Public certificate verification  
✅ Multi-language support (FR/EN/AR with RTL)  
✅ Dark/Light theme  
✅ Admin panel for user management  
✅ Course unlock/lock functionality  
✅ Responsive design  

---

## Next Steps

1. **Complete functional tests** (Étape 1) in browser
2. **Complete technical tests** (Étape 2) in browser
3. **Document any bugs/issues** found during testing
4. **Fix critical bugs** before deployment
5. **Proceed with deployment** (Étape 3) after tests pass

---

**Good luck with testing! 🚀**
