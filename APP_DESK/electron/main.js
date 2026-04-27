const { app, BrowserWindow, dialog } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const http = require('http')
const net = require('net')

let PORT = 0

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.listen(0, '127.0.0.1', () => {
      const port = srv.address().port
      srv.close(() => resolve(port))
    })
    srv.on('error', reject)
  })
}

// Data dir: user's Application Support folder when packaged, APP_DESK in dev
function getDataDir() {
  if (app.isPackaged) {
    const dir = path.join(app.getPath('userData'), 'fardi-data')
    fs.mkdirSync(dir, { recursive: true })
    const dbDest = path.join(dir, 'fardi.db')
    if (!fs.existsSync(dbDest)) {
      // Prefer a fardi.db placed next to the exe (portable/migration use-case)
      const dbNextToExe = path.join(path.dirname(process.execPath), 'fardi.db')
      const dbSrc = fs.existsSync(dbNextToExe)
        ? dbNextToExe
        : path.join(process.resourcesPath, 'fardi.db')
      if (fs.existsSync(dbSrc)) fs.copyFileSync(dbSrc, dbDest)
    }
    return dir
  }
  return path.resolve(__dirname, '..')
}

function getServerBin() {
  if (app.isPackaged) {
    const ext = process.platform === 'win32' ? '.exe' : ''
    return path.join(process.resourcesPath, 'fardi-server', `fardi-server${ext}`)
  }
  // Dev fallback: run via uvicorn directly
  return null
}

let serverProcess = null
let mainWindow = null

function startServer() {
  const dataDir = getDataDir()
  const dbPath = path.join(dataDir, 'fardi.db')
  const bin = getServerBin()

  const env = {
    ...process.env,
    FARDI_DATA_DIR: dataDir,
    FARDI_DB_PATH: dbPath,
  }

  if (bin) {
    serverProcess = spawn(bin, ['--host', '0.0.0.0', '--port', String(PORT)], {
      env,
      cwd: dataDir,
    })
  } else {
    // Dev mode: spawn uvicorn from project root
    const backendDir = path.resolve(__dirname, '../../backend')
    serverProcess = spawn('uvicorn', ['main:app', '--host', '0.0.0.0', '--port', String(PORT)], {
      env: { ...env, PYTHONPATH: backendDir },
      cwd: backendDir,
    })
  }

  const logPath = path.join(app.getPath('userData'), 'fardi-server.log')
  const logStream = fs.createWriteStream(logPath, { flags: 'a' })
  serverProcess.stdout.on('data', (d) => { logStream.write(d); console.log('[server]', d.toString()) })
  serverProcess.stderr.on('data', (d) => { logStream.write(d); console.error('[server]', d.toString()) })
  serverProcess.on('exit', (code) => {
    logStream.end()
    console.log('[server] exited with code', code)
  })
}

function waitForServer(retries = 60, delay = 500) {
  return new Promise((resolve, reject) => {
    const check = (remaining) => {
      http.get(`http://localhost:${PORT}/api/health`, (res) => {
        if (res.statusCode === 200) resolve()
        else if (remaining > 0) setTimeout(() => check(remaining - 1), delay)
        else reject(new Error('Server did not start in time'))
      }).on('error', () => {
        if (remaining > 0) setTimeout(() => check(remaining - 1), delay)
        else reject(new Error('Server did not start in time'))
      })
    }
    check(retries)
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'FARDI',
    webPreferences: { contextIsolation: true },
  })
  mainWindow.loadURL(`http://localhost:${PORT}`)
  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(async () => {
  PORT = await getFreePort()
  startServer()
  try {
    await waitForServer()
    createWindow()
  } catch (err) {
    const logPath = path.join(app.getPath('userData'), 'fardi-server.log')
    dialog.showErrorBox('FARDI failed to start', `${err.message}\n\nCheck log: ${logPath}`)
    app.quit()
  }
})

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill()
})
