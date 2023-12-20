import { BrowserWindow, shell } from 'electron';
import { windowManager } from './windowManager';
import { WindowState } from '../ipc-types/WindowState';
import { machine } from './machine';

export const initWindowEvent = (win: BrowserWindow) => {
  const send = (event: string, args: any[]) => sendEvent(win, event, args);
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
  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
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
      isSkipTaskbar: win.isKiosk(),
    },
  ]);
};
