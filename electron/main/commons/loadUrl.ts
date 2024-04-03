import { BrowserWindow, app, clipboard } from 'electron';
import { join } from 'node:path';
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;
export const loadUrl = (win: BrowserWindow, { path }: { path: string }) => {
  const electronLocalshortcut = require('electron-localshortcut');
  electronLocalshortcut.register(win, 'Ctrl+F5', () => {
    console.log('You pressed Ctrl & F5');
    win.reload();
  });
  electronLocalshortcut.register(win, 'Ctrl+F12', () => {
    console.log('You pressed Ctrl & F12', win.webContents.isDevToolsOpened());
    // if (!win.webContents.isDevToolsOpened()) {
    win.webContents.openDevTools({
      mode: 'detach',
    });
    // }
    win.webContents.devToolsWebContents?.focus();
  });
  const { url } = resolveUrl(path);

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${url}`);
    // Open devTool if the app is not packaged

    const electronLocalshortcut = require('electron-localshortcut');
    // electronLocalshortcut.register(win, 'Ctrl+F12', () => {
    //   console.log('You pressed Ctrl & F12', win.webContents.isDevToolsOpened());
    //   if (!win.webContents.isDevToolsOpened()) {
    //     win.webContents.openDevTools({
    //       mode: 'detach',
    //     });
    //   }
    //   win.webContents.devToolsWebContents?.focus();
    // });
  } else {
    const indexHtml = join(process.env.DIST, 'index.html');
    // clipboard.writeText(`indexHtml:${indexHtml}`);
    win.loadFile(indexHtml, { hash: url });
  }
};

export const resolveUrl = (path: string): { type: string; url: string } => {
  let type: string | undefined;
  let url = path;
  let types = ['push', 'replace'];

  for (const t of types) {
    const pro = `${t}:`;
    // console.log('pro', pro);
    if (path?.startsWith(pro)) {
      type = t;

      url = path.substring(pro.length);
      break;
    }
  }
  return {
    type,
    url,
  };
};
