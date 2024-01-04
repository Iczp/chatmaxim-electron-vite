import { ipcRenderer } from 'electron';
import { WindowParams } from '../ipc-types';


export const openAppSettings = (args?: WindowParams) => ipcRenderer.invoke('open-app-settings', args);
