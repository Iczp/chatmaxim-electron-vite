import { ChatObjectTypeEnums } from '../apis/enums';
import { WindowParams } from '../ipc-types';
import { PickerInput, PickerResult, openChildWindow, sendPickerResult } from './openChildWindow';

export type ObjectPickerResult = PickerResult & PickerInput;

export type ObjectPickerPayLoad = PickerInput & {
  chatObjectId: number | string;
  objectTypes?: Array<ChatObjectTypeEnums>;
  confirmText?: string;
};

export const objectPicker = ({
  t,
  payload,
  window,
}: {
  t: any;
  payload: ObjectPickerPayLoad;
  window?: WindowParams;
}): Promise<ObjectPickerResult> => {
  const ticks = new Date().getTime();
  const event = `${payload.chatObjectId}-${ticks}`;
  return openChildWindow({
    t,
    // url: `/object-picker/${payload.chatObjectId}`,
    event,
    // payload,
    window: window || {
      name: 'object-picker',
      path: `/object-picker/${payload.chatObjectId}`,
      visiblity: true,
      parent: 'main',
      isModel: true,
      isPreventClose: true,
      size: {
        width: 480,
        height: 640,
      },
      payload,
    },
  });
};

export const sendResult = (event: string, args: ObjectPickerResult) =>
  sendPickerResult({ event, ...args });
