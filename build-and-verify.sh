#!/bin/bash

echo "===================================="
echo "Banarasi Thekua - Build and Deploy"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "client/package.json" ]; then
    echo "ERROR: Please run this script from the project root directory"
    exit 1
fi

if [ ! -f "server/package.json" ]; then
    echo "ERROR: Server folder not found"
    exit 1
fi

echo "Step 1: Installing Server Dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Server dependencies installation failed"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Server dependencies installed"
echo ""

echo "Step 2: Installing Client Dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Client dependencies installation failed"
    cd ..
    exit 1
fi
echo "[OK] Client dependencies installed"
echo ""

echo "Step 3: Building Client..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Client build failed"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Client built successfully"
echo ""

echo "Step 4: Verifying Build Output..."
if [ ! -f "client/dist/index.html" ]; then
    echo "ERROR: Build output not found - index.html missing"
    exit 1
fi

if [ ! -f "client/dist/_redirects" ]; then
    echo "WARNING: _redirects file not found in dist"
    echo "Copying _redirects to dist..."
    cp "client/public/_redirects" "client/dist/_redirects"
fi

if [ ! -f "client/dist/404.html" ]; then
    echo "WARNING: 404.html not found in dist"
    echo "Copying 404.html to dist..."
    cp "client/public/404.html" "client/dist/404.html"
fi

echo "[OK] Build output verified"
echo ""

echo "===================================="
echo "Build Complete!"
echo "===================================="
echo ""
echo "Next Steps:"
echo "1. Push changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Fix routing issues'"
echo "   git push"
echo ""
echo "2. Render will auto-deploy both services"
echo ""
echo "3. Update environment variables in Render:"
echo "   - VITE_API_URL for client"
echo "   - MONGODB_URI, CLIENT_SECRET_KEY, etc. for server"
echo ""
echo "4. Verify deployment:"
echo "   - Test direct URL access (e.g., /terms, /admin)"
echo "   - Test page refresh on any route"
echo "   - Check browser console for errors"
echo ""
