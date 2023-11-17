import { app, BrowserWindow, shell, ipcMain, webContents } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
// import { WinSize, WinEvents } from '../../ipc';
import Store from 'electron-store';
import { Size } from './types';
import { send } from 'vite';
import { addParamsToUrl } from './commons/addParamsToUrl';

//
Store.initRenderer();

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

type Windows = {
  [key: string | 'main' | 'child']: BrowserWindow;
};
const windows: Windows = {};

let win: BrowserWindow | null = null;
let childWindow: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
console.log('app.getPath', app.getAppPath(), app.getPath('userData'));

async function createWindow() {
  win = windows.main = new BrowserWindow({
    title: 'Main window',
    // minWidth: 1560,
    // minHeight: 800,
    width: 1080,
    height: 750,
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
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
  win.removeMenu();
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', `frameId:${win.id}`);
    createChildWindow({ path: '/settings' });
  });
  win.on('resized', e => {
    const a: any = {
      size: win.getSize(),
      getMaximumSize: win.getMaximumSize(),
      getMinimumSize: win.getMinimumSize(),
    };
    win?.webContents.send('resized', `resized:${JSON.stringify(a)}`);
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // win.webContents.on('will-navigate', (event, url) => { }) #344

  // // Renderer others
  // const nodeTrue = new BrowserWindow({
  //   webPreferences: {
  //     contextIsolation: false,
  //     nodeIntegration: true,
  //   },
  //   width: 700,
  //   height: 500,
  // });
  // if (process.env.VITE_DEV_SERVER_URL) {
  //   console.log('process.env.VITE_DEV_SERVER_UR', process.env.VITE_DEV_SERVER_URL);

  //   nodeTrue.loadURL(`${process.env.VITE_DEV_SERVER_URL}others/index.html`);
  //   nodeTrue.webContents.openDevTools({
  //     mode: 'right',
  //   });
  // } else {
  //   nodeTrue.loadFile(join(__dirname, '../dist/others/index.html'));
  // }
  // //end Renderer others
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

const createChildWindow = ({ path }): BrowserWindow => {
  if (childWindow) {
    return childWindow;
  }
  childWindow = new BrowserWindow({
    parent: win,
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
  win.webContents.on('did-navigate-in-page', (_, ...args) => {
    console.log('did-navigate-in-page', _, ...args);
  });

  childWindow.on('close', e => {
    e.preventDefault();
    console.log('childWindow will close stoped:hide');
    childWindow.hide();
  });

  childWindow.removeMenu();

  navTo(childWindow, path);

  return childWindow;
};

type Listener = (
  event: {
    preventDefault: () => void;
    readonly defaultPrevented: boolean;
  },
  url: string,
  isMainFrame: boolean,
  frameProcessId: number,
  frameRoutingId: number,
) => void;

const navTo = (win: BrowserWindow, path: string, listener?: Listener): void => {
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${url}#${path}`);
    // Open devTool if the app is not packaged

    win.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    win.loadFile(indexHtml, { hash: path });
  }
};
ipcMain.handle('open-win', (_, arg) => {});

// New window example arg: new windows url
ipcMain.handle(
  'open-child',
  (
    _,
    args: {
      target: string;
      callerId?: number;
      event: string;
      url: string;
      payload: any;
    },
  ) => {
    return new Promise((resolve, reject) => {
      console.log('open-child', args);

      args.callerId = _.sender.id;
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
        ipcMain.off(args.event, resolveFunc);
      };
      childWindow.once('close', rejectFunc);
      ipcMain.once(args.event, resolveFunc);
      // childWindow?.webContents.send('navigate', arg);
      const { event, callerId } = args;
      const url = addParamsToUrl(args.url, { event, callerId });
      console.warn('url', url);
      navTo(childWindow, url);
      childWindow.setContentSize(500, 800);
      childWindow.show();
    });
  },
);

ipcMain.handle('win-info', (_, arg) => {
  console.log('win-info', arg);
  return {
    return: 5,
  };
});

ipcMain.handle('win-resize', (_, arg: Size) => {
  console.log('win-resize', arg);
  win.setSize(arg.width, arg.height);
});

ipcMain.handle('send', (_, arg) => {
  console.log('send', _.sender.id, _, arg);
  const from = webContents.fromId(1);
  from.send(arg.data.event, arg);
  // _.sender.close();
  var b = webContents.fromId(_.sender.id);
  console.log('sender.id b', b?.id);

  childWindow.close();
  // webContents
  //   .getAllWebContents()
  //   .find(x => x.id == _.sender.id)
  //   ?.close();
  return 'aaa';
});
