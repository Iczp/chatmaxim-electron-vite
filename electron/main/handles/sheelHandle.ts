import { app, shell } from 'electron';
import { IpcMainHandle } from '../IpcMainHandle';

export const sheelHandle: IpcMainHandle = {
  channel: 'shell',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    {
      method,
      args,
    }: {
      method: string;
      args: any[];
    },
  ): Promise<any> => {
    switch (method) {
      case 'openPath':
        return shell.openPath.call(this, ...args);
      case 'openExternal':
        return shell.openExternal.call(this, ...args);
      case 'trashItem':
        return shell.trashItem.call(this, ...args);
      case 'beep':
        return shell.beep.call(this, ...args);
      case 'writeShortcutLink':
        return shell.writeShortcutLink.call(this, ...args);
      case 'readShortcutLink':
        return shell.readShortcutLink.call(this, ...args);
      default:
        return Promise.reject({
          message: `undefined ${method}`,
          args,
        });
    }
  },
};
