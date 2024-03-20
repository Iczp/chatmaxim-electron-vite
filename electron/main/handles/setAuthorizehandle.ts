import { IpcMainHandle } from '../IpcMainHandle';
import { TOKEN_KEY, globalState, store } from '../global';
import { createMainWindow } from '../commons/createMainWindow';
import { createPopWindow } from './openPopWindowHandle';
import { windowManager } from '../commons/windowManager';

export const setAuthorizehandle: IpcMainHandle = {
  channel: 'authorize',
  handle: (_: Electron.IpcMainInvokeEvent | undefined, payload: any): any => {
    return new Promise((resolve, reject) => {
      store.set(TOKEN_KEY, payload);
      globalState.token = payload;
      globalState.isAuthorized = true;
      const login = windowManager.get('login');
      login.close();

      const main = createMainWindow({
        path: '/',
        isPreventClose: true,
        visiblity: true,
        focus: true,
      });
      // main.show();
      // main.focus();
      createPopWindow({ path: '/pop' });

      resolve({});
    });
  },
};
