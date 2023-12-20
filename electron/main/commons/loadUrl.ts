import { BrowserWindow } from 'electron';
import { join } from 'node:path';
export const loadUrl = (win: BrowserWindow, { path }: { path: string }) => {
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${path}`);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools({
      mode: 'detach',
    });
  } else {
    const indexHtml = join(process.env.DIST, 'index.html');
    win.loadFile(indexHtml, { hash: path });
  }
};
