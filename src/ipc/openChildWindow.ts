import { message } from 'ant-design-vue';
import { ipcRenderer } from 'electron';
import { WindowParams } from '../ipc-types';
import { IdDto } from '../apis/dtos';

export type PickerResult = {
  success?: boolean;
  message?: string;
};

export type PickerInput = {
  isMultiple?: boolean;
  maxCount?: number;
  selectedItems?: Array<IdDto>;
  disabledItems?: Array<IdDto>;
};

export const openChildWindow = (args: {
  t: any;
  // url: string;
  event?: string;
  // payload?: any;
  window?: WindowParams;
}) =>
  new Promise((resolve: (value: PickerResult) => void, reject: (reason?: any) => void) => {
    console.log('openChildWindow args', args);
    // const { t } = useI18n();
    const { t, window } = args;

    const event = args.event || `e-${new Date().getTime()}`;
    // args.payload = args.payload || {};
    if (window?.payload) {
      localStorage.setItem(event, JSON.stringify(window.payload));
    }
    const params = JSON.parse(JSON.stringify({ event, window }));
    ipcRenderer
      .invoke('open-child', params)
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
          message: err?.message || t('Cancel'),
        });
      })
      .finally(() => args.window?.payload && localStorage.removeItem(args.event!));
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
