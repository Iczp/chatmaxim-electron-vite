import { SessionRequestInput, SessionUnitDestinationDto } from '../apis/dtos';
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
export const sessionRequest = (payload: {
  params: SessionRequestInput;
  destination?: SessionUnitDestinationDto;
}): Promise<PickerResult> =>
  openChildWindow({
    url: `/session-request/${payload.params.ownerId}`,
    payload,
  });
// new Promise((resolve, reject) => {
//   openChildWindow({
//     url: `/session-request/${payload.ownerId}`,

//     payload,
//   });
// });

export const sendResult = (event: string, args: PickerResult) =>
  sendPickerResult({ event, ...args });
