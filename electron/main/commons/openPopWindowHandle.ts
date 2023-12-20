import { BrowserWindow } from 'electron';
import { WindowParams } from '../ipc-types';
import { join } from 'node:path';
import { addParamsToUrl } from './addParamsToUrl';
import { windowManager } from './windowManager';
import { initWindowEvent, sendWindowInfo } from './initWindowEvent';
import { setWindow } from './windowSettingHandle';
import { preventClose } from './windowSettingHandle';
import { loadUrl } from './loadUrl';

const preload = join(__dirname, '../preload/index.js');

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
      popWindow.on('closed', e => windowManager.remove(window.name));
    }
    setWindow(popWindow, window, _);
    resolve({});
  });
};

export const createPopWindow = ({ path = '/pop' }: { path?: string }) => {
  const win = new BrowserWindow({
    title: 'Pop window',
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

  windowManager.set('pop', win);
  win.removeMenu();

  loadUrl(win, { path });
  
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
