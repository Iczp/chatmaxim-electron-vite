import { BrowserWindow } from 'electron';
import { initWindowEvent } from './initWindowEvent';
import { preventClose } from './windowSettingHandle';
import { icon, preload } from '../global';
import { windowManager } from './windowManager';

export const createSettingWindow = () => {
  const winName = 'app-settings';
  let win = windowManager.get(winName);
  if (win) {
    win.show();
    return win;
  }
  win = new BrowserWindow({
    title: '设置',
    // minWidth: 1560,
    // minHeight: 800,
    width: 720,
    height: 480,
    icon,
    hasShadow: true,
    minimizable: false,
    maximizable: false,
    // resizable: false,
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
    skipTaskbar: true,
    // transparent: true,
  });
  win.on('close', () => win.setSkipTaskbar(true));
  win.on('show', () => win.setSkipTaskbar(false));
  initWindowEvent(win, winName, '/app-settings');
  preventClose(win, true);
  return win;
};
