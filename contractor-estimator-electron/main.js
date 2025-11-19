const { app, BrowserWindow } = require('electron');
const path = require('path');
const child_process = require('child_process');

let mainWindow;
let backendProcess = null;

function startBackend() {
  const backendPath = path.join(__dirname, 'backend');
  // Use node to start server.js
  backendProcess = child_process.spawn(process.execPath, [path.join(backendPath, 'server.js')], {
    cwd: backendPath,
    stdio: 'ignore',
    detached: true
  });
  backendProcess.unref();
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });

  // Load the frontend dev server if present, else load the built frontend index.html
  const devUrl = 'http://localhost:3000';
  mainWindow.loadURL(devUrl).catch(()=> {
    // Fallback to file served frontend build if exists
    const indexHtml = path.join(__dirname, 'frontend', 'dist', 'index.html');
    mainWindow.loadFile(indexHtml);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.on('ready', () => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  try {
    if (backendProcess) {
      process.kill(-backendProcess.pid);
    }
  } catch (e) {}
});
