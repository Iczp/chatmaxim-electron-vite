import { WindowParams } from '../ipc-types';
import { setWindow } from './setWindow';

export type ProfileDto = {
  /**
   * owner id
   *
   * @type {number}
   */
  chatObjectId: number | string;
  /**
   * senderSessionUnit
   *
   * @type {string}
   */
  sessionUnitId: string;
};
export const setProfile = (window: WindowParams): Promise<any> =>
  setWindow({
    name: 'pop',
    position: 'absolute',
    refer: '$sender',
    visiblity: true,
    focus: true,
    ...window,
  });

export const setProfile1 = (
  window: WindowParams,
  { chatObjectId, sessionUnitId }: ProfileDto,
): Promise<any> =>
  setWindow({
    name: 'pop',
    path: `/profile/${chatObjectId}/${sessionUnitId}`,
    position: 'absolute',
    refer: '$sender',
    visiblity: true,
    focus: true,
    ...window,
  });
