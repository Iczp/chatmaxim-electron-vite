import { BrowserWindow, app, shell } from 'electron';
import { windowManager } from './windowManager';
import { WindowState } from '../ipc-types/WindowState';
import { machine } from './machine';
import { shortcutDevaultValue } from '../ipc-types/ShortcutState';
import { loadUrl } from './loadUrl';
import { globalState } from '../global';
import electronLocalshortcut from 'electron-localshortcut';

export const initWindowEvent = (win: BrowserWindow, name: string, path: string) => {
  windowManager.set(name, win);
  loadUrl(win, { path });
  const send = (event: string, args: any[]) => sendEvent(win, event, args);
  // const events = ['maximize', 'unmaximize', 'minimize', 'restore'];

  win.on('maximize', (_: any, ...args: any[]) => send('maximize', args));
  win.on('unmaximize', (_: any, ...args: any[]) => send('unmaximize', args));
  win.on('minimize', (_: any, ...args: any[]) => send('minimize', args));
  win.on('restore', (_: any, ...args: any[]) => send('restore', args));
  win.on('focus', (_: any, ...args: any[]) => send('focus', args));
  win.on('blur', (_: any, ...args: any[]) => send('blur', args));
  win.on('always-on-top-changed', (_: any, ...args: any[]) => send('always-on-top-changed', args));
  // win.on('move', (_, ...args) => sendEvent('move', args));
  win.on('enter-full-screen', (_: any, ...args: any[]) => send('enter-full-screen', args));
  win.on('leave-full-screen', (_: any, ...args: any[]) => send('leave-full-screen', args));
  win.on('page-title-updated', (_: any, ...args: any[]) => send('page-title-updated', args));
  win.on('system-context-menu', (_: any, ...args: any[]) => send('system-context-menu', args));
  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.removeMenu();
  win.webContents.on('did-finish-load', () => {
    sendWindowInfo(win);
  });

  win.webContents.on('did-navigate-in-page', (_, ...args) => {
    console.log(`did-navigate-in-page [${windowManager.getName(win)}]`, _, ...args);
  });

  registShortcutEvent(win);
};

export const registShortcutEvent = (win: BrowserWindow) => {
  // const electronLocalshortcut = require('electron-localshortcut');
  const shortcutState = shortcutDevaultValue();
  Object.keys(shortcutState).forEach(x => {
    electronLocalshortcut.register(win, x, () => {
      console.log(`shortcut:'${x}' is pressed`);
      sendEvent(win, 'shortcut', [x]);
    });
    const isRegistered = electronLocalshortcut.isRegistered(win, x);
    console.log(
      `win [name:'${windowManager.getNameById(win.id)}',id:${
        win.id
      }] shortcut:'${x}' isRegistered:${isRegistered}`,
    );
  });
};

export const sendEvent = (win: BrowserWindow, event: string, args: any[]) => {
  win.webContents.send('window-event', { event, args });
};

export const sendWindowInfo = (win: BrowserWindow) => {
  const [minWidth, minHeight] = win.getMinimumSize();
  const [maxWidth, maxHeight] = win.getMaximumSize();
  sendEvent(win, 'init', [
    <WindowState>{
      isModel: win.isModal(),
      windowId: win.id,
      machineId: machine.id,
      frame: false,
      name: windowManager.getName(win),
      maximizable: win.maximizable,
      minimizable: win.minimizable,
      closable: win.closable,
      movable: win.movable,
      resizable: win.resizable,
      isFullScreen: win.isFullScreen(),
      isMaximized: win.isMaximized(),
      isMinimized: win.isMinimized(),
      isVisible: win.isVisible(),
      fullScreenable: win.fullScreenable,
      focusable: win.focusable,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      backgroundColor: win.getBackgroundColor(),
      hasShadow: win.hasShadow(),
      opacity: win.getOpacity(),
      isKiosk: win.isKiosk(),
      token: globalState.token,
      // isSkipTaskbar: undefined,
      isPackaged: app.isPackaged,
    },
  ]);
};
