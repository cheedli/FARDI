@echo off
setlocal

set ROOT=%~dp0..
set APP_DESK=%ROOT%\APP_DESK
set BACKEND=%ROOT%\backend
set FRONTEND=%ROOT%\frontend
set ELECTRON=%APP_DESK%\electron

echo === 1. Build React frontend ===
cd /d "%FRONTEND%"
call npm install
call npm run build
xcopy /E /I /Y dist "%BACKEND%\static\app"

echo === 2. Build PyInstaller backend binary ===
cd /d "%BACKEND%"
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -q pyinstaller
pip install -q -r requirements-fastapi.txt
pyinstaller "%APP_DESK%\fardi-server.spec" --distpath "%APP_DESK%\fardi-server-win" --workpath "%APP_DESK%\_pyibuild" --noconfirm

echo === 3. Install Electron deps ===
cd /d "%ELECTRON%"
call npm install

echo === 4. Package portable app folder ===
call npm run dist:win

echo === 5. Assemble app\ folder ===
cd /d "%APP_DESK%"
if exist app rmdir /s /q app
move dist\win-unpacked app
copy /Y fardi.db app\fardi.db

echo.
echo Done!
echo Ship to users:  the entire  APP_DESK\app\  folder
echo Users double-click:  app\FARDI.exe
