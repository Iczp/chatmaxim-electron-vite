import { BrowserWindow } from 'electron';
import { WindowParams } from '../ipc-types';
import { addParamsToUrl } from './addParamsToUrl';
import { windowManager } from './windowManager';
import { initWindowEvent } from './initWindowEvent';
import { setWindow } from './windowSettingHandle';
import { preventClose } from './windowSettingHandle';

import { icon, preload } from '../global';
export const openPopWindowHandle = (
  _: Electron.IpcMainInvokeEvent,
  {
    event,
    window,
  }: {
    event: string;
    window?: WindowParams;
  },
): any => {
  return new Promise((resolve, reject) => {
    console.log('openPopWindowHandle', { window });
    const path = addParamsToUrl(window.path, { event, callerId: _.sender.id });
    window.path = path;
    console.warn('path', path);
    let popWindow = windowManager.get(window.name);
    if (!popWindow) {
      popWindow = windowManager.set(window.name, createPopWindow({ path }));
    }
    setWindow(popWindow, window, _);
    resolve({});
  });
};

export const createPopWindow = (window: WindowParams, _?: Electron.IpcMainInvokeEvent) => {
  let win = windowManager.getPop();
  if (win) {
    console.log('createPopWindow setWindow', window);
    setWindow(win, window, _);
    return win;
  }
   win = new BrowserWindow({
    title: 'Pop window',
    // minWidth: 240,
    // minHeight: 240,
    width: 360,
    height: 480,
    icon,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    show: false,
    frame: false,
    thickFrame: false,
    hasShadow: true,
    maximizable: false,
    minimizable: false,
    resizable: false,
    skipTaskbar: false,
    // transparent: true,
  });
  win.on('blur', () => {
    console.log('blur');
    if (win.isVisible()) {
      // win.hide();
    }
  });
  initWindowEvent(win, 'pop', window.path);
  preventClose(win, true);
  return win;
};
