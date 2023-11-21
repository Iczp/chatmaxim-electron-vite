import { PickerResult, openChildWindow, sendPickerResult } from './openChildWindow';

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
export const objectPicker = (payload: {
  chatObjectId: number;
  selectedItems?: Array<any>;
}): Promise<ObjectPickerResult> => {
  const ticks = new Date().getTime();
  const event = `${payload.chatObjectId}-${ticks}`;
  return openChildWindow({
    url: `/object-picker/${payload.chatObjectId}`,
    event,
    payload,
  });
};

export const sendResult = (event: string, args: ObjectPickerResult) =>
  sendPickerResult({ event, ...args });
