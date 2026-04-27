# PyInstaller spec for FARDI FastAPI backend

import sys
import os
from PyInstaller.utils.hooks import collect_all

block_cipher = None

# SPEC_DIR = APP_DESK/, BACKEND_DIR = backend/
SPEC_DIR = os.path.dirname(os.path.abspath(SPEC))
BACKEND_DIR = os.path.join(SPEC_DIR, '..', 'backend')

def B(rel):
    """Resolve a path relative to backend/"""
    return os.path.normpath(os.path.join(BACKEND_DIR, rel))

FRONTEND_DIST = os.path.normpath(os.path.join(SPEC_DIR, '..', 'frontend', 'dist'))
PROJECT_ROOT = os.path.normpath(os.path.join(SPEC_DIR, '..'))

# Collect all data files needed by the backend
datas = [
    (B('static'), 'static'),
    (B('models'), 'models'),
    (B('services'), 'services'),
    (B('routers'), 'routers'),
    (B('utils'), 'utils'),
    (FRONTEND_DIST, 'frontend_dist'),
    (os.path.join(PROJECT_ROOT, 'phase2.json'), '.'),
]

# Collect uvicorn and fastapi data
for pkg in ['uvicorn', 'fastapi', 'starlette', 'passlib', 'jose']:
    d, b, h = collect_all(pkg)
    datas += d

hiddenimports = [
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.loops.asyncio',
    'uvicorn.loops.uvloop',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.http.h11_impl',
    'uvicorn.protocols.http.httptools_impl',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
    'uvicorn.lifespan.off',
    'passlib.handlers.bcrypt',
    'passlib.handlers.sha2_crypt',
    'jose.backends',
    'multipart',
    'email.mime.text',
    'email.mime.multipart',
]

a = Analysis(
    [B('main.py')],
    pathex=[BACKEND_DIR],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='fardi-server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # no terminal window shown to users
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
