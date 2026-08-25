@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo     [ Clem Portfolio ] - Production Build Script
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
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo [3/3] Building production bundle (Vite)...
echo.
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Production build failed.
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo     Build completed successfully! (dist/ folder)
echo ===================================================
echo.
pause
