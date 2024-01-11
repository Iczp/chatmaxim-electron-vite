import { IpcMainHandle } from '../IpcMainHandle';
import { globalState } from '../global';
import { sendEvent } from '../commons/initWindowEvent';
import { windowManager } from '../commons/windowManager';

export const eventName = 'language';

export const setLanguageHandle: IpcMainHandle = {
  channel: 'language',
  handle: (_: Electron.IpcMainInvokeEvent, args: { language: string }): any => {
    return new Promise((resolve, reject) => {
      globalState.language = args.language;
      windowManager.getAllWindows().map(([name, win]) => {
        sendEvent(win, eventName, [args]);
      });
      resolve({ message: 'ok' });
    });
  },
};
