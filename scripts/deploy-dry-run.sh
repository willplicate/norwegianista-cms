#!/bin/bash

# Dry-run deployment script
# Shows what files would be deployed without actually uploading

set -e

# Load environment variables
if [ -f "../frontend/.env" ]; then
  export $(cat ../frontend/.env | grep -v '^#' | xargs)
fi

echo "🔍 Dry-run deployment check..."

# Check required environment variables
if [ -z "$SSH_USER" ] || [ -z "$SSH_HOST" ] || [ -z "$SSH_PATH" ]; then
  echo "❌ Error: Missing SSH configuration in .env file"
  echo "Required variables: SSH_USER, SSH_HOST, SSH_PATH"
  exit 1
fi

# Check if build exists
if [ ! -d "../frontend/out" ]; then
  echo "❌ Error: No build found. Run 'npm run build' first"
  exit 1
fi

echo ""
echo "📋 Files that would be deployed:"
echo ""

# Show what would be deployed (dry-run)
rsync -avz --delete --dry-run \
  -e "ssh -p ${SSH_PORT:-22} -o StrictHostKeyChecking=no" \
  ../frontend/out/ "$SSH_USER@$SSH_HOST:$SSH_PATH/"

echo ""
echo "✅ Dry-run complete"
echo "💡 Run 'npm run deploy' to actually deploy these files"
