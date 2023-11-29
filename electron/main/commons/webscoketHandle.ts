import { BrowserWindow, webContents } from 'electron';
import { WindowParams } from '../ipc-types';

export const websocketHandle = (_: Electron.IpcMainInvokeEvent, args: any): any => {
  var senderWindow: BrowserWindow = BrowserWindow.fromWebContents(webContents.fromId(_.sender.id));
  console.log('[websocket]', _.sender.id, senderWindow?.id);

  return { message: 'ok' };
};
