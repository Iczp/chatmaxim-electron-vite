import { app } from 'electron';
import { IpcMainHandle } from '../IpcMainHandle';

export const loginItemSettingsHandle: IpcMainHandle = {
  channel: 'login-item-settings',
  handle: (
    _: Electron.IpcMainInvokeEvent,
    settings: Electron.Settings,
  ): Electron.LoginItemSettings => {
    if (settings) {
      app.setLoginItemSettings(settings);
    }
    return app.getLoginItemSettings(settings);
  },
};