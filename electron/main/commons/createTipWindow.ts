import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { windowManager } from './windowManager';
import { initWindowEvent, sendWindowInfo } from './initWindowEvent';
import { preventClose } from './windowSettingHandle';

const preload = join(__dirname, '../preload/index.js');

export const createTipWindow = () => {
  const win = new BrowserWindow({
    title: 'Tip window',
    // minWidth: 240,
    // minHeight: 240,
    width: 360,
    height: 480,
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),

    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    show: true,
    frame: false,
    thickFrame: false,
    hasShadow: true,
    maximizable: false,
    minimizable: false,
    resizable: false,
    // transparent: true,
  });

  windowManager.set('tip', win);
  win.removeMenu();
  const path = '/tip';

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${path}`);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    const indexHtml = join(process.env.DIST, 'index.html');
    win.loadFile(indexHtml, { hash: path });
  }
  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    sendWindowInfo(win);
    // createChildWindow({ path: '/settings' });
  });
  win.on('blur', () => {
    console.log('blur');
    if (win.isVisible()) {
      // win.hide();
    }
  });
  initWindowEvent(win);
  preventClose(win, true);
  return win;
};
