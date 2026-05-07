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

echo === 5. Assemble three delivery folders (m, n, w) ===
cd /d "%APP_DESK%"

for %%F in (m n w) do (
    if exist %%F rmdir /s /q %%F
    xcopy /E /I /Y dist\win-unpacked %%F
    copy /Y fardi.db %%F\fardi.db
)

echo.
echo Done!
echo Ship each folder separately:  APP_DESK\m\  APP_DESK\n\  APP_DESK\w\
echo Users double-click:  FARDI.exe  inside their folder
