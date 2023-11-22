import { ipcRenderer } from 'electron';
import { WindowParams } from '../ipc-types';

export const setWindow = (args?: WindowParams) => ipcRenderer.invoke('win-setting', args);
