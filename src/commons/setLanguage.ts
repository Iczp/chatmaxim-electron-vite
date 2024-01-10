import { ipcRenderer } from 'electron';

export const setLanguage = (args: { language: string }) =>
  new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('language', args)
      .then(res => {
        console.warn('language', res);
        resolve(res);
      })
      .catch(err => reject)
      .finally(() => {});
  });
