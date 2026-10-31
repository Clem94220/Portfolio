@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo     [ Clem Portfolio ] - Git Push to GitHub
echo ===================================================
echo.

set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"
if not exist "%GIT_EXE%" set "GIT_EXE=git"

echo [1/3] Verification du repository Git...
if not exist ".git\" (
    echo Initialisation du repository Git...
    "%GIT_EXE%" init -b main
    "%GIT_EXE%" remote add origin https://github.com/Clem94220/Portfolio.git
    rem Dossier telecharge en ZIP : on se rattache a l'historique GitHub sans toucher aux fichiers
    "%GIT_EXE%" fetch origin
    "%GIT_EXE%" reset --soft origin/main
)

"%GIT_EXE%" remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    "%GIT_EXE%" remote add origin https://github.com/Clem94220/Portfolio.git
)

"%GIT_EXE%" config user.name >nul 2>&1
if %errorlevel% neq 0 (
    "%GIT_EXE%" config user.name "Clem94220"
    "%GIT_EXE%" config user.email "Clem94220@users.noreply.github.com"
)

echo [2/3] Verification et commit des fichiers modifies...
"%GIT_EXE%" add .
"%GIT_EXE%" status --porcelain | findstr /r "." >nul 2>&1
if %errorlevel% equ 0 (
    "%GIT_EXE%" commit -m "Mise a jour du portfolio"
    echo Modifications enregistrees !
) else (
    echo Tout est deja a jour pour le commit.
)

echo.
echo [3/3] Envoi vers GitHub (https://github.com/Clem94220/Portfolio.git)...
echo.

rem Recupere d'abord ce qui aurait ete modifie directement sur GitHub
set "PUSH_FAILED=0"
"%GIT_EXE%" pull --rebase origin main
if %errorlevel% neq 0 set "PUSH_FAILED=1"

if "%PUSH_FAILED%"=="0" (
    "%GIT_EXE%" push origin main:main
    if errorlevel 1 set "PUSH_FAILED=1"
)
if "%PUSH_FAILED%"=="0" (
    "%GIT_EXE%" push origin main:master
    if errorlevel 1 set "PUSH_FAILED=1"
)

if "%PUSH_FAILED%"=="1" (
    echo.
    echo [ERROR] Push echoue. Verifiez vos identifiants GitHub ou votre connexion.
    echo.
) else (
    echo.
    echo ===================================================
    echo     Push termine avec succes sur GitHub !
    echo ===================================================
    echo.
)

pause
