import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { initWindowEvent } from './initWindowEvent';
import { preventClose } from './windowSettingHandle';
import { icon, preload } from '../global';

export const createMainWindow = () => {
  const win = new BrowserWindow({
    title: 'Main window',
    // minWidth: 1560,
    // minHeight: 800,
    width: 1080,
    height: 750,
    icon: icon,
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
  win.on('close', () => win.setSkipTaskbar(true));
  win.on('show', () => win.setSkipTaskbar(false));
  initWindowEvent(win, 'main', '/');
  preventClose(win, true);
  return win;
};
