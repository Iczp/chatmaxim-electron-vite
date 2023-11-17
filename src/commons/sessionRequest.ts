import { SessionRequestInput } from '../apis/dtos';
import { PickerResult, openChildWindow, sendPickerResult } from './openChildWindow';


/**
 * 添加好友
 *
 * @param {{
 *   ownerId: number;
 *   destinationId: number;
 * }} payload
 * @return {*}  {Promise<PickerResult>}
 */
export const sessionRequest = (payload: SessionRequestInput): Promise<PickerResult> =>
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

export const sendResult = (event: string, result: PickerResult) =>
  sendPickerResult({ event, result });
