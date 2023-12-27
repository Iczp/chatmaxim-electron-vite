import { app, BrowserWindow, ipcMain, webContents, screen, dialog, protocol } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import Store from 'electron-store';
import { openChildWindowHandle } from './commons/openChildWindowHandle';
import { createMainWindow } from './commons/createMainWindow';
import { windowSettingHandle } from './commons/windowSettingHandle';
import { initMachine } from './commons/machine';

import { websocketHandle } from './commons/webscoketHandle';
import { globalState } from './global';
import './commons/logger';
import './commons/tray';
import './commons/keyboardShortcuts';
import { createPopWindow, openPopWindowHandle } from './commons/openPopWindowHandle';
import { setTrayHandle } from './commons/setTrayHandle';
import setAppProtocol from './commons/setAppProtocol';

setAppProtocol('chatmaxim');

//
Store.initRenderer();

initMachine();

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
let pop: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
console.log('app.getPath', app.getAppPath(), app.getPath('userData'));

app.whenReady().then(() => {
  win = createMainWindow();
  pop = createPopWindow({});
  app.setBadgeCount(12);
});
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    win = createMainWindow();
  }
});
app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

ipcMain.handle('open-child', openChildWindowHandle);
ipcMain.handle('open-pop', openPopWindowHandle);
ipcMain.handle('win-setting', windowSettingHandle);
ipcMain.handle('websocket', websocketHandle);
ipcMain.handle('set-tray', setTrayHandle);

//

app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
});
