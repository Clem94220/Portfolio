@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo     [ Neon Seoul ] - Portfolio Development Server
echo ===================================================
echo.

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo node_modules folder not found. Running "npm install"...
    call npm install
)

echo [3/3] Starting development server...
echo.
echo [*] The site will open automatically in your browser.
echo [*] Press Ctrl+C to stop the server.
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Something went wrong starting the server.
    pause
)

pause
