import { ipcRenderer } from 'electron';
import { TrayPayload } from '../ipc-types';

export const setTray = (payload: TrayPayload): Promise<any> => {
  const data = Object.assign(
    {},
    {
      windowWidth: 240,
      headerHeight: 32,
      footerHeight: 32,
      itemHeight: 48,
      margin: 0,
      ...payload,
    },
  );
  console.log('setTray', data);
  return ipcRenderer.invoke('set-tray', data);
};
