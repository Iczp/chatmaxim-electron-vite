import { app } from 'electron';
import { IpcMainHandle } from '../IpcMainHandle';

export const saveAsHandle: IpcMainHandle = {
  channel: 'save-as',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    args: {
      fileData: Int8Array;
      fileName: string;
    },
  ): boolean => {
    return true;
  },
};
