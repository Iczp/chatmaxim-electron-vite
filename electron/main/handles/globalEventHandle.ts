import { BrowserWindow, ipcMain, webContents } from 'electron';
import { windowManager } from '../commons/windowManager';
import { IpcMainHandleBase } from './IpcMainHandleBase';

export class GlobalEventHandle extends IpcMainHandleBase {
  /**
   *
   */
  public override channel: string = 'global-event';
  /**
   *
   * @param _
   * @param payload
   * @returns
   */
  public override handle = (_: Electron.IpcMainInvokeEvent, payload: any) => {
    var senderWindow: BrowserWindow = BrowserWindow.fromWebContents(
      webContents.fromId(_.sender.id),
    );
    console.log(`[${this}] senderId:${_.sender.id},name:${windowManager.getNameById(_.sender.id)}`);
    windowManager
      .getAllWindows()
      //ignore sender window
      .filter(([name, win]) => win.id != _.sender.id)
      .map(([name, win]) => {
        const data = {
          callerId: senderWindow?.id,
          callerName: windowManager.getNameById(senderWindow?.id),
          payload,
          ticks: new Date().getTime(),
        };
        console.log('win.webContents.send:global-event', data);

        win.webContents.send('global-event', data);
      });
    return { message: 'ok' };
  };
}

export const globalEventHandle = new GlobalEventHandle();
