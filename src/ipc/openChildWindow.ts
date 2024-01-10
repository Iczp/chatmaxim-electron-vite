import { message } from 'ant-design-vue';
import { ipcRenderer } from 'electron';
import { WindowParams } from '../ipc-types';
import { IdInput } from '../apis/dtos';
import { useI18n } from 'vue-i18n';

export type PickerResult = {
  success?: boolean;
  message?: string;
};

export type PickerInput = {
  maxCount?: number;
  selectedItems?: Array<IdInput>;
  disabledItems?: Array<IdInput>;
};

export const openChildWindow = (args: {
  // url: string;
  event?: string;
  // payload?: any;
  window?: WindowParams;
}) =>
  new Promise((resolve: (value: PickerResult) => void, reject: (reason?: any) => void) => {
    const { t } = useI18n();
    args.event = args.event || `e-${new Date().getTime()}`;
    // args.payload = args.payload || {};
    if (args.window?.payload) {
      localStorage.setItem(args.event, JSON.stringify(args.window.payload));
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
