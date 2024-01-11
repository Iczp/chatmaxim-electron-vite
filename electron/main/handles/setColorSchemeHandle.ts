import { IpcMainHandle } from '../IpcMainHandle';
import { setColorScheme } from '../global';
import { sendEvent } from '../commons/initWindowEvent';
import { windowManager } from '../commons/windowManager';

export const setColorSchemeHandle: IpcMainHandle = {
  channel: 'color-scheme',
  handle: (_: Electron.IpcMainInvokeEvent, args: { colorScheme: string }): any => {
    return new Promise((resolve, reject) => {
      setColorScheme(args.colorScheme);
      windowManager.getAllWindows().map(([name, win]) => {
        sendEvent(win, 'color-scheme', [args]);
      });
      resolve({ message: 'ok' });
    });
  },
};
