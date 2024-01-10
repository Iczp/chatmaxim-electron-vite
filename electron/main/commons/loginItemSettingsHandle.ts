import { app } from 'electron';

export const loginItemSettingsHandle = (
  _: Electron.IpcMainInvokeEvent,
  settings: Electron.Settings,
): Electron.LoginItemSettings => {
  if (settings) {
    app.setLoginItemSettings(settings);
  }
  return app.getLoginItemSettings(settings);
};
