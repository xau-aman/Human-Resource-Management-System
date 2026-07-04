#!/bin/bash
# WorkZen HRMS - Vercel Deployment Script (Fully Automated)
# Usage: chmod +x deploy.sh && ./deploy.sh

set -e

echo ""
echo "🚀 WorkZen HRMS - Vercel Deployment"
echo "====================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm i -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null 2>&1; then
  echo "🔑 Please login to Vercel first:"
  vercel login
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: Neon PostgreSQL URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   Go to https://neon.tech → Create project → Copy connection string"
echo "   Format: postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
echo ""
read -p "   Paste your Neon DATABASE_URL: " NEON_DB_URL

if [[ -z "$NEON_DB_URL" ]]; then
  echo "❌ DATABASE_URL cannot be empty!"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 2: Linking Vercel Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Link project if not already linked
if [ ! -d ".vercel" ]; then
  echo "   Linking project to Vercel..."
  vercel link
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 STEP 3: Setting Environment Variables (Automatic)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to set env var silently
set_env() {
  local key=$1
  local value=$2
  printf "%s" "$value" | vercel env add "$key" production --force 2>/dev/null || true
  echo "   ✅ $key"
}

# Set DATABASE_URL (Neon)
set_env "DATABASE_URL" "$NEON_DB_URL"

# Set NODE_ENV
set_env "NODE_ENV" "production"

# Read remaining vars from server/.env
while IFS='=' read -r key value; do
  # Skip comments, empty lines, and local-only vars
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  [[ "$key" == "DATABASE_URL" ]] && continue
  [[ "$key" == "PORT" ]] && continue
  [[ "$key" == "NODE_ENV" ]] && continue
  [[ "$key" == "CLIENT_URL" ]] && continue

  # Remove surrounding quotes
  value=$(echo "$value" | sed 's/^"//;s/"$//')

  set_env "$key" "$value"
done < server/.env

echo ""
echo "   ✅ All environment variables set!"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  STEP 4: Running Prisma Migrations on Production DB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run migrations against Neon DB
echo "   Running migrations on Neon DB..."
DATABASE_URL="$NEON_DB_URL" npx prisma migrate deploy --schema=server/prisma/schema.prisma
echo "   ✅ Migrations complete!"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌱 STEP 5: Seeding Production Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "   Seed the production database? (y/n): " SEED_CHOICE
if [[ "$SEED_CHOICE" == "y" || "$SEED_CHOICE" == "Y" ]]; then
  echo "   Seeding..."
  cd server
  DATABASE_URL="$NEON_DB_URL" npx ts-node prisma/seed.ts
  cd ..
  echo "   ✅ Database seeded!"
else
  echo "   ⏭️  Skipping seed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  STEP 6: Deploying to Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

vercel --prod

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   📌 Login credentials:"
echo "      Admin:    admin@workzen.com / admin123"
echo "      HR:       hr@workzen.com / admin123"
echo "      Employee: priya.sharma@workzen.com / emp123"
echo ""
echo "   🔗 Your app is live at the URL shown above ☝️"
echo ""
