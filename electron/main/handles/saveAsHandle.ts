import { app } from 'electron';
import { IpcMainHandle } from '../IpcMainHandle';

export const saveAsHandle: IpcMainHandle = {
  channel: 'save-as',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    {
      fileName,
      fileData,
    }: {
      fileData: Int8Array;
      fileName: string;
    },
  ): boolean => {
    console.log('fileName', fileName);
    console.log('fileData', fileData.length);
    return true;
  },
};
