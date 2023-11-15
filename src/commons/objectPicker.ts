import { app, ipcRenderer } from 'electron';
// import { Size } from '../../electron/main/types';

export type ObjectPickerResult = {
  success?: boolean;
  message?: string;
  /**
   * sessionUnitId List
   *
   * @type {Array<{
   *     id: string;
   *   }>}
   */
  selectedItems?: Array<{
    id: string;
  }>;
};
export const objectPicker = (payload: { chatObjectId: number; selectedItems?: Array<any> }) =>
  new Promise((resolve: (value: ObjectPickerResult) => void, reject: (reason?: any) => void) => {
    const event = `${payload.chatObjectId}-${new Date().getTime()}`;
    // console.warn('once', event);
    // ipcRenderer.once(event, (_, arg) => {
    //   console.warn(3, arg);
    //   resolve(arg);
    // });
    localStorage.setItem(event, JSON.stringify(payload));
    ipcRenderer
      .invoke('open-child', {
        target: 'child',
        url: `/object-picker/${event}?`,
        event,
        payload,
      })
      .then((res: ObjectPickerResult) => {
        console.warn(1, res);
        if (res.success) {
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        console.error(err?.message, JSON.stringify(err));
        reject({
          message: err?.message || '取消',
        });
      })
      .finally(() => localStorage.removeItem(event));
  });

export const sendResult = (event: string, result: ObjectPickerResult) => {
  ipcRenderer.send(event, result);
};
