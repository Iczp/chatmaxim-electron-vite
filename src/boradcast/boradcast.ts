export const channel = 'boradcast';
type Listener = (event: Electron.IpcRendererEvent, ...args: any[]) => void;
import { ipcRenderer } from 'electron';

export const install = () => ipcRenderer.on(channel, listener);

export const uninstall = () => ipcRenderer.off(channel, listener);

export const listener = (event: Electron.IpcRendererEvent, ...args: any[]) => {
  console.log('listener', event, args);
};

// trigger
export const emit = (event: string, args: any) => {
  return ipcRenderer.invoke(channel, {
    event,
    args,
  });
};

// trigger
export const on = (channel: string, listener:Listener) => {
  return ipcRenderer.on(channel, listener);
};
