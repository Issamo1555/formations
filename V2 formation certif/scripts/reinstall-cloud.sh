#!/bin/bash
# ============================================================
# Smartcodai V2 — Script de Réinstallation Propre (CLOUD)
# ============================================================
# Ce script arrête tout, efface les volumes (données DB)
# et relance une installation complète avec SEED.
# ============================================================

echo "🛑 Arrêt des conteneurs existants..."
docker compose down

echo "🧹 Nettoyage des anciennes images..."
docker image prune -f

echo "🚀 Reconstruction et démarrage de l'infrastructure..."
docker compose up -d --build

echo "⏳ Attente du démarrage de l'application..."
sleep 10

echo "🔍 Vérification des logs de démarrage..."
docker compose logs --tail=50 app

echo "✅ Réinstallation terminée sur vocodata.com !"
echo "⚠️  Note : La base de données est en cours de peuplement (Seed)."
echo "   Vous pouvez suivre la progression avec : docker compose logs -f app"
