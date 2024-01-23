import { app } from 'electron';
import { globalState } from '../global';
import { TrayPayload, WindowParams } from '../ipc-types';
import { startFlash, stopFlash } from '../commons/tray';
import { windowManager } from '../commons/windowManager';
import { IpcMainHandle } from '../IpcMainHandle';
import { setWindow } from './windowSettingHandle';

export const setTrayHandle: IpcMainHandle = {
  channel: 'set-tray',
  handle: (_, payload: TrayPayload): Promise<any> => {
    return new Promise((resolve, reject) => {
      // app badge count
      app.setBadgeCount(payload.totalBadge);

      const windowParam: WindowParams = {
        name: 'tray',
        path: `/tray?ticks=${new Date().getTime()}`,
        payload,
      };
      globalState.trayPayload = payload;

      const isFlash = Number(payload.totalBadge) > 0 || payload.items.length > 0;
      isFlash ? startFlash() : stopFlash();
      if (!isFlash) {
        windowParam.visiblity = false;
      }
      const win = windowManager.get(windowParam.name);
      setWindow(win, windowParam, _);
      resolve({});
    });
  },
};
