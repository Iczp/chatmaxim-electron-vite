import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { initWindowEvent } from './initWindowEvent';
import { preventClose } from './windowSettingHandle';
import { icon, preload } from '../global';

export const createLoginWindow = () => {
  const win = new BrowserWindow({
    title: '登录',
    // minWidth: 1560,
    // minHeight: 800,
    width: 320,
    height: 480,
    icon,
    hasShadow: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
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
    alwaysOnTop: true,
    // transparent: true,
  });
  win.on('close', () => win.setSkipTaskbar(true));
  win.on('show', () => win.setSkipTaskbar(false));
  initWindowEvent(win, 'login', '/login');
  preventClose(win, true);
  return win;
};
