#!/bin/bash
# Render Build Script - builds both client and server

echo "🔨 Building Banarasi Thekua Application..."

# Build client (React app)
echo "📦 Building client..."
cd client
npm install
npm run build
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo "✅ Build complete!"
