import { app, BrowserWindow, ipcMain, webContents } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import Store from 'electron-store';
import { Size } from './ipc-types';
import { openChildWindowHandle } from './commons/openChildWindowHandle';
import { createMainWindow } from './commons/createMainWindow';
import { windowSettingHandle } from './commons/windowSettingHandle';
import { initMachine } from './commons/machine';
import './commons/logger';
import { websocketHandle } from './commons/webscoketHandle';
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
let childWindow: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
console.log('app.getPath', app.getAppPath(), app.getPath('userData'));

app.whenReady().then(() => {
  win = createMainWindow();
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

type Listener = (
  event: {
    preventDefault: () => void;
    readonly defaultPrevented: boolean;
  },
  url: string,
  isMainFrame: boolean,
  frameProcessId: number,
  frameRoutingId: number,
) => void;

const navTo = (win: BrowserWindow, path: string, listener?: Listener): void => {
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${url}#${path}`);
    // Open devTool if the app is not packaged

    win.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    win.loadFile(indexHtml, { hash: path });
  }
};

ipcMain.handle('open-child', openChildWindowHandle);
ipcMain.handle('win-setting', windowSettingHandle);
ipcMain.handle('websocket', websocketHandle);
