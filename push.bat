@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo     [ Clem Portfolio ] - Git Push to GitHub
echo ===================================================
echo.

echo Target Remote: https://github.com/Clem94220/Portfolio.git
echo Branch: main
echo.
echo Pushing commits to GitHub...
echo (A browser window or credential popup may open to sign in)
echo.

"C:\Program Files\Git\cmd\git.exe" push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. If the remote repository already contains files,
    echo you may need to force push or pull first:
    echo "C:\Program Files\Git\cmd\git.exe" push -u origin main --force
    echo.
) else (
    echo.
    echo ===================================================
    echo     Push completed successfully to GitHub!
    echo ===================================================
    echo.
)

pause
