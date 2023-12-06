import { BrowserWindow, ipcMain, webContents } from 'electron';
import { WindowParams } from '../ipc-types';
import { join } from 'node:path';
import { addParamsToUrl } from './addParamsToUrl';
import { windowManager } from './windowManager';
import { sendEvent, initWindowEvent, sendWindowInfo } from './initWindowEvent';
import { setWindow } from './windowSettingHandle';

// process.env.DIST_ELECTRON = join(__dirname, '..');
// process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
// process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
//   ? join(process.env.DIST_ELECTRON, '../public')
//   : process.env.DIST;

const preload = join(__dirname, '../preload/index.js');

export const openChildWindowHandle = (
  _: Electron.IpcMainInvokeEvent,
  {
    target,
    event,
    url,
    payload,
    window,
  }: {
    /**
     * window name
     *
     * @type {string}
     */
    target: string;
    event: string;
    url: string;
    payload: any;
    window?: WindowParams;
  },
): any => {
  return new Promise((resolve, reject) => {
    console.log('open-child', {
      target,
      payload,
      window,
    });

    // parentWindowName
    const parentWindowName = 'chat----------';

    const parentWindow =
      windowManager.get(parentWindowName) ||
      BrowserWindow.fromWebContents(webContents.fromId(_.sender.id)) ||
      windowManager.getMain();
    const path = addParamsToUrl(url, { event, callerId: _.sender.id });
    console.warn('args.url', url);
    console.warn('path', path);
    let childWindow = windowManager.get(target);
    if (!childWindow) {
      childWindow = windowManager.set(
        target,
        createChildWindow({ name: target, path, isModel: window.isModel || false }, parentWindow),
      );
    }
    childWindow.webContents.send('navigate', path);
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

    setWindow(childWindow, window);
    // navTo(childWindow, url);

    // childWindow.setContentSize(500, 800);
    // childWindow.center();
    childWindow.show();
  });
};

export const createChildWindow = (
  {
    name,
    path,
    isModel,
  }: {
    name: string;
    path: string;
    isModel: boolean;
  },
  parent?: BrowserWindow,
): BrowserWindow => {
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

  win.on('close', e => {
    e.preventDefault();
    console.log('childWindow will close stoped:hide');
    win.hide();
  });

  win.removeMenu();

  initWindowEvent(win);

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${path}`);
    // Open devTool if the app is not packaged

    win.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    const indexHtml = join(process.env.DIST, 'index.html');
    win.loadFile(indexHtml, { hash: path });
  }

  return win;
};
