@echo off
echo ====================================
echo Banarasi Thekua - Build and Deploy
echo ====================================
echo.

REM Check if we're in the right directory
if not exist "client\package.json" (
    echo ERROR: Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "server\package.json" (
    echo ERROR: Server folder not found
    pause
    exit /b 1
)

echo Step 1: Installing Server Dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Server dependencies installation failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Server dependencies installed
echo.

echo Step 2: Installing Client Dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ERROR: Client dependencies installation failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Client dependencies installed
echo.

echo Step 3: Building Client...
call npm run build
if errorlevel 1 (
    echo ERROR: Client build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Client built successfully
echo.

echo Step 4: Verifying Build Output...
if not exist "client\dist\index.html" (
    echo ERROR: Build output not found - index.html missing
    pause
    exit /b 1
)

if not exist "client\dist\_redirects" (
    echo WARNING: _redirects file not found in dist
    echo Copying _redirects to dist...
    copy "client\public\_redirects" "client\dist\_redirects"
)

if not exist "client\dist\404.html" (
    echo WARNING: 404.html not found in dist
    echo Copying 404.html to dist...
    copy "client\public\404.html" "client\dist\404.html"
)

echo [OK] Build output verified
echo.

echo ====================================
echo Build Complete!
echo ====================================
echo.
echo Next Steps:
echo 1. Push changes to GitHub:
echo    git add .
echo    git commit -m "Fix routing issues"
echo    git push
echo.
echo 2. Render will auto-deploy both services
echo.
echo 3. Update environment variables in Render:
echo    - VITE_API_URL for client
echo    - MONGODB_URI, CLIENT_SECRET_KEY, etc. for server
echo.
echo 4. Verify deployment:
echo    - Test direct URL access (e.g., /terms, /admin)
echo    - Test page refresh on any route
echo    - Check browser console for errors
echo.
pause
