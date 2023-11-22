import { message } from 'ant-design-vue';
import { ipcRenderer } from 'electron';
import { WindowParams } from '../ipc-types';

export type PickerResult = {
  success?: boolean;
  message?: string;
};

export const openChildWindow = (args: {
  url: string;
  target: string | 'session-request' | 'object-picker';
  event?: string;
  payload?: any;
  window?: WindowParams;
}) =>
  new Promise((resolve: (value: PickerResult) => void, reject: (reason?: any) => void) => {
    args.event = args.event || `e-${new Date().getTime()}`;
    // args.payload = args.payload || {};
    if (args.payload) {
      localStorage.setItem(args.event, JSON.stringify(args.payload));
    }
    args = JSON.parse(JSON.stringify(args));
    ipcRenderer
      .invoke('open-child', args)
      .then((res: PickerResult) => {
        console.warn(1, res);
        if (res.success) {
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        console.error(err?.message, args, JSON.stringify(err));
        message.error({ content: err?.message || 'ERROR' });
        reject({
          message: err?.message || '取消',
        });
      })
      .finally(() => args.payload && localStorage.removeItem(args.event!));
  });

// export const sendPickerResult = ({ event, result }: { event: string; result: PickerResult }) =>
//   ipcRenderer.send(event, result);

export const sendPickerResult = (args: PickerResult & { event: string }) =>
  ipcRenderer.send(args.event, args);

export function getStoreValue<T>(event: string): T | undefined {
  try {
    const value = localStorage.getItem(event);
    console.log('getStoreValue', event, value);
    if (!value) {
      return undefined;
    }
    return JSON.parse(value) as T;
  } catch (error) {
    return undefined;
  }
}
