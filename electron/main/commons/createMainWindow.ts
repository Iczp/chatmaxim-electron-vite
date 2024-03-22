import { BrowserWindow } from 'electron';
import { initWindowEvent } from './initWindowEvent';
import { preventClose, setWindow } from '../handles/windowSettingHandle';
import { getBackgroundColor, globalState, icon, preload } from '../global';
import { windowManager } from './windowManager';
import { WindowParams } from '../ipc-types';

export const createMainWindow = (window: WindowParams, _?: Electron.IpcMainInvokeEvent) => {
  let win = windowManager.getMain();
  if (win) {
    console.log('createMainWindow setWindow', window);
    setWindow(win, window, _);
    return win;
  }
  win = new BrowserWindow({
    backgroundColor: getBackgroundColor(),
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
      webSecurity: false,
    },
    autoHideMenuBar: true,
    frame: false,
    // transparent: true,
  });
  win.on('close', () => win.setSkipTaskbar(true));
  win.on('show', () => win.setSkipTaskbar(false));
  // setWindow(win, { ...window, isPreventClose: true }, _);
  initWindowEvent(win, { name: 'main', path: window.path });
  preventClose(win, true);
  return win;
};
