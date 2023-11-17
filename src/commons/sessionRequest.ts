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
export /**
 * 添加好友
 *
 * @param {{
 *   ownerId: number;
 *   destinationId: number;
 * }} payload
 * @return {*}  {Promise<ObjectPickerResult>}
 */
const sessionRequest = (payload: {
  ownerId: number;
  destinationId: number;
}): Promise<ObjectPickerResult> =>
  openChildWindow({
    url: `/session-request/${payload.ownerId}`,
    payload,
  });
// new Promise((resolve, reject) => {
//   openChildWindow({
//     url: `/session-request/${payload.ownerId}`,

//     payload,
//   });
// });

export const sendResult = (event: string, result: ObjectPickerResult) =>
  sendPickerResult({ event, result });
