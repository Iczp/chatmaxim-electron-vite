import { BrowserWindow, webContents } from 'electron';
import { windowManager } from './windowManager';

export const websocketHandle = (_: Electron.IpcMainInvokeEvent, payload: any): any => {
  var senderWindow: BrowserWindow = BrowserWindow.fromWebContents(webContents.fromId(_.sender.id));
  console.log(`[websocket] senderId:${_.sender.id},name:${windowManager.getNameById(_.sender.id)}`);
  windowManager
    .getSeparatedChatWindows()
    //ignore sender window
    .filter(([name, win]) => win.id != _.sender.id)
    .map(([name, win]) => {
      win.webContents.send('websocket', {
        callerId: senderWindow?.id,
        callerName: windowManager.getNameById(senderWindow?.id),
        payload,
        ticks: new Date().getTime(),
      });
    });
  return { message: 'ok' };
};
