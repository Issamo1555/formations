#!/bin/bash
# ============================================
# Smartcodai V2 - Hostinger VPS Deployment Script
# ============================================
# Run this script on your Hostinger VPS server
# Usage: bash deploy-hostinger.sh

set -e

echo "🚀 Smartcodai V2 - Hostinger Deployment"
echo "======================================="

# Configuration
APP_DIR="/var/www/smartcodai"
APP_USER="www-data"
APP_PORT=3000
DB_NAME="smartcodai_v2"
DB_USER="smartcodai"
DB_PASS="Smartcodai2026!"
DB_HOST="localhost"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${YELLOW}Step 1: Installing system dependencies...${NC}"
sudo apt update
sudo apt install -y curl git wget gnupg lsb-release

echo ""
echo -e "${YELLOW}Step 2: Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version

echo ""
echo -e "${YELLOW}Step 3: Installing PostgreSQL...${NC}"
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

echo ""
echo -e "${YELLOW}Step 4: Creating database...${NC}"
sudo -u postgres psql <<EOF
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOF

echo ""
echo -e "${YELLOW}Step 5: Setting up application directory...${NC}"
sudo mkdir -p ${APP_DIR}
sudo chown ${APP_USER}:${APP_USER} ${APP_DIR}

echo ""
echo -e "${YELLOW}Step 6: Deploying application files...${NC}"
# If using Git:
# cd ${APP_DIR}
# git clone https://github.com/YOUR_USERNAME/smartcodai-v2.git .
# Or copy files via scp/rsync

echo ""
echo -e "${YELLOW}Step 7: Installing dependencies...${NC}"
cd ${APP_DIR}
npm ci --production

echo ""
echo -e "${YELLOW}Step 8: Setting up environment variables...${NC}"
cat > ${APP_DIR}/.env <<ENVEOF
# Database
DB_PROVIDER="postgresql"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}?schema=public&sslmode=disable"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://your-domain.com"

# App
NODE_ENV="production"
ENVEOF

echo ""
echo -e "${YELLOW}Step 9: Running database migrations...${NC}"
npx prisma generate
npx prisma db push

echo ""
echo -e "${YELLOW}Step 10: Seeding database...${NC}"
npm run db:seed:all
npm run db:seed:blog

echo ""
echo -e "${YELLOW}Step 11: Building application...${NC}"
npm run build

echo ""
echo -e "${YELLOW}Step 12: Installing PM2 process manager...${NC}"
sudo npm install -g pm2

echo ""
echo -e "${YELLOW}Step 13: Starting application with PM2...${NC}"
pm2 start npm --name "smartcodai-v2" -- start -- --port ${APP_PORT}
pm2 save
pm2 startup

echo ""
echo -e "${YELLOW}Step 14: Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo ""
echo -e "${YELLOW}Step 15: Setting up Nginx reverse proxy...${NC}"
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/smartcodai <<NGINXEOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/smartcodai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo ""
echo -e "${YELLOW}Step 16: Setting up SSL with Let's Encrypt...${NC}"
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com --non-interactive --agree-tos --register-unsafely-without-email

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "   1. Update 'your-domain.com' in Nginx config with your actual domain"
echo "   2. Update NEXTAUTH_URL in .env with your actual domain"
echo "   3. Run: sudo certbot --nginx -d your-domain.com (for SSL)"
echo ""
echo "🌐 Your app is running at: http://localhost:${APP_PORT}"
echo "🔒 Admin login: admin@smartcodai.com / admin123"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status              - Check app status"
echo "   pm2 logs smartcodai-v2  - View logs"
echo "   pm2 restart smartcodai-v2 - Restart app"
echo "   sudo systemctl status nginx - Check Nginx"
echo "   sudo systemctl status postgresql - Check PostgreSQL"
