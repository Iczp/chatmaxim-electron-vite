import { globalState } from '../global';
import { sendEvent } from './initWindowEvent';
import { windowManager } from './windowManager';

export const eventName = 'language';

export const setLanguageHandle = (
  _: Electron.IpcMainInvokeEvent,
  args: { language: string },
): any => {
  return new Promise((resolve, reject) => {
    globalState.language = args.language;
    windowManager.getAllWindows().map(([name, win]) => {
      sendEvent(win, eventName, [args]);
    });
    resolve({ message: 'ok' });
  });
};
