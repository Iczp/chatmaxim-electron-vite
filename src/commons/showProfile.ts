import { ipcRenderer } from 'electron';
import { WindowParams } from '../ipc-types';
import { PickerInput, PickerResult, openChildWindow, sendPickerResult } from './openChildWindow';
import { message } from 'ant-design-vue';
import { setWindow } from './setWindow';

export const showProfile = (window: WindowParams): Promise<PickerResult> => {

  return setWindow(window);
  return new Promise((resolve, reject) => {
    const ticks = new Date().getTime();
    const event = `show-profile-${ticks}`;
    ipcRenderer
      .invoke('open-pop', { event, window })
      .then((res: PickerResult) => {
        console.warn(1, res);
        if (res.success) {
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        console.error(err?.message, window, JSON.stringify(err));
        message.error({ content: err?.message || 'ERROR' });
        reject({
          message: err?.message || '取消',
        });
      })
      .finally(() => {});
  });
};
