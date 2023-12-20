import { globalState } from '../global';
import { TrayPayload, WindowParams } from '../ipc-types';
import { windowManager } from './windowManager';
import { setWindow } from './windowSettingHandle';

export const setTrayHandle = (_: Electron.IpcMainInvokeEvent, payload: TrayPayload): any => {
  return new Promise((resolve, reject) => {
    const windowParam: WindowParams = {
      name: 'tray',
      path: '/tray',
      payload,
    };
    globalState.trayPayload = payload;
    const win = windowManager.get('tray');
    setWindow(win, windowParam, _);
    resolve({});
  });
};
