# ============================================================
# Smartcodai V2 — Turbo Dockerfile (Optimisé Mac/BuildKit)
# ============================================================

# ─── Base Stage ───
FROM node:20.18.1-alpine AS base
ENV NODE_ENV=production

# Dépendances système minimales
RUN apk add --no-cache php83 php83-cli php83-json php83-mbstring \
    php83-pdo php83-pdo_pgsql php83-pgsql php83-session php83-xml \
    php83-tokenizer php83-phar php83-dom php83-simplexml wget \
    && ln -sf /usr/bin/php83 /usr/bin/php

# ─── Builder Stage ───
FROM base AS builder
WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Étape Turbo : npm ci avec cache mount (persiste entre les builds)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev --ignore-scripts

# Copie du reste du code
COPY . .

# Génération Prisma et Build Next.js avec cache d'étape
RUN --mount=type=cache,target=/app/.next/cache \
    npx prisma generate --schema=prisma/schema.prod.prisma && \
    npm run build

# ─── Runner Stage ───
FROM base AS runner
WORKDIR /app

# Sécurité : utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Récupération du build standalone optimisé
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public/
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts/

# Installation de Prisma & tsx localement dans le runner pour le seed
# (Optimisé via cache mount)
RUN --mount=type=cache,target=/root/.npm \
    npm install prisma@6.2.0 @prisma/client@6.2.0 tsx

# Gestion des permissions
RUN mkdir -p /app/logs && chown -R nextjs:nodejs /app/logs /app/node_modules

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
