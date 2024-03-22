import { BrowserView, BrowserWindow, Menu } from 'electron';
import { initWindowEvent } from '../commons/initWindowEvent';
import { preventClose, setWindow } from './windowSettingHandle';
import { getBackgroundColor, globalState, icon, preload } from '../global';
import { windowManager } from '../commons/windowManager';
import { WindowParams } from '../ipc-types';
import { IpcMainHandle } from '../IpcMainHandle';
import { BrowserPayload } from '../ipc-types/BrowserPayload';

export const openBrowserWindowHandle: IpcMainHandle = {
  channel: 'open-browser',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    args: { window: WindowParams; browser: BrowserPayload },
  ): any => {
    return new Promise((resolve, reject) => {
      console.log('openBrowserWindowHandle', args);
      createBrowserWindow(args);
      resolve({});
    });
  },
};

export const createBrowserWindow = (
  {
    window,
    browser,
  }: {
    window: WindowParams;
    browser: BrowserPayload;
  },
  _?: Electron.IpcMainInvokeEvent,
) => {
  let win = windowManager.get(window.name);
  if (win) {
    console.log('createBrowserWindow setWindow', window);
    setWindow(win, window, _);
    return win;
  }
  win = new BrowserWindow({
    backgroundColor: getBackgroundColor(),
    title: '设置',
    minWidth: 240,
    minHeight: 160,
    width: 800,
    height: 600,
    icon,
    hasShadow: true,
    // minimizable: true,
    // maximizable: true,
    // resizable: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    // transparent: true,
  });
  initWindowEvent(win, { name: window.name, path: window.path });

  const view = new BrowserView({});
  win.setBrowserView(view);
  const headerHieght = 200;
  view.setBounds({
    x: 0,
    y: headerHieght,
    width: 800,
    height: win.getBounds().height - headerHieght,
  });

  view.setAutoResize({
    width: true,
    height: true,
    // horizontal: true,
    // vertical: true,
  });

  view.webContents.loadURL(browser.url);

  view.webContents.on('context-menu', (event, params) => {
    const menu = Menu.buildFromTemplate([
      { label: '复制', role: 'copy' },
      { type: 'separator' },
      {
        label: '在新标签页中打开链接',
        click: () => {
          console.log('new window');
        },
      },
    ]);
    menu.popup({ window: win });
  });

  const setWindowOpenHandler = (win: BrowserView | BrowserWindow) => {
    win.webContents.on('did-create-window', (win, detail) => {
      console.log('did-create-window', detail);
      setWindowOpenHandler(win);
    });

    win.webContents.setWindowOpenHandler((details: Electron.HandlerDetails) => {
      console.log('details', details);

      return {
        action: 'allow',
        outlivesOpener: true,
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
        },
      };
    });
  };

  setWindowOpenHandler(view);

  view.webContents.on('will-navigate', (event, url) => {
    event.preventDefault(); // 阻止在当前窗口打开链接
    console.log('will-navigate', url);
  });

  return win;
};
