import { BrowserWindow } from 'electron';
import { initWindowEvent } from '../commons/initWindowEvent';
import { preventClose, setWindow } from './windowSettingHandle';
import { getBackgroundColor, globalState, icon, preload } from '../global';
import { windowManager } from '../commons/windowManager';
import { WindowParams } from '../ipc-types';
import { IpcMainHandle } from '../IpcMainHandle';

export const openBrowserWindowHandle: IpcMainHandle = {
  channel: 'open-app-settings',
  handle: (_: Electron.IpcMainInvokeEvent, window: WindowParams): any => {
    return new Promise((resolve, reject) => {
      console.log('openBrowserWindowHandle', { window });
      createBrowserWindow(window);
      resolve({});
    });
  },
};

export const createBrowserWindow = (window: WindowParams, _?: Electron.IpcMainInvokeEvent) => {
  let win = windowManager.get(window.name);
  if (win) {
    console.log('createBrowserWindow setWindow', window);
    setWindow(win, window, _);
    return win;
  }
  win = new BrowserWindow({
    backgroundColor: getBackgroundColor(),
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
  initWindowEvent(win, { name: window.name, path: window.path });
  return win;
};
