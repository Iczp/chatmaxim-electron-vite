import { ipcRenderer } from 'electron';
import { WindowParams } from '../ipc-types';

export const openAppSettings = (args?: WindowParams) => {
  const params: WindowParams = {
    name: 'app-settings',
    path: `/app-settings`,
    visiblity: true,
    ...args,
  };
  ipcRenderer.invoke('open-app-settings', params);
};
