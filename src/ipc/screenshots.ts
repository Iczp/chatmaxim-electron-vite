import { ipcRenderer } from 'electron';

export const screenshots = (arg: any) => {
  ipcRenderer.invoke('screenshots', {
    a: 1,
    ...arg,
  });
};
