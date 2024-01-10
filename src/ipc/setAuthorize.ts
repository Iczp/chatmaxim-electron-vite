import { ipcRenderer } from 'electron';
import { TokenDto } from '../apis/auth/dto';

export const setAuthorize = (token: TokenDto) =>
  new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('authorize', token)
      .then(res => {
        console.warn(1, res);
        resolve(res);
      })
      .catch(err => reject)
      .finally(() => {});
  });
