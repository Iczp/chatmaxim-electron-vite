import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { windowManager } from './windowManager';
import { initWindowEvent, sendWindowInfo } from './initWindowEvent';
import { loadUrl } from './loadUrl';
import { preventClose } from './windowSettingHandle';

const preload = join(__dirname, '../preload/index.js');

export const createMainWindow = () => {
  const win = new BrowserWindow({
    title: 'Main window',
    // minWidth: 1560,
    // minHeight: 800,
    width: 1080,
    height: 750,
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    hasShadow: true,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    frame: false,
    // transparent: true,
  });
  windowManager.set('main', win);
  win.removeMenu();
  loadUrl(win, { path: '/' });
  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    sendWindowInfo(win);
    // createChildWindow({ path: '/settings' });
  });
  // win.on('resized', (e: any) => {
  //   const a: any = {
  //     size: win.getSize(),
  //     getMaximumSize: win.getMaximumSize(),
  //     getMinimumSize: win.getMinimumSize(),
  //   };
  //   win?.webContents.send('resized', `resized:${JSON.stringify(a)}`);
  // });

  win.on('close', () => win.setSkipTaskbar(true));
  win.on('show', () => win.setSkipTaskbar(false));

  initWindowEvent(win);
  preventClose(win, true);
  return win;
};
