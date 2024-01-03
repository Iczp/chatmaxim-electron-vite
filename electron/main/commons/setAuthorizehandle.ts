import { TOKEN_KEY, globalState } from '../global';
import { TrayPayload, WindowParams } from '../ipc-types';
import { startFlash, stopFlash } from './tray';
import { windowManager } from './windowManager';
import { setWindow } from './windowSettingHandle';
import Store from 'electron-store';

export const setAuthorizehandle = (
  _: Electron.IpcMainInvokeEvent | undefined,
  payload: any,
): any => {
  return new Promise((resolve, reject) => {
    const store = new Store();
    store.set(TOKEN_KEY, payload);
    globalState.token = payload;

    // const win = windowManager.get(windowParam.name);
    // setWindow(win, windowParam, _);
    resolve({});
  });
};
