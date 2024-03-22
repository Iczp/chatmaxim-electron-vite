import {
  app,
  Tray,
  Menu,
  nativeImage,
  Notification,
  Rectangle,
  Point,
  ipcMain,
  MenuItem,
} from 'electron';
import { windowManager } from './windowManager';
import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { initWindowEvent, sendWindowInfo } from './initWindowEvent';
import { preventClose, setWindow } from '../handles/windowSettingHandle';
import { globalState, isAuthorized } from '../global';
import { loadUrl } from './loadUrl';

import { icon, preload } from '../global';
import {
  appSettingWindowName,
  createAppSettingsWindow,
} from '../handles/openAppSettingsWindowHandle';
import { WindowParams } from '../ipc-types';
import { env } from '../env';

process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

const trayIconUrl = `${process.env.DIST}/tray.png`;
const trayIconEmptyUrl = `${process.env.DIST}/tray-empty.png`;
let tray: Tray;
let trayWindow: BrowserWindow;
let trayTimer: NodeJS.Timeout;
let trayTimes: number = 0;
export const startFlash = (flashIconUrl?: string) => {
  stopFlash();
  trayTimer = setInterval(() => {
    trayTimes++;
    let iconUrl = trayTimes % 2 == 1 ? flashIconUrl || trayIconUrl : trayIconEmptyUrl;
    const trayIcon = nativeImage.createFromPath(iconUrl);
    tray.setImage(trayIcon);
  }, 500);
};

export const stopFlash = () => {
  trayTimes = 0;
  if (trayTimer) {
    clearInterval(trayTimer);
  }
  const trayIcon = nativeImage.createFromPath(trayIconUrl);
  tray.setImage(trayIcon);
};
app.whenReady().then(() => {
  // const icon = nativeImage.createFromPath('path/to/asset.png')
  //   const icon = nativeImage.createFromDataURL(
  //     'data:image/png;base64,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',
  //   );
  //   tray = new Tray(icon);

  //   const contextMenu = Menu.buildFromTemplate([
  //     { label: 'Item1', type: 'radio' },
  //     { label: 'Item2', type: 'radio' },
  //     { label: 'Item3', type: 'radio', checked: true },
  //     { label: 'Item4', type: 'radio' },
  //   ]);

  //   tray.setToolTip('This is my application');
  //   tray.setTitle('This is my title');
  //   tray.setContextMenu(contextMenu);

  createTray();
  createTrayWindow({});
});

const NOTIFICATION_TITLE = '日春茶业-桌面端';
const NOTIFICATION_BODY = '你有新的消息---Iczp.Net';
// app.setAppUserModelId(env.app_id);
function showNotification() {
  const notice = new Notification(<Electron.NotificationConstructorOptions>{
    title: app.getName(),
    body: NOTIFICATION_BODY,
    subtitle: 'subtitle',
    silent: true,
    icon: trayIconUrl,
    timeoutType: 'default',
    closeButtonText: '关闭（close）',
  });
  notice.show();
  notice.on('click', arg => {
    console.log('Notification click', JSON.stringify(arg));
  });
  return notice;
}

