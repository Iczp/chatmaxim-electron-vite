import { getClipboardFilePaths } from '../commons/getClipboardFilePaths';
import { IpcMainHandleBase } from './IpcMainHandleBase';

export class ClipboradFilePathsHandle extends IpcMainHandleBase {
  public override channel = 'clipboard-filepaths';
  public override handle = (
    _: Electron.IpcMainInvokeEvent,
    {}: {
      method: string;
      args: any[];
    },
  ): Promise<string[]> =>
    new Promise<string[]>((resolve, reject) => {
      resolve(getClipboardFilePaths());
    });
}

export const clipboradFilePathsHandle = new ClipboradFilePathsHandle();

// export const clipboradFilePathsHandle: IpcMainHandle = {
//   channel: 'clipboard-filepaths',
//   handle: (
//     _: Electron.IpcMainInvokeEvent,
//     {}: {
//       method: string;
//       args: any[];
//     },
//   ): Promise<string[]> =>
//     new Promise<string[]>((resolve, reject) => {
//       resolve(getClipboardFilePaths());
//     }),
// };
