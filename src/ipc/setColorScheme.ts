import { ipcRenderer } from 'electron';

export const setColorScheme = (args: { colorScheme: string }) =>
  new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('color-scheme', args)
      .then(res => {
        console.warn('color-scheme', res);
        resolve(res);
      })
      .catch(err => reject)
      .finally(() => {});
  });
