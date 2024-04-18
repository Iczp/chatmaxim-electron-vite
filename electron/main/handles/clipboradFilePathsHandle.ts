import { IpcMainHandle } from '../IpcMainHandle';
import { getClipboardFilePaths } from '../commons/getClipboardFilePaths';

import { IpcMainHandleBase } from './IpcMainHandleBase';

export class ClipboradFilePathsHandle extends IpcMainHandleBase {
  /**
   *
   */
  public override channel: string = 'clipboard-filepaths';
  /**
   *
   * @param _
   * @param payload
   * @returns
   */
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
