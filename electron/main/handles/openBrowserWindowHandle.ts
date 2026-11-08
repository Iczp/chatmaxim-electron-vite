import { BrowserView, BrowserWindow, Menu, shell } from 'electron';
import { initWindowEvent } from '../commons/initWindowEvent';
import { preventClose, setWindow } from './windowSettingHandle';
import { getBackgroundColor, globalState, icon, preload } from '../global';
import { windowManager } from '../commons/windowManager';
import { WindowParams } from '../ipc-types';
import { IpcMainHandle } from '../IpcMainHandle';
import { BrowserPayload } from '../ipc-types/BrowserPayload';

const browserViews = new WeakMap<BrowserWindow, BrowserView>();

/** 只允许普通网页地址，禁止 file、javascript、data 等协议进入远程页面。 */
export const isWebUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && !!parsed.hostname;
  } catch {
    return false;
  }
};

export const openBrowserWindowHandle: IpcMainHandle = {
  channel: 'open-browser',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    args: { window: WindowParams; browser: BrowserPayload },
  ): any => {
    return new Promise((resolve, reject) => {
      try {
        createBrowserWindow(args);
        resolve({});
      } catch (error) {
        reject(error);
      }
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
  if (!isWebUrl(browser?.url)) throw new Error('只支持 HTTP 或 HTTPS 网页地址');
  if (window?.name !== 'browser' || window?.path !== '/browser') {
    throw new Error('无效的浏览器窗口参数');
  }
  let win = windowManager.get(window.name);
  if (win) {
    setWindow(win, window, _);
    const existingView = browserViews.get(win);
    if (existingView) void existingView.webContents.loadURL(browser.url).catch(() => {
      console.warn('[browser] 页面加载失败');
    });
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
      webSecurity: false,
    },
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    // transparent: true,
  });
  initWindowEvent(win, { name: window.name, path: window.path });

  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });
  browserViews.set(win, view);
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

  void view.webContents.loadURL(browser.url).catch(() => {
    console.warn('[browser] 页面加载失败');
  });

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

  // 远程页面的弹窗只能交给系统浏览器，不能继承本应用窗口权限。
  view.webContents.setWindowOpenHandler(({ url }) => {
    if (isWebUrl(url)) {
      void shell.openExternal(url).catch(() => console.warn('[browser] 打开外部链接失败'));
    }
    return { action: 'deny' };
  });

  const preventUnsafeNavigation = (event: Electron.Event, url: string) => {
    if (!isWebUrl(url)) event.preventDefault();
  };
  view.webContents.on('will-navigate', preventUnsafeNavigation);
  view.webContents.on('will-redirect', preventUnsafeNavigation);
  // 宿主只加载应用自身的路由；远程跳转必须留在隔离的 BrowserView 中。
  win.webContents.on('will-navigate', event => event.preventDefault());

  return win;
};
