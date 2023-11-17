import { ipcRenderer } from 'electron';
import queryString from 'query-string';
export type PickerResult = {
  success?: boolean;
  message?: string;
};

export const openChildWindow = (args: {
  url: string;
  target?: string | 'child';
  event?: string;
  payload?: any;
}) =>
  new Promise((resolve: (value: PickerResult) => void, reject: (reason?: any) => void) => {
    args.event = args.event || `e-${new Date().getTime()}`;
    args.target = args.target || `child`;
    // args.payload = args.payload || {};
    if (args.payload) {
      localStorage.setItem(args.event, JSON.stringify(args.payload));
    }
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
        console.error(err?.message, JSON.stringify(err));
        reject({
          message: err?.message || '取消',
        });
      })
      .finally(() => args.payload && localStorage.removeItem(args.event!));
  });

export const sendPickerResult = ({ event, result }: { event: string; result: PickerResult }) =>
  ipcRenderer.send(event, result);

export function getStoreValue<T>(event: string): T | null {
  try {
    const value = localStorage.getItem(event);
    console.log('getStoreValue', event, value);
    if (!value) {
      return null;
    }
    return JSON.parse(value) as T;
  } catch (error) {
    return null;
  }
}
