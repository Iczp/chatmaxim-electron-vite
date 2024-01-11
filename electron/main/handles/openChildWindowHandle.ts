import { BrowserWindow, ipcMain } from 'electron';
import { WindowParams } from '../ipc-types';
import { join } from 'node:path';
import { addParamsToUrl } from '../commons/addParamsToUrl';
import { windowManager } from '../commons/windowManager';
import { initWindowEvent } from '../commons/initWindowEvent';
import { setWindow } from './windowSettingHandle';
import { loadUrl } from '../commons/loadUrl';
import { getBackgroundColor, globalState, icon, preload } from '../global';
import { IpcMainHandle } from '../IpcMainHandle';

export const openChildWindowHandle: IpcMainHandle = {
  channel: 'open-child',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    {
      event,
      // url,
      // payload,
      window,
    }: {
      event: string;
      // url: string;
      payload: any;
      window?: WindowParams;
    },
  ): any => {
    return new Promise((resolve, reject) => {
      console.log('open-child', { window });

      const parent = windowManager.get(window.parent);
      // || BrowserWindow.fromWebContents(webContents.fromId(_.sender.id)) || windowManager.getMain();
      const path = addParamsToUrl(window.path, { event, callerId: _.sender.id });
      window.path = path;
      console.warn('path', path);
      let childWindow = windowManager.get(window.name);
      if (!childWindow) {
        childWindow = windowManager.set(
          window.name,
          createChildWindow({
            name: window.name,
            parent,
            path,
            isModel: window.isModel || false,
          }),
        );
      }
      // childWindow.webContents.send('navigate', { path, payload: window.payload });
      // args.callerId = _.sender.id;
      let isSuccess = false;

      const resolveFunc = (_: Electron.IpcMainEvent, arg: any) => {
        console.log('ipc main once', arg);
        isSuccess = true;
        childWindow.close();
        resolve(arg);
      };
      const rejectFunc = (e: any) => {
        console.log(`window will close`, childWindow.id, e);
        if (!isSuccess) {
          resolve({ success: false, message: 'window close' });
        }
        ipcMain.off(event, resolveFunc);
      };
      childWindow.once('close', rejectFunc);
      ipcMain.once(event, resolveFunc);
      setWindow(childWindow, window, _);
    });
  },
};

export const createChildWindow = ({
  name,
  path,
  isModel,
  parent,
}: {
  name: string;
  path: string;
  isModel: boolean;
  parent?: BrowserWindow;
}): BrowserWindow => {
  console.log('createChildWindow', path);

  const win = new BrowserWindow({
    backgroundColor: getBackgroundColor(),
    parent,
    modal: isModel,
    maximizable: false,
    minimizable: false,
    icon,
    // show: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    frame: false,
    hasShadow: false,
  });
  initWindowEvent(win, name, path);
  loadUrl(win, { path });
  // preventClose(win, isPreventClose);
  return win;
};
