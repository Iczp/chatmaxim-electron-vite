import { IdInput } from '../apis/dtos';
import { WindowParams } from '../ipc-types';
import { PickerInput, PickerResult, openChildWindow, sendPickerResult } from './openChildWindow';

export type ObjectPickerResult = PickerResult & PickerInput;

export type ObjectPickerPayLoad = PickerInput & {
  chatObjectId: number;
};

export const objectPicker = ({
  payload,
  window,
}: {
  payload: ObjectPickerPayLoad;
  window?: WindowParams;
}): Promise<ObjectPickerResult> => {
  const ticks = new Date().getTime();
  const event = `${payload.chatObjectId}-${ticks}`;
  return openChildWindow({
    url: `/object-picker/${payload.chatObjectId}`,
    event,
    payload,
    window: window || {
      name: 'object-picker',
      parent: 'main',
      isModel: true,
      isPreventClose: true,
      size: {
        width: 480,
        height: 640,
      },
    },
  });
};

export const sendResult = (event: string, args: ObjectPickerResult) =>
  sendPickerResult({ event, ...args });
