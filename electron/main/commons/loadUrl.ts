import { BrowserWindow } from 'electron';
import { join } from 'node:path';
export const loadUrl = (win: BrowserWindow, { path }: { path: string }) => {
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${path}`);
    // Open devTool if the app is not packaged

    const electronLocalshortcut = require('electron-localshortcut');
    electronLocalshortcut.register(win, 'Ctrl+F12', () => {
      console.log('You pressed Ctrl & F12', win.webContents.isDevToolsOpened());
      if (!win.webContents.isDevToolsOpened()) {
        win.webContents.openDevTools({
          mode: 'detach',
        });
      }
      win.webContents.devToolsWebContents?.focus();
    });
  } else {
    const indexHtml = join(process.env.DIST, 'index.html');
    win.loadFile(indexHtml, { hash: path });
  }
};
