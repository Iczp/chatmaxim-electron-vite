import { app, screen } from 'electron';
import { AppInfo, TrayPayload } from './ipc-types';
import { version } from '../../package.json';
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
  globalShortcuts: string;
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
    appName: app.getName(), //import.meta.env.VITE_APP_NAME,
    appVersion: version,
    copyright: import.meta.env.VITE_APP_COPYRIGHT,
    version: version,
    website: import.meta.env.VITE_APP_WEBSIZE,
    author: import.meta.env.VITE_APP_AUTHOR,
  },
  accelerator: {
    main: 'CommandOrControl+D',
  },
  globalShortcuts: 'CommandOrControl+D',
};

// app.whenReady().then(() => {
//   globalState.displays = screen.getAllDisplays();
// });

app.on('before-quit', e => {
  globalState.isAppQuitting = true;
});
