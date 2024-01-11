import { BrowserWindow } from 'electron';
import { initWindowEvent } from '../commons/initWindowEvent';
import { preventClose, setWindow } from './windowSettingHandle';
import { icon, preload } from '../global';
import { windowManager } from '../commons/windowManager';
import { WindowParams } from '../ipc-types';
import { IpcMainHandle } from '../IpcMainHandle';

export const appSettingWindowName = 'app-settings';

export const openAppSettingsWindowHandle: IpcMainHandle = {
  channel: 'open-app-settings',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    window: WindowParams,
  ): any => {
    return new Promise((resolve, reject) => {
      console.log('openAppSettingsWindowHandle', { window });
      createAppSettingsWindow(window);
      resolve({});
    });
  }
};

export const createAppSettingsWindow = (window: WindowParams, _?: Electron.IpcMainInvokeEvent) => {
  let win = windowManager.get(appSettingWindowName);
  if (win) {
    console.log('createAppSettingsWindow setWindow', window);
    setWindow(win, window, _);
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
  initWindowEvent(win, appSettingWindowName, window.path);
  preventClose(win, true);
  return win;
};
