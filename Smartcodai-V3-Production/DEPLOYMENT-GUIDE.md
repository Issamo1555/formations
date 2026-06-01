# Smartcodai V2 - Migration Guide: Local → Hostinger VPS

## ✅ Completed Steps

### 1. PostgreSQL Local (Docker)
- ✅ PostgreSQL 17 running on port 5432
- ✅ PgAdmin running on port 5050
- ✅ Database `smartcodai_v2` created
- ✅ All data seeded (4 courses, 42 lessons, 3 blog posts, admin user)

### 2. Local Testing
- ✅ All functional tests passed
- ✅ Application running on http://localhost:3000
- ✅ Admin login: admin@smartcodai.com / admin123

---

## 🚀 Deploy to Hostinger VPS

### Prerequisites
- Hostinger VPS with Ubuntu 22.04/24.04
- SSH access to your server
- Domain name pointing to your VPS IP (optional but recommended)

### Step 1: Connect to your VPS
```bash
ssh root@YOUR_VPS_IP
```

### Step 2: Upload files to VPS

**Option A: Using Git (Recommended)**
```bash
# On your VPS
cd /var/www
git clone https://github.com/YOUR_USERNAME/smartcodai-v2.git
cd smartcodai-v2
```

**Option B: Using SCP**
```bash
# From your local machine
scp -r "/Users/admin/Desktop/formation certif/V2 formation certif" root@YOUR_VPS_IP:/var/www/smartcodai
```

**Option C: Using rsync**
```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude 'dev.db' \
  "/Users/admin/Desktop/formation certif/V2 formation certif/" \
  root@YOUR_VPS_IP:/var/www/smartcodai/
```

### Step 3: Run deployment script on VPS
```bash
# On your VPS
cd /var/www/smartcodai
chmod +x deploy-hostinger.sh
bash deploy-hostinger.sh
```

This script will:
1. Install Node.js 20.x
2. Install PostgreSQL
3. Create database and user
4. Install dependencies
5. Set up environment variables
6. Run database migrations
7. Seed data
8. Build the application
9. Install and configure PM2
10. Set up Nginx reverse proxy
11. Configure SSL with Let's Encrypt

### Step 4: Update configuration

**Edit Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/smartcodai
# Replace 'your-domain.com' with your actual domain
sudo nginx -t
sudo systemctl restart nginx
```

**Update .env on VPS:**
```bash
nano /var/www/smartcodai/.env
# Update NEXTAUTH_URL to your domain
NEXTAUTH_URL="https://your-domain.com"
```

### Step 5: Access your application
- Open browser: `https://your-domain.com`
- Login: `admin@smartcodai.com` / `admin123`

---

## 📊 Useful Commands

### Local Development
```bash
# Start PostgreSQL
docker compose up -d postgres

# Stop PostgreSQL
docker compose down

# View PgAdmin
# Open http://localhost:5050
# Login: admin@smartcodai.com / admin123

# Start dev server
npm run dev

# View database
DATABASE_URL="postgresql://smartcodai:Smartcodai2026!@localhost:5432/smartcodai_v2?schema=public&sslmode=disable" npx prisma studio
```

### Hostinger VPS
```bash
# Check app status
pm2 status

# View logs
pm2 logs smartcodai-v2

# Restart app
pm2 restart smartcodai-v2

# Check PostgreSQL
sudo systemctl status postgresql

# Check Nginx
sudo systemctl status nginx

# View database
sudo -u postgres psql smartcodai_v2
```

---

## 🔒 Security Checklist

- [ ] Change default admin password after first login
- [ ] Update PostgreSQL password in .env
- [ ] Enable UFW firewall (included in script)
- [ ] Set up SSL with Let's Encrypt (included in script)
- [ ] Regular database backups
- [ ] Keep system updated: `sudo apt update && sudo apt upgrade`

---

## 📝 Environment Variables

### Local (.env)
```env
DB_PROVIDER="postgresql"
DATABASE_URL="postgresql://smartcodai:Smartcodai2026!@localhost:5432/smartcodai_v2?schema=public&sslmode=disable"
NEXTAUTH_SECRET="dev-secret-key-change-in-production-abc123xyz789"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### Production (.env on VPS)
```env
DB_PROVIDER="postgresql"
DATABASE_URL="postgresql://smartcodai:YOUR_SECURE_PASSWORD@localhost:5432/smartcodai_v2?schema=public&sslmode=disable"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"
```

---

## 🐛 Troubleshooting

### PostgreSQL connection refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check port
sudo netstat -tlnp | grep 5432
```

### App not starting
```bash
# Check PM2 logs
pm2 logs smartcodai-v2

# Check if port is in use
sudo netstat -tlnp | grep 3000
```

### Database migration errors
```bash
# Reset and re-push
npx prisma db push --force-reset
npm run db:seed:all
```

---

## 🎯 Next Steps After Deployment

1. **Set up automated backups:**
   ```bash
   # Add to crontab
   0 2 * * * pg_dump smartcodai_v2 -U smartcodai > /backups/smartcodai_$(date +\%Y\%m\%d).sql
   ```

2. **Monitor with PM2:**
   ```bash
   pm2 monit
   ```

3. **Set up domain and SSL** (included in deployment script)

4. **Test all features** on production

5. **Share your platform!** 🚀
