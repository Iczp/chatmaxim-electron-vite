import { app, nativeTheme, screen } from 'electron';
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
  backgroundColor: string;
  colorScheme: string;
  language: string;
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
export const getAppInfo = (): AppInfo => {
  const appInfo: AppInfo = {
    appName: env.app_name,
    appVersion: version,
    copyright: env.copyright,
    version: version,
    website: env.websize,
    author: env.author,
    appPath: app.getAppPath(),
    appDataPath: app.getPath('appData'),
    userDataPath: app.getPath('userData'),
    documentsPath: app.getPath('documents'),
    downloadsPath: app.getPath('downloads'),
    picturesPath: app.getPath('pictures'),
  };
  return appInfo;
};

export const globalState: GlobalState = {
  colorScheme: env.defaultColorScheme,
  language: env.defaultLanguage,
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
  appInfo: getAppInfo(),
  accelerator: {
    main: 'CommandOrControl+D',
  },
  globalShortcut: 'CommandOrControl+D',
  isAuthorized: false,
  token: store.get(TOKEN_KEY),
  tokenKey: TOKEN_KEY,
  backgroundColor: nativeTheme.shouldUseDarkColors ? '#1b1b1b' : '#f9fbff',
};

// app.whenReady().then(() => {
//   globalState.displays = screen.getAllDisplays();
// });

app.on('before-quit', e => {
  globalState.isAppQuitting = true;
});

export const isAuthorized = (): boolean => globalState.isAuthorized;

export const setColorScheme = (colorScheme: string) => {
  globalState.colorScheme = colorScheme;
  globalState.backgroundColor = colorScheme == 'dark' ? '#1b1b1b' : '#f9fbff';
};

export const getBackgroundColor = (): string | undefined => {
  return globalState.colorScheme == 'dark' ? '#1b1b1b' : '#f9fbff';
};
