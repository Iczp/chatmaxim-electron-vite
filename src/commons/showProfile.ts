import { IdInput } from '../apis/dtos';
import { WindowParams } from '../ipc-types';
import { PickerInput, PickerResult, openChildWindow, sendPickerResult } from './openChildWindow';



export const showProfile = (args: WindowParams): Promise<PickerResult> => {
  const ticks = new Date().getTime();
  const event = `show-profile-${ticks}`;
  return openChildWindow({
    event,
    window: {
      name: 'pop',
      refer: '$sender',
      position: 'absolute',
      visiblity: true,
      focus: true,
      ...args,
    },
  });
};


