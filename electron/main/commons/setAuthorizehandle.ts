import { TOKEN_KEY, globalState, store } from '../global';
import { createMainWindow } from './createMainWindow';
import { createPopWindow } from './openPopWindowHandle';
import { windowManager } from './windowManager';

export const setAuthorizehandle = (
  _: Electron.IpcMainInvokeEvent | undefined,
  payload: any,
): any => {
  return new Promise((resolve, reject) => {
    store.set(TOKEN_KEY, payload);
    globalState.token = payload;
    globalState.isAuthorized = true;
    const login = windowManager.get('login');
    login.close();

    const main = createMainWindow({ path: '/' });
    main.show();
    main.focus();
    createPopWindow({ path: '/pop' });

    resolve({});
  });
};
