import { IpcMainHandle } from '../IpcMainHandle';
import { getClipboardFilePaths } from '../commons/getClipboardFilePaths';

export const clipboradFilePathsHandle: IpcMainHandle = {
  channel: 'clipboard-filepaths',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    {}: {
      method: string;
      args: any[];
    },
  ): Promise<string[]> =>
    new Promise<string[]>((resolve, reject) => {
      resolve(getClipboardFilePaths());
    }),
};
