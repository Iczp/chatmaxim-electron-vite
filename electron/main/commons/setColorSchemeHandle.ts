import { globalState } from '../global';
import { WindowParams } from '../ipc-types';
import { sendEvent } from './initWindowEvent';
import { windowManager } from './windowManager';

export const setColorSchemeHandle = (
  _: Electron.IpcMainInvokeEvent,
  args: { colorScheme: string },
): any => {
  return new Promise((resolve, reject) => {
    globalState.colorScheme = args.colorScheme;
    windowManager.getAllWindows().map(([name, win]) => {
      sendEvent(win, 'color-scheme', [args]);
    });
    resolve({ message: 'ok' });
  });
};
