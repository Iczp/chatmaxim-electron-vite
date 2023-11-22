import { app, BrowserWindow, ipcMain, webContents } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import Store from 'electron-store';
import { Size } from './types';
import { WindowParams } from './types/WindowParams';
import { openChildWindow } from './commons/openChildWindow';
import { createMainWindow } from './commons/createMainWindow';
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

let win: BrowserWindow | null = null;
let childWindow: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
console.log('app.getPath', app.getAppPath(), app.getPath('userData'));

app.whenReady().then(() => {
  win = createMainWindow();
});
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    win = createMainWindow();
  }
});
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

ipcMain.handle('open-child', openChildWindow);

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

  // webContents
  //   .getAllWebContents()
  //   .find(x => x.id == _.sender.id)
  //   ?.close();
  return 'aaa';
});

ipcMain.handle(
  'win-setting',
  (_, { size, show, visiblity, sizeType, maximize, minimize }: WindowParams) => {
    const window = BrowserWindow.fromId(_.sender.id);
    var senderWindow: BrowserWindow = BrowserWindow.fromWebContents(
      webContents.fromId(_.sender.id),
    );
    console.log('win-setting', _.sender.id, window?.id, senderWindow?.id);

    if (maximize) {
      senderWindow.isMaximized() ? senderWindow.restore() : senderWindow.maximize();
    }

    minimize && senderWindow.minimize();

    if (size) {
      const parentBounds = senderWindow.getParentWindow().getBounds();
      const bounds = {
        x: parentBounds.x + Math.floor((parentBounds.width - size.width) / 2),
        y: parentBounds.y + Math.floor((parentBounds.height - size.height) / 2),
        ...size,
      };
      console.log('bounds', bounds);
      senderWindow.setBounds(bounds);
    }
    if (visiblity === false) {
      senderWindow?.hide();
    } else if (visiblity === true) {
      senderWindow?.show();
    }
    // senderWindow?.show();
    // ifBoolean(visiblity, visiblity ? senderWindow.show : senderWindow.hide);
  },
);
