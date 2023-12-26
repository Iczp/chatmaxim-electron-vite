import { globalState } from '../global';
import { TrayPayload, WindowParams } from '../ipc-types';
import { startFlash, stopFlash } from './tray';
import { windowManager } from './windowManager';
import { setWindow } from './windowSettingHandle';

export const setTrayHandle = (_: Electron.IpcMainInvokeEvent, payload: TrayPayload): any => {
  return new Promise((resolve, reject) => {
    const windowParam: WindowParams = {
      name: 'tray',
      path: `/tray?ticks=${new Date().getTime()}`,
      payload,
    };
    globalState.trayPayload = payload;
    const isFlash = Number(payload.totalBadge) > 0 || payload.items.length > 0;
    isFlash ? startFlash() : stopFlash();
    const win = windowManager.get(windowParam.name);
    setWindow(win, windowParam, _);
    resolve({});
  });
};
