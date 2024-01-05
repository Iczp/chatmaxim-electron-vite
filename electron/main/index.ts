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

import { app, BrowserWindow, ipcMain, webContents, screen, dialog, protocol } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import Store from 'electron-store';
import { openChildWindowHandle } from './commons/openChildWindowHandle';
import { createMainWindow } from './commons/createMainWindow';
import { windowSettingHandle } from './commons/windowSettingHandle';
import { initMachine } from './commons/machine';

import { websocketHandle } from './commons/webscoketHandle';
import './commons/logger';
import './commons/tray';
import './commons/keyboardShortcuts';
import { openPopWindowHandle } from './commons/openPopWindowHandle';
import { setTrayHandle } from './commons/setTrayHandle';
import setAppProtocol from './commons/setAppProtocol';
import { setAuthorizehandle } from './commons/setAuthorizehandle';
import { createLoginWindow } from './commons/createLoginWindow';
import { openAppSettingsWindowHandle } from './commons/openAppSettingsWindowHandle';
import { env } from './env';

setAppProtocol();

// import {Test} from '../../public/Test.ts'

//
Store.initRenderer();

initMachine();

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
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
console.log('app.getPath', app.getAppPath(), app.getPath('userData'));

//应用是否打包
if (app.isPackaged) {
  //设置开机启动
  app.setLoginItemSettings({
    openAtLogin: true,
  });
  //获取是否开机启动
  const appSetting = app.getLoginItemSettings();
  console.log('getLoginItemSettings', appSetting);
}

app.whenReady().then(() => {
  createLoginWindow({ path: 'login', visiblity: true });
  // win = createMainWindow();
  // pop = createPopWindow({});
});
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    win = createMainWindow({ path: '/' });
  }
});
app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', (event, argv) => {
  if (win) {
    // Focus on the main window if the user tried to open another
    win.show();
    win.focus();
  }
  // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
  if (process.platform === 'win32') {
    handleArgv(argv);
  }
});
const handleArgv = (argv: any[]) => {
  const url = argv.find(x => x.startsWith(env.url_scheme));
  if (url) {
    handleUrl(url);
  }
};
const handleUrl = (url: string) => {
  dialog.showErrorBox('handleUrl', url);
};

ipcMain.handle('open-child', openChildWindowHandle);
ipcMain.handle('open-pop', openPopWindowHandle);
ipcMain.handle('open-app-settings', openAppSettingsWindowHandle);
ipcMain.handle('win-setting', windowSettingHandle);
ipcMain.handle('websocket', websocketHandle);
ipcMain.handle('set-tray', setTrayHandle);
ipcMain.handle('authorize', setAuthorizehandle);
//
// macOS
app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
});
