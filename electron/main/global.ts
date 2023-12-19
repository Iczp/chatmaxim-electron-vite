import { app, screen } from 'electron';

export interface GlobalState {
  isAppQuitting?: boolean;
  sessionItemHeight: number;
  sessionItemCount: number;
  badge: 0;
  // displays: Electron.Display[];
}

export const globalState: GlobalState = {
  isAppQuitting: false,
  sessionItemHeight: 64,
  badge: 0,
  sessionItemCount: 0,
  // displays: [],
};

// app.whenReady().then(() => {
//   globalState.displays = screen.getAllDisplays();
// });

app.on('before-quit', e => {
  globalState.isAppQuitting = true;
});
