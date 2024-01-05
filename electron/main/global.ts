import { app, screen } from 'electron';
import { AppInfo, TrayPayload } from './ipc-types';
import { join } from 'node:path';
import { version } from '../../package.json';
import Store from 'electron-store';
import { env } from './env';
export const TOKEN_KEY: string = env.token_key;

export const preload = join(__dirname, '../preload/index.js');

export const icon = join(process.env.VITE_PUBLIC, 'favicon.ico');

export const store = new Store();

export interface GlobalState {
  isAppQuitting?: boolean;
  trayPayload: TrayPayload;
  // displays: Electron.Display[];
  trayWebContent: {
    isOver?: boolean;
  };
  appInfo: AppInfo;
  accelerator: {
    main: string;
  };
  globalShortcut: string;
  isAuthorized: boolean;
  token: any;
  tokenKey: string;
}

export const globalState: GlobalState = {
  isAppQuitting: false,

  trayPayload: {
    windowWidth: 240,
    itemHeight: 48,
    totalBadge: 0,
    items: [],
    headerHeight: 32,
    footerHeight: 32,
    margin: 0,
  },
  trayWebContent: {
    isOver: undefined,
  },
  appInfo: {
    appName: env.app_name, 
    appVersion: version,
    copyright: env.copyright,
    version: version,
    website: env.websize,
    author: env.author,
  },
  accelerator: {
    main: 'CommandOrControl+D',
  },
  globalShortcut: 'CommandOrControl+D',
  isAuthorized: false,
  token: store.get(TOKEN_KEY),
  tokenKey: TOKEN_KEY,
};

// app.whenReady().then(() => {
//   globalState.displays = screen.getAllDisplays();
// });

app.on('before-quit', e => {
  globalState.isAppQuitting = true;
});

export const isAuthorized = (): boolean => globalState.isAuthorized;
