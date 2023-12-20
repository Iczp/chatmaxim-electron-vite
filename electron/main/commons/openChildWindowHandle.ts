import { BrowserWindow, ipcMain, webContents } from 'electron';
import { WindowParams } from '../ipc-types';
import { join } from 'node:path';
import { addParamsToUrl } from './addParamsToUrl';
import { windowManager } from './windowManager';
import { sendEvent, initWindowEvent, sendWindowInfo } from './initWindowEvent';
import { setWindow } from './windowSettingHandle';
import { globalState } from '../global';
import { loadUrl } from './loadUrl';

// process.env.DIST_ELECTRON = join(__dirname, '..');
// process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
// process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
//   ? join(process.env.DIST_ELECTRON, '../public')
//   : process.env.DIST;

const preload = join(__dirname, '../preload/index.js');

export const openChildWindowHandle = (
  _: Electron.IpcMainInvokeEvent,
  {
    event,
    // url,
    // payload,
    window,
  }: {
    event: string;
    // url: string;
    payload: any;
    window?: WindowParams;
  },
): any => {
  return new Promise((resolve, reject) => {
    console.log('open-child', { window });

    const parent = windowManager.get(window.parent);
    // || BrowserWindow.fromWebContents(webContents.fromId(_.sender.id)) || windowManager.getMain();
    const path = addParamsToUrl(window.path, { event, callerId: _.sender.id });
    window.path = path;
    console.warn('path', path);
    let childWindow = windowManager.get(window.name);
    if (!childWindow) {
      childWindow = windowManager.set(
        window.name,
        createChildWindow({
          parent,
          path,
          isModel: window.isModel || false,
        }),
      );
      childWindow.on('closed', e => windowManager.remove(window.name));
    }
    // childWindow.webContents.send('navigate', { path, payload: window.payload });
    // args.callerId = _.sender.id;
    let isSuccess = false;

    const resolveFunc = (_: Electron.IpcMainEvent, arg: any) => {
      console.log('ipc main once', arg);
      isSuccess = true;
      childWindow.close();
      resolve(arg);
    };

    const rejectFunc = (e: any) => {
      console.log(`window will close`, childWindow.id, e);
      if (!isSuccess) {
        resolve({ success: false, message: 'window close' });
      }
      ipcMain.off(event, resolveFunc);
    };
    childWindow.once('close', rejectFunc);
    ipcMain.once(event, resolveFunc);

    setWindow(childWindow, window, _);
    // navTo(childWindow, url);

    // childWindow.setContentSize(500, 800);
    // childWindow.center();
    // childWindow.show();
  });
};

export const createChildWindow = ({
  path,
  isModel,
  parent,
}: {
  path: string;
  isModel: boolean;
  parent?: BrowserWindow;
}): BrowserWindow => {
  console.log('createChildWindow', path);

  const win = new BrowserWindow({
    parent,
    modal: isModel,
    maximizable: false,
    minimizable: false,
    // show: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    frame: false,
    hasShadow: false,
  });

  const contents: Electron.WebContents = win.webContents;
  contents.on('did-finish-load', () => {
    sendWindowInfo(win);
  });
  contents.on('did-navigate-in-page', (_, ...args) => {
    console.log('did-navigate-in-page', _, ...args);
  });

  // preventClose(win, isPreventClose);

  win.removeMenu();

  initWindowEvent(win);

  loadUrl(win, { path });

  return win;
};
