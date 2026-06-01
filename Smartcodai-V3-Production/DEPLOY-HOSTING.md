# 🚀 Déploiement Smartcodai V2 sur Hostinger

## ✅ Ce qui est prêt

- [x] Code sur GitHub: https://github.com/Issamo1555/formations
- [x] PostgreSQL local fonctionnel (Docker)
- [x] Script de déploiement automatisé
- [x] Base de données seedée avec tout le contenu

---

## 📋 Étapes pour déployer sur Hostinger

### 1. Préparer le serveur Hostinger VPS

Connectez-vous à votre serveur :
```bash
ssh root@VOTRE_IP_HOSTINGER
```

### 2. Créer le dossier et cloner le projet

```bash
mkdir -p /var/www/smartcodai
cd /var/www/smartcodai
git clone https://github.com/Issamo1555/formations.git .
cd "V2 formation certif"
```

### 3. Lancer le script de déploiement

```bash
chmod +x deploy-hostinger.sh
bash deploy-hostinger.sh
```

**Le script va automatiquement :**
1. Installer Node.js 20.x
2. Installer PostgreSQL
3. Créer la base de données `smartcodai_v2`
4. Installer les dépendances npm
5. Configurer les variables d'environnement
6. Pousser le schéma Prisma
7. Seeder la base (cours, leçons, quiz, blog)
8. Builder l'application Next.js
9. Installer PM2 et démarrer l'app
10. Configurer Nginx
11. Configurer SSL (si domaine configuré)

### 4. Après le déploiement

**Mettre à jour le domaine :**
```bash
sudo nano /etc/nginx/sites-available/smartcodai
# Remplacer "your-domain.com" par votre vrai domaine
sudo nginx -t
sudo systemctl restart nginx
```

**Mettre à jour NEXTAUTH_URL :**
```bash
nano /var/www/smartcodai/"V2 formation certif"/.env
# Remplacer NEXTAUTH_URL=https://your-domain.com
pm2 restart smartcodai-v2
```

---

## 🔗 Accès après déploiement

| Service | URL |
|---------|-----|
| Application | http://VOTRE_IP:3000 ou https://votre-domaine.com |
| PgAdmin | http://VOTRE_IP:5050 |
| API | http://VOTRE_IP:3000/api/* |
| Admin Panel | /admin |

### 🔑 Comptes par défaut

**Admin :**
- Email: `admin@smartcodai.com`
- Password: `admin123`

---

## 📊 Commandes utiles sur le VPS

```bash
# Vérifier l'état de l'app
pm2 status
pm2 logs smartcodai-v2

# Redémarrer l'app
pm2 restart smartcodai-v2

# Voir les logs
pm2 logs smartcodai-v2 --lines 100

# Mettre à jour le code
cd /var/www/smartcodai/"V2 formation certif"
git pull
npm run build
pm2 restart smartcodai-v2

# Base de données
sudo systemctl status postgresql
sudo -u postgres psql smartcodai_v2

# Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🐛 En cas de problème

**L'app ne démarre pas :**
```bash
pm2 logs smartcodai-v2
# Vérifier les erreurs dans les logs
```

**PostgreSQL ne fonctionne pas :**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**Port 3000 déjà utilisé :**
```bash
sudo lsof -i :3000
# Changer le port dans deploy-hostinger.sh (APP_PORT)
```

---

**Prêt à déployer ? Connectez-vous à votre VPS et lancez le script !** 🎯
