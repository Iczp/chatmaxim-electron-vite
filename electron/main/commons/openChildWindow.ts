import { BrowserWindow, ipcMain } from 'electron';
import { WindowParams } from '../types/WindowParams';
import { join } from 'node:path';
import { addParamsToUrl } from './addParamsToUrl';
import { ifBoolean } from './ifBoolean';
import * as windowManager from './windowManager';
import { subscribeWindowEvent } from './subscribeWindowEvent';

// process.env.DIST_ELECTRON = join(__dirname, '..');
// process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
// process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
//   ? join(process.env.DIST_ELECTRON, '../public')
//   : process.env.DIST;

const preload = join(__dirname, '../preload/index.js');

export const openChildWindow = (
  _: Electron.IpcMainInvokeEvent,
  {
    target,
    event,
    url,
    payload,
    window,
  }: {
    target: string;
    callerId?: number;
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
    const parent = windowManager.getMain();
    const path = addParamsToUrl(url, { event, callerId: _.sender.id });
    console.warn('args.url', url);
    console.warn('path', path);
    let childWindow = windowManager.get(target);
    if (!childWindow) {
      childWindow = windowManager.set(target, createChildWindow({ path }, parent));
    }
    childWindow.webContents.send('navigate', path);
    // args.callerId = _.sender.id;
    let isSuccess = false;

    const resolveFunc = (_: Electron.IpcMainEvent, arg: any) => {
      console.log('ipc main once aaa', _, arg);
      isSuccess = true;
      childWindow.close();
      resolve(arg);
    };

    const rejectFunc = (e: any) => {
      console.log('childWindow will close ==============', e);
      if (!isSuccess) {
        resolve({ success: false, message: 'window close' });
      }
      ipcMain.off(event, resolveFunc);
    };
    childWindow.once('close', rejectFunc);
    ipcMain.once(event, resolveFunc);

    // navTo(childWindow, url);
    setWindowProperties(childWindow, window);

    setWindowBounds(childWindow, window?.size);

    // childWindow.setContentSize(500, 800);
    // childWindow.center();
    childWindow.show();
  });
};

export const setWindowProperties = (win: BrowserWindow, params: WindowParams) => {
  ifBoolean(params?.maximizable, x => (win.maximizable = x));
  ifBoolean(params?.minimizable, x => (win.minimizable = x));
  ifBoolean(params?.closable, x => (win.closable = x));
  ifBoolean(params?.movable, x => (win.movable = x));
  ifBoolean(params?.resizable, x => (win.resizable = x));
  ifBoolean(params?.focusable, x => (win.focusable = x));
};

export const setWindowBounds = (
  win: BrowserWindow,
  size: {
    width: number;
    height: number;
  },
) => {
  if (!size) {
    return;
  }
  const parentBounds = win.getParentWindow().getBounds();
  const bounds = {
    x: parentBounds.x + Math.floor((parentBounds.width - size.width) / 2),
    y: parentBounds.y + Math.floor((parentBounds.height - size.height) / 2),
    ...size,
  };
  console.log('bounds', bounds);
  win.setBounds(bounds);
};

export const createChildWindow = ({ path }, parent?: BrowserWindow): BrowserWindow => {
  console.log('createChildWindow', path);

  const childWindow = new BrowserWindow({
    parent: parent,
    modal: true,
    maximizable: false,
    minimizable: false,
    // show: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: false,
    frame: true,
  });

  childWindow.webContents.on('did-finish-load', () => {
    childWindow?.webContents.send('main-process-message', `childWindowId:${childWindow.id}`);
  });
  parent.webContents.on('did-navigate-in-page', (_, ...args) => {
    console.log('did-navigate-in-page', _, ...args);
  });

  childWindow.on('close', e => {
    e.preventDefault();
    console.log('childWindow will close stoped:hide');
    childWindow.hide();
  });

  childWindow.removeMenu();

  subscribeWindowEvent(childWindow);

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${path}`);
    // Open devTool if the app is not packaged

    childWindow.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    const indexHtml = join(process.env.DIST, 'index.html');
    childWindow.loadFile(indexHtml, { hash: path });
  }

  return childWindow;
};
