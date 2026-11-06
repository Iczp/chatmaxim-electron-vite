import { IpcMainHandle } from '../IpcMainHandle';
import { messageHub } from '../commons/messageHub';

type AppEventRequest = {
  action: 'broadcast' | 'to-main' | 'to-window' | 'windows' | 'focus' | 'window-ready';
  event?: string;
  args?: any[];
  target?: string | number;
};

/**
 * 渲染进程统一入口：
 * ipcRenderer.invoke('app-event', { action: 'broadcast', event, args })
 */
export const appEventHandle: IpcMainHandle = {
  channel: 'app-event',
  handle: (_: Electron.IpcMainInvokeEvent, request: AppEventRequest): any => {
    const { action, event, args = [], target } = request || ({} as AppEventRequest);
    switch (action) {
      case 'broadcast':
        return { count: messageHub.broadcast(event!, args, _.sender) };
      case 'to-main':
        return { success: messageHub.toMain(event!, args, _.sender) };
      case 'to-window':
        return { success: messageHub.toWindow(target!, event!, args, _.sender) };
      case 'windows':
        return { windows: messageHub.windows() };
      case 'focus':
        return { success: messageHub.focus(target!) };
      case 'window-ready':
        messageHub.windowReady(String(args[0] ?? ''));
        return { success: true, windows: messageHub.windows() };
      default:
        return { success: false, message: `unknown action:${action}` };
    }
  },
};
