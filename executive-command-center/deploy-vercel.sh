#!/bin/bash

# Vercel Automated Deployment Script
# Team ID: SgJ4AqVmPbA8nrIYbvs9Mmum

echo "🚀 Deploying Executive Command Center to Vercel..."
echo "================================================"

# Set team scope
export VERCEL_ORG_ID="SgJ4AqVmPbA8nrIYbvs9Mmum"
export VERCEL_PROJECT_ID="exalt-executive-command-center"

# Deploy to development (preview)
echo "📦 Deploying to Development Environment..."
vercel --yes \
  --name="exalt-executive-command-center" \
  --scope="SgJ4AqVmPbA8nrIYbvs9Mmum" \
  --build-env NODE_OPTIONS="--openssl-legacy-provider" \
  --build-env REACT_APP_API_BASE_URL="https://api-dev.exalt.com" \
  --build-env REACT_APP_AUTH_DOMAIN="dev.exalt.com" \
  --build-env REACT_APP_ENVIRONMENT="development" \
  --build-env REACT_APP_VERSION="1.0.0-dev" \
  --build-env REACT_APP_ENABLE_ANALYTICS="false" \
  --build-env REACT_APP_LOG_LEVEL="debug"

echo ""
echo "✅ Development deployment complete!"
echo ""
echo "To deploy to staging, run: vercel --prod"
echo ""
echo "📋 Post-Deployment Steps:"
echo "1. Visit your Vercel dashboard"
echo "2. Configure custom domains if needed"
echo "3. Set up environment variables for different environments"
echo ""
echo "🔑 Demo Access:"
echo "Username: executive@exalt.com"
echo "Password: demo123"