import { BrowserWindow, app, dialog, webContents } from 'electron';
import { IpcMainHandle } from '../IpcMainHandle';
import { outputFile } from 'fs-extra';
import { join } from 'node:path';

export type SaveResult = Electron.SaveDialogReturnValue & {
  success?: boolean;
  message?: string;
  error?: any;
};
export const saveAsHandle: IpcMainHandle = {
  channel: 'save-as',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    {
      fileName,
      fileData,
      title,
    }: {
      fileData: Int8Array;
      fileName: string;
      title?: string;
    },
  ): Promise<SaveResult> => {
    return new Promise<SaveResult>((resolve, reject) => {
      console.log('fileName', fileName);
      console.log('fileData', fileData.length);
      var senderWindow = BrowserWindow.fromWebContents(webContents.fromId(_.sender.id));
      const defaultPath = join(app.getPath('documents'), fileName);
      //file dialog
      dialog
        .showSaveDialog(senderWindow, {
          title,
          defaultPath,
          // properties: [],
        })
        .then(res => {
          console.log('showSaveDialog', res);
          if (res.canceled) {
            resolve({ ...res, message: 'User Canceled' });
            return;
          }
          outputFile(res.filePath, fileData, error => {
            if (error) {
              console.error('err', error);
              resolve({ ...res, error, message: 'OutputFile Fail' });
              // event.sender.send(ERROR, err.message)
            } else {
              console.log('save as:ok', res.filePath);
              resolve(<SaveResult>{ ...res, success: true });
            }
          });
        })
        .catch(error => {
          reject({ error, message: 'ShowSaveDialog Fail' });
        });
    });
  },
};
