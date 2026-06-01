#!/bin/bash

# ==============================================================================
# VPS PRE-DEPLOYMENT AUDIT SCRIPT (Smartcodai Guardian)
# ==============================================================================
# Usage: bash vps_audit.sh
# ==============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}   SMARTCODAI - AUDIT DE PRÉ-DÉPLOIEMENT         ${NC}"
echo -e "${BLUE}==================================================${NC}"

# 1. Vérification RAM
echo -n "[1/8] Vérification de la RAM... "
FREE_RAM=$(free -m | awk '/^Mem:/{print $4}')
if [ "$FREE_RAM" -lt 200 ]; then
    echo -e "${RED}ERREUR (Seulement ${FREE_RAM}MB libre)${NC}"
    echo -e "${YELLOW}Attention: Le build Docker risque de crasher.${NC}"
else
    echo -e "${GREEN}OK (${FREE_RAM}MB libre)${NC}"
fi

# 2. Vérification Espace Disque
echo -n "[2/8] Vérification Disque (/)... "
DISK_FREE=$(df -h / | awk '/\//{print $4}' | sed 's/G//')
if [ "${DISK_FREE%.*}" -lt 2 ]; then
    echo -e "${RED}ALERTE (${DISK_FREE}GB restant)${NC}"
else
    echo -e "${GREEN}OK (${DISK_FREE}GB restant)${NC}"
fi

# 3. Vérification Docker
echo -n "[3/8] État de Docker... "
if command -v docker >/dev/null 2>&1; then
    docker ps >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}ACTIF${NC}"
    else
        echo -e "${RED}INSTALÉ MAIS NE RÉPOND PAS${NC}"
    fi
else
    echo -e "${RED}NON TROUVÉ${NC}"
fi

# 4. Vérification Docker Compose
echo -n "[4/8] État de Docker Compose... "
if docker compose version >/dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}NON TROUVÉ (V2 requis)${NC}"
fi

# 5. Versions logicielles (Stack Compatibility)
echo -e "${BLUE}--- Vérification des Versions ---${NC}"

# Node.js
NODE_VER=$(node -v 2>/dev/null)
if [[ $NODE_VER == v22.* ]] || [[ $NODE_VER == v20.* ]]; then
    echo -e "Node.js: ${GREEN}OK ($NODE_VER)${NC}"
else
    echo -e "Node.js: ${RED}ALERTE ($NODE_VER)${NC} -> Recommandé: v22.x"
fi

# Docker
DOCKER_VER=$(docker version --format '{{.Server.Version}}' 2>/dev/null)
echo -e "Docker Server: ${GREEN}$DOCKER_VER${NC}"

# Prisma (Si présent dans le dossier)
if [ -f "./package.json" ]; then
    PRISMA_VER=$(grep '"prisma":' package.json | awk -F': "' '{print $2}' | sed 's/",//')
    echo -e "Prisma (Package): ${GREEN}$PRISMA_VER${NC}"
fi

# Postgres (Docker)
DB_CONT=$(docker ps --filter "name=postgres" --format "{{.Names}}")
if [ -n "$DB_CONT" ]; then
    PG_VER=$(docker exec "$DB_CONT" psql -V 2>/dev/null | awk '{print $3}')
    echo -e "PostgreSQL (Docker): ${GREEN}$PG_VER${NC}"
else
    echo -e "PostgreSQL: ${YELLOW}Conteneur non trouvé${NC}"
fi

# 6. État des Ports (80 & 443)
echo -n "[6/8] Occupation des ports 80/443... "
P80=$(netstat -tuln | grep :80)
P443=$(netstat -tuln | grep :443)
if [ -z "$P80" ] && [ -z "$P443" ]; then
    echo -e "${GREEN}LIBRES${NC}"
else
    CONF_CONT=$(docker ps --format "{{.Names}}" --filter "publish=80" --filter "publish=443")
    echo -e "${YELLOW}OCCUPÉS${NC}"
    if [ -n "$CONF_CONT" ]; then
        echo -e "${RED}Attention: Le(s) conteneur(s) [$CONF_CONT] utilise(nt) déjà ces ports.${NC}"
        echo -e "${YELLOW}Action: docker stop $CONF_CONT && docker rm $CONF_CONT${NC}"
    fi
fi

# 6. Vérification du Domaine (DNS)
echo -n "[6/8] Test DNS (vocodata.com)... "
DOMAIN_IP=$(nslookup vocodata.com | grep 'Address' | tail -n1 | awk '{print $2}')
MY_IP=$(curl -s ifconfig.me)
if [ "$DOMAIN_IP" == "$MY_IP" ]; then
    echo -e "${GREEN}OK (Pointe vers ce serveur)${NC}"
else
    echo -e "${RED}ERREUR (Pointe vers $DOMAIN_IP)${NC}"
fi

# 7. Vérification Certificats SSL
echo -n "[7/8] Dossier SSL Certbot... "
if [ -d "./certbot/conf/live/vocodata.com" ] || [ -d "/etc/letsencrypt/live/vocodata.com" ]; then
    echo -e "${GREEN}TROUVÉ${NC}"
else
    echo -e "${YELLOW}MANQUANT (Nécessite Certbot)${NC}"
fi

# 8. Dossier de Projet (Espaces ?)
echo -n "[8/8] Analyse du dossier actuel... "
CUR_DIR=$(basename "$PWD")
if [[ "$CUR_DIR" == *" "* ]]; then
    echo -e "${RED}DANGER (Le dossier contient des espaces !)${NC}"
else
    echo -e "${GREEN}OK ($CUR_DIR)${NC}"
fi

echo -e "${BLUE}==================================================${NC}"
echo -e "Audit terminé. Vérifiez les messages en ${RED}ROUGE${NC}."
echo -e "${BLUE}==================================================${NC}"
