#!/bin/bash
# Render Build Script - builds both client and server

set -e  # Exit on any error

echo "🔨 Building Banarasi Thekua Application..."

# Store the root directory
ROOT_DIR=$(pwd)
echo "📍 Root directory: $ROOT_DIR"

# Build client (React app)
echo "📦 Building client..."
cd "$ROOT_DIR/client"
echo "📁 Current directory: $(pwd)"

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📥 Installing client dependencies..."
  npm install
else
  echo "✅ Client dependencies already installed"
fi

# Run build
echo "🔨 Running client build..."
npm run build

if [ ! -d "dist" ]; then
  echo "❌ ERROR: Client build failed - dist directory not found"
  exit 1
else
  echo "✅ Client build successful - dist directory created"
  ls -la dist/ | head -10
fi

# Go back to root
cd "$ROOT_DIR"

# Install server dependencies
echo "📦 Installing server dependencies..."
cd "$ROOT_DIR/server"
echo "📁 Current directory: $(pwd)"

if [ ! -d "node_modules" ]; then
  echo "📥 Installing server dependencies..."
  npm install
else
  echo "✅ Server dependencies already installed"
fi

cd "$ROOT_DIR"

echo "✅ Build complete!"
echo "📂 Build artifacts:"
echo "  - Client: ./client/dist"
echo "  - Server: ./server/node_modules"
