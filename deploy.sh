#!/bin/bash
# WorkZen HRMS - Vercel Deployment Script
# This script sets all environment variables and deploys to Vercel
# Usage: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🚀 WorkZen HRMS - Vercel Deployment"
echo "===================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm i -g vercel
fi

# Set environment variables from server/.env
echo "🔐 Setting environment variables on Vercel..."

# Read from server/.env and set each var
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  
  # Remove quotes from value
  value=$(echo "$value" | sed 's/^"//;s/"$//')
  
  # Skip local-only vars
  [[ "$key" == "PORT" ]] && continue
  [[ "$key" == "CLIENT_URL" ]] && continue
  
  echo "  Setting $key..."
  echo "$value" | vercel env add "$key" production --force 2>/dev/null || true
done < server/.env

# Set production-specific vars
echo "  Setting NODE_ENV..."
echo "production" | vercel env add NODE_ENV production --force 2>/dev/null || true

echo ""
echo "✅ Environment variables set!"
echo ""

# Deploy
echo "🏗️  Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set up a free PostgreSQL on https://neon.tech"
echo "   2. Update DATABASE_URL: vercel env add DATABASE_URL production"
echo "   3. Run migrations on the production DB"
