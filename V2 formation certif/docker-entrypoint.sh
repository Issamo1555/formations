#!/bin/sh
# ============================================================
# Smartcodai V2 — Docker Entrypoint
# Initialise la base de données au premier démarrage
# ============================================================
set -e

echo "🚀 Smartcodai V2 — Démarrage..."

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL..."
for i in $(seq 1 30); do
  if nc -z postgres 5432 2>/dev/null; then
    echo "✅ PostgreSQL est prêt !"
    break
  fi
  echo "   Tentative $i/30..."
  sleep 2
done

# Pousser le schéma Prisma
echo "📦 Push du schéma Prisma..."
npx prisma db push --schema=prisma/schema.prod.prisma --accept-data-loss 2>&1 || echo "⚠️ Prisma db push a échoué (peut-être déjà à jour)"

# Seeder la base (uniquement si vide)
echo "🌱 Vérification du seed..."
LESSON_COUNT=$(npx tsx -e "
  import { PrismaClient } from '@prisma/client';
  const p = new PrismaClient();
  (async () => {
    const c = await p.lesson.count();
    console.log(c);
    await p.\$disconnect();
  })();
" 2>/dev/null || echo "0")

if [ "$LESSON_COUNT" = "0" ] || [ "$LESSON_COUNT" = "" ]; then
  echo "📚 Seed de la base de données..."
  npx tsx prisma/seed.ts 2>&1 || echo "⚠️ seed.ts échoué"
  npx tsx prisma/seed-lessons.ts 2>&1 || echo "⚠️ seed-lessons.ts échoué"
  npx tsx prisma/seed-quizzes.ts 2>&1 || echo "⚠️ seed-quizzes.ts échoué"
  echo "✅ Seed terminé !"
else
  echo "✅ Base déjà seedée ($LESSON_COUNT leçons trouvées)"
fi

echo ""
echo "=========================================="
echo "  Smartcodai V2 — Prêt !"
echo "  URL: http://localhost:3000"
echo "=========================================="
echo ""

# Exécuter la commande principale
exec "$@"
