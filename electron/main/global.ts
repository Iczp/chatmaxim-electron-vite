import { app, screen } from 'electron';
import { TrayPayload } from './ipc-types';

export interface GlobalState {
  isAppQuitting?: boolean;
  trayTitleHeight: number;
  sessionItemHeight: number;
  sessionItemCount: number;
  badge: 0;
  trayPayload: TrayPayload;
  // displays: Electron.Display[];
  trayContent: {
    isOver?: boolean;
  };
}

export const globalState: GlobalState = {
  isAppQuitting: false,
  trayTitleHeight: 32,
  sessionItemHeight: 48,
  badge: 0,
  sessionItemCount: 0,
  trayPayload: {
    windowWidth: 240,
    itemHeight: 48,
    totalBadge: 0,
    items: [],
    headerHeight: 32,
    footerHeight: 32,
    margin: 0,
  },
  trayContent: {
    isOver: undefined,
  },
};

// app.whenReady().then(() => {
//   globalState.displays = screen.getAllDisplays();
// });

app.on('before-quit', e => {
  globalState.isAppQuitting = true;
});
