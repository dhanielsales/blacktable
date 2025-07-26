#!/bin/bash

echo "🚀 Building BlackTable for Netlify deployment..."

# Clean previous build
rm -rf dist

# Build the project
npm run build

# Verify critical files exist
if [ -f "dist/_redirects" ]; then
    echo "✅ _redirects file found"
else
    echo "❌ _redirects file missing"
    exit 1
fi

if [ -f "dist/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Built files are in the 'dist' directory"
echo "🌐 Ready for Netlify deployment"

# Optional: Preview the build locally
echo ""
echo "To preview locally, run: npm run preview"
