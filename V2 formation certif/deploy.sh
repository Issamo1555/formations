#!/bin/bash
# Smartcodai V2 - Production Deployment Script
# Usage: ./deploy.sh

set -e

echo "========================================="
echo "  Smartcodai V2 - Production Deploy"
echo "========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set!"
    echo ""
    echo "1. Create a PostgreSQL database on Neon.tech:"
    echo "   → https://neon.tech"
    echo ""
    echo "2. Copy the Connection string (URI format):"
    echo "   postgresql://user:password@host:5432/dbname?sslmode=require"
    echo ""
    echo "3. Run this script again with:"
    echo "   DATABASE_URL='your-connection-string' ./deploy.sh"
    echo ""
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
echo ""

# Push schema to database
echo "🗄️  Pushing schema to database..."
npx prisma db push --accept-data-loss
echo ""

# Seed data
echo "🌱 Seeding courses..."
npx tsx prisma/seed.ts
echo ""

echo "🌱 Seeding lessons..."
npx tsx prisma/seed-lessons.ts
echo ""

echo "🌱 Seeding quizzes..."
npx tsx prisma/seed-quizzes.ts
echo ""

echo "🌱 Seeding blog posts..."
npx tsx prisma/seed-blog.ts
echo ""

echo "========================================="
echo "  ✅ Database setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Or push to GitHub and connect on vercel.com"
echo ""
echo "Admin account: admin@smartcodai.com / admin123"
echo ""
