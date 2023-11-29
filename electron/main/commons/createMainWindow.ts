import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { windowManager } from './windowManager';
import { initWindowEvent, sendWindowInfo } from './initWindowEvent';

const preload = join(__dirname, '../preload/index.js');

export const createMainWindow = () => {
  const win = new BrowserWindow({
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
  windowManager.set('main', win);
  win.removeMenu();
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    const url = process.env.VITE_DEV_SERVER_URL;
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    const indexHtml = join(process.env.DIST, 'index.html');
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    sendWindowInfo(win);
    // createChildWindow({ path: '/settings' });
  });
  win.on('resized', (e: any) => {
    const a: any = {
      size: win.getSize(),
      getMaximumSize: win.getMaximumSize(),
      getMinimumSize: win.getMinimumSize(),
    };
    win?.webContents.send('resized', `resized:${JSON.stringify(a)}`);
  });

  initWindowEvent(win);

  return win;
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
};
