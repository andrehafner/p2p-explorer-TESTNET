#!/bin/sh
# Apply custom patches to the explorer-frontend
# This script is run during Docker build after the frontend source is downloaded

set -e

echo "Applying custom patches..."

# 1. Copy Javanese translations (PR #198)
echo "Adding Javanese language support..."
mkdir -p /app/src/locales/jv
cp /patches/jv/translations.json /app/src/locales/jv/

# 2. Use Node.js for reliable JSON and file patching
echo "Applying patches with Node.js..."
node /patches/apply-patches.js

echo "Patches applied successfully!"
