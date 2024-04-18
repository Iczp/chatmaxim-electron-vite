import { ipcRenderer } from 'electron';

export const channel = 'global-event';

export const install = () => {
  ipcRenderer.on(channel, globalEventHandle);

  console.log(`[${channel}]`, 'install');

  setTimeout(() => {
    invoke({
      admin: 132,
    });
  }, 3000);
};

export const uninstall = () => ipcRenderer.off(channel, globalEventHandle);

export const globalEventHandle = (_: Electron.IpcRendererEvent, args: any) => {
  console.log(`[${channel}]`, _, args);
};

export const invoke = (...args: any[]) => {
  console.log(`[${channel}]`, 'emit', args);
  return ipcRenderer.invoke(channel, ...args);
};
