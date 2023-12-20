import { ipcRenderer } from 'electron';
import { TrayPayload } from '../ipc-types';

export const setTray = (payload: TrayPayload): Promise<any> =>
  ipcRenderer.invoke('set-tray', {
    windowWidth: 240,
    headerHeight: 32,
    footerHeight: 32,
    itemHeight: 48,
    margin: 0,
    ...payload,
  });
