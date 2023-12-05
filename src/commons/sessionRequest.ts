import { SessionRequestInput, SessionUnitDestinationDto } from '../apis/dtos';
import { WindowParams } from '../ipc-types';
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
export const sessionRequest = ({
  payload,
  window,
}: {
  payload: { params: SessionRequestInput; destination?: SessionUnitDestinationDto };
  window?: WindowParams;
}): Promise<PickerResult> =>
  openChildWindow({
    target: 'session-request',
    url: `/session-request/${payload.params.ownerId}`,
    payload,
    window: {
      isModel: true,
      size: {
        width: 500,
        height: 280,
      },
      ...window,
    },
  });

export const sendResult = (event: string, args: PickerResult) =>
  sendPickerResult({ event, ...args });
