import { PickerResult, openChildWindow, sendPickerResult } from './openChildWindow';
import { WindowParams } from './setWindow';

export type ObjectPickerResult = PickerResult & {
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
export const objectPicker = ({
  payload,
  window,
}: {
  payload: {
    chatObjectId: number;
    selectedItems?: Array<any>;
  };
  window?: WindowParams;
}): Promise<ObjectPickerResult> => {
  const ticks = new Date().getTime();
  const event = `${payload.chatObjectId}-${ticks}`;
  return openChildWindow({
    target: 'object-picker',
    url: `/object-picker/${payload.chatObjectId}`,
    event,
    payload,
    window: window || {
      size: {
        width: 480,
        height: 640,
      },
    },
  });
};

export const sendResult = (event: string, args: ObjectPickerResult) =>
  sendPickerResult({ event, ...args });
