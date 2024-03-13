import { BrowserWindow, app, dialog, webContents } from 'electron';
import { IpcMainHandle } from '../IpcMainHandle';
import { outputFile } from 'fs-extra';
import { join } from 'node:path';
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
  ): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      console.log('fileName', fileName);
      console.log('fileData', fileData.length);
      var senderWindow = BrowserWindow.fromWebContents(webContents.fromId(_.sender.id));
      const defaultPath = join(app.getPath('documents'), fileName);
      //file dialog
      dialog
        .showSaveDialog(senderWindow, {
          title,
          defaultPath,
          properties: [],
        })
        .then(res => {
          console.log('showSaveDialog', res);
          outputFile(res.filePath, fileData, err => {
            if (err) {
              console.log('err', err);
              reject(err);
              // event.sender.send(ERROR, err.message)
            } else {
              console.log('save as:ok', res.filePath);
              resolve(res.filePath);
            }
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },
};