export const createTray = () => {
  // const appIcon = new Tray('./src/assets/logo.png')
  // console.log('appIcon', appIcon)

  const trayIcon = nativeImage.createFromPath(trayIconUrl);
  // console.log('icon', icon);
  tray = new Tray(trayIcon);
  // tray = new Tray('./static/logo.png')
  // tray.setImage()

  const productName = env.app_name;
  // const productName = app.getName();
  tray.setToolTip(`${productName}`);
  tray.setTitle(`${productName}`);

  const contextMenu = Menu.buildFromTemplate(<Electron.MenuItemConstructorOptions[]>[
    {
      label: '设置',
      type: 'normal',
      click(menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) {
        console.log('', menuItem);

        createAppSettingsWindow({
          name: appSettingWindowName,
          path: '/app-settings',
          visiblity: true,
        });
        // setTimeout(() => {
        //   tray.displayBalloon(<Electron.DisplayBalloonOptions>{
        //     icon: trayIconUrl,
        //     iconType: 'custom',
        //     title: '7777',
        //     content: '0000000000',
        //   });
        //   showNotification();
        // }, 3000);
      },
    },
    {
      label: '关于',
      type: 'normal',
      click(menuItem, browserWindow, event) {
        createAppSettingsWindow({
          name: appSettingWindowName,
          path: '/app-settings/about',
          visiblity: true,
        });
      },
    },
    {
      type: 'separator',
    },
    {
      label: `退出${productName}`,
      type: 'normal',
      click(menuItem, browserWindow, event) {
        // stopFlash();
        // console.log('logout');
        // windowManager.closeAll();
        tray.destroy();
        trayWindow.destroy();
        app.quit();
        BrowserWindow.getAllWindows().forEach(x => {
          console.log('win id:', x.id);
        });
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    const win = isAuthorized() ? windowManager.getMain() : windowManager.getLogin();
    setWindow(win, { isPreventClose: true, visiblity: true, focus: true }, null);
    // win.show();
    // win.focus();
    //
  });
  tray.on('double-click', e => {
    console.log('double-click', e);
    tray.popUpContextMenu();
    stopFlash();
  });
  tray.on('mouse-enter', () => trayShow());
  tray.on('mouse-enter', e => {
    console.log('mouse-enter', e);
  });
  tray.on('mouse-move', () => trayShow());
  tray.on('mouse-leave', trayHide);
};

export const createTrayWindow = (window: WindowParams, _?: Electron.IpcMainInvokeEvent) => {
  trayWindow = windowManager.getTray();
  if (trayWindow) {
    console.log('createTrayWindow setWindow', window);
    setWindow(trayWindow, window, _);
    return trayWindow;
  }
  trayWindow = new BrowserWindow({
    title: 'Tray',
    // minWidth: 240,
    // minHeight: 240,
    width: 240,
    height: 560,
    icon,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    autoHideMenuBar: true,
    show: true,
    frame: false,
    thickFrame: false,
    hasShadow: true,
    maximizable: false,
    minimizable: false,
    resizable: false,
    closable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    // transparent: true,
  });
  trayWindow.on('blur', () => trayWindow.hide());
  initWindowEvent(trayWindow, { name: 'tray', path: window.path });
  preventClose(trayWindow, true);
  return trayWindow;
};

let isEnter: boolean = false;
let isContentOver: boolean = false;

/**
 *
 * @param {Electron.IpcMainInvokeEvent} _
 * @param {{ isOver?: boolean }} payload
 * @return {*}  {*}
 */
export const contentOverHandle = (
  _: Electron.IpcMainInvokeEvent,
  payload: { isOver?: boolean },
): any => {
  return new Promise((resolve, reject) => {
    globalState.trayWebContent = payload;
    isContentOver = payload.isOver;
    if (payload.isOver === false) {
      trayHide();
    }
    resolve({});
  });
};
ipcMain.handle('content-over', contentOverHandle);

/**
 * trayHide
 */
const trayHide = (): void => {
  console.log('trayHide');
  isEnter = false;
  trayWindow.hide();
};

/**
 * trayShow
 */
const trayShow = (force?: boolean): void => {
  // event: KeyboardEvent, point: Point
  // {
  //   shiftKey: false,
  //   ctrlKey: false,
  //   altKey: false,
  //   metaKey: false,
  //   triggeredByAccelerator: true
  // }
  // { x: 2166, y: 1294, width: 41, height: 42 } { x: 2184, y: 1317 }

  try {
    const { windowWidth, items, headerHeight, footerHeight, itemHeight, margin, totalBadge } =
      globalState.trayPayload;
    if (trayWindow.isVisible() || items.length + totalBadge == 0) {
      //|| items.length == 0|| isEnter
      // console.log('trayWindow.isVisible', trayWindow.isVisible());
      return;
    }
    // isEnter = true;
    // console.log('trayShow', event, point);
    const rect = tray.getBounds();

    const itemCount: number = items?.length || 0;
    let width = windowWidth;
    let height = itemHeight * itemCount + headerHeight + footerHeight; // trayBounds.height;
    const data = {
      x: Math.floor(rect.x - width / 2),
      y: Math.floor(rect.y - height - margin),
      width,
      height,
    };
    console.log(data);

    trayWindow.setBounds(data);
    trayWindow.show();
    trayWindow.focus();
  } catch (err) {
    console.error(err);
  }

  // showNotification();
};
