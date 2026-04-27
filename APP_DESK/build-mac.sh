#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DESK="$ROOT/APP_DESK"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
ELECTRON="$APP_DESK/electron"

echo "=== 1. Build React frontend ==="
cd "$FRONTEND"
npm install
npm run build
# Copy dist into backend static so FastAPI can serve it
cp -r dist "$BACKEND/static/app"

echo "=== 2. Build PyInstaller backend binary ==="
cd "$BACKEND"
source venv/bin/activate || python3 -m venv venv && source venv/bin/activate
pip install -q pyinstaller
pip install -q -r requirements-fastapi.txt
pyinstaller "$APP_DESK/fardi-server.spec" --distpath "$APP_DESK/fardi-server-mac" --workpath "$APP_DESK/_pyibuild" --noconfirm

echo "=== 3. Install Electron deps ==="
cd "$ELECTRON"
npm install

echo "=== 4. Package .dmg ==="
npm run dist:mac

echo ""
echo "Done! Output: $APP_DESK/dist/"
echo "Ship to users:  APP_DESK/dist/FARDI-*.dmg  +  fardi.db"
