import { IpcMainHandle } from '../IpcMainHandle';
import { TOKEN_KEY, globalState, store } from '../global';
import { createMainWindow } from '../commons/createMainWindow';
import { createPopWindow } from './openPopWindowHandle';
import { windowManager } from '../commons/windowManager';

export const setAuthorizehandle: IpcMainHandle = {
  channel: 'authorize',
  handle: (_: Electron.IpcMainInvokeEvent | undefined, payload: any): any => {
    return new Promise((resolve, reject) => {
      // 登录令牌必须已由 auth-token 协调器提交，迟到的 authorize 不能复活已退出会话。
      const current: any = store.get(TOKEN_KEY);
      if (!current?.access_token || current.access_token !== payload?.access_token) {
        reject(new Error('auth_session_changed'));
        return;
      }
      globalState.isAuthorized = true;
      const loginWin = windowManager.get('login');
      loginWin?.close();

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
