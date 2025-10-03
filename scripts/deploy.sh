#!/bin/bash

# Deployment script for Cruise Blog CMS
# Builds static site and deploys to shared hosting via rsync

set -e

# Load environment variables
if [ -f "../frontend/.env" ]; then
  export $(cat ../frontend/.env | grep -v '^#' | xargs)
fi

echo "🚀 Starting deployment process..."

# Check required environment variables
if [ -z "$SSH_USER" ] || [ -z "$SSH_HOST" ] || [ -z "$SSH_PATH" ] || [ -z "$SSH_PASSWORD" ]; then
  echo "❌ Error: Missing SSH configuration in .env file"
  echo "Required variables: SSH_USER, SSH_HOST, SSH_PATH, SSH_PASSWORD"
  exit 1
fi

# Step 1: Build static site
echo ""
echo "📦 Building static site..."
cd ../frontend
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
  echo "❌ Error: Build failed - out/ directory not found"
  exit 1
fi

echo "✅ Build complete"

# Step 2: Deploy to server
echo ""
echo "🌐 Deploying to $SSH_HOST..."

# Use rsync to upload files
sshpass -p "$SSH_PASSWORD" rsync -avz --delete \
  -e "ssh -p ${SSH_PORT:-22} -o StrictHostKeyChecking=no" \
  out/ "$SSH_USER@$SSH_HOST:$SSH_PATH/"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployment successful!"
  echo "🌍 Your site should now be live"
else
  echo ""
  echo "❌ Deployment failed"
  exit 1
fi
