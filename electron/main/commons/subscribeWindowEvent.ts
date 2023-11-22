import { BrowserWindow, shell } from "electron";

export const subscribeWindowEvent = (win: BrowserWindow) => {
    const sendEvent = (event: string, args: any[]) => {
      win?.webContents.send('window-event', { event, args });
    };
    win.on('maximize', (_: any, ...args: any[]) => sendEvent('maximize', args));
    win.on('unmaximize', (_: any, ...args: any[]) => sendEvent('unmaximize', args));
    win.on('minimize', (_: any, ...args: any[]) => sendEvent('minimize', args));
    win.on('restore', (_: any, ...args: any[]) => sendEvent('restore', args));
    // win.on('move', (_, ...args) => sendEvent('move', args));
    win.on('enter-full-screen', (_: any, ...args: any[]) => sendEvent('enter-full-screen', args));
    win.on('leave-full-screen', (_: any, ...args: any[]) => sendEvent('leave-full-screen', args));
  
    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url);
      return { action: 'deny' };
    });
  };