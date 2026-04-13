# ============================================================
# Smartcodai V2 — Dockerfile (Production)
# Node.js 20 + PHP-CLI
# ============================================================

FROM node:20-alpine AS base

# ─── Installer PHP-CLI et outils ───
RUN apk add --no-cache \
    php83 \
    php83-cli \
    php83-json \
    php83-mbstring \
    php83-pdo \
    php83-pdo_pgsql \
    php83-pgsql \
    php83-session \
    php83-xml \
    php83-tokenizer \
    php83-phar \
    php83-dom \
    php83-simplexml \
    wget

# Créer le lien symbolique php pour que la commande `php` soit disponible
RUN ln -sf /usr/bin/php83 /usr/bin/php

# ─── Builder l'app ───
FROM base AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

# Générer Prisma client + build
RUN npx prisma generate
RUN npm run build

# ─── Production ───
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier le build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public/
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/scripts ./scripts/

# Logs directory pour le volume
RUN mkdir -p /app/logs && chown -R nextjs:nodejs /app/logs

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Script de démarrage : push DB + seed si besoin, puis démarrer
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
