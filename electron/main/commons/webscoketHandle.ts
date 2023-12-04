import { BrowserWindow, webContents } from 'electron';
import { WindowParams } from '../ipc-types';
import { windowManager } from './windowManager';

export const websocketHandle = (_: Electron.IpcMainInvokeEvent, payload: any): any => {
  var senderWindow: BrowserWindow = BrowserWindow.fromWebContents(webContents.fromId(_.sender.id));
  console.log('[websocket]', _.sender.id, senderWindow?.id);
  const wins = windowManager.getWindows();
  Object.entries(wins)
    //ignore sender window
    .filter(([, win]) => win.id != _.sender.id)
    .map(([, win]) => {
      win.webContents.send('websocket', {
        callerId: senderWindow?.id,
        callerName: windowManager.getNameById(senderWindow?.id),
        payload,
        ticks: new Date().getTime(),
      });
    });
  return { message: 'ok' };
};
