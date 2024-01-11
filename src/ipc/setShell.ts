import { ipcRenderer } from 'electron';

export type ShellMethods =
  | 'showItemInFolder'
  | 'openPath'
  | 'openExternal'
  | 'trashItem'
  | 'beep'
  | 'writeShortcutLink'
  | 'readShortcutLink';
export const setShell = (args: { method: ShellMethods; args: any[] }) =>
  new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('shell', args)
      .then(res => {
        console.warn('shell', res);
        resolve(res);
      })
      .catch(err => {
        console.warn('setShell', err);
        reject(err);
      })
      .finally(() => {});
  });
