@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo     [ Clem Portfolio ] - Git Push to GitHub
echo ===================================================
echo.

echo Target Remote: https://github.com/Clem94220/Portfolio.git
echo Pushing latest commits to main and master branches...
echo.

"C:\Program Files\Git\cmd\git.exe" push origin main:main
"C:\Program Files\Git\cmd\git.exe" push origin main:master --force

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. Please check your internet connection or credentials.
    echo.
) else (
    echo.
    echo ===================================================
    echo     Push completed successfully to GitHub!
    echo ===================================================
    echo.
)

pause
