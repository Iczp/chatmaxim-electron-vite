import { WindowParams } from '../ipc-types';

export const invokeHandle = (
  _: Electron.IpcMainInvokeEvent,
  {
    window,
  }: {
    window?: WindowParams;
  },
): any => {
  return new Promise((resolve, reject) => {
    resolve({ message: 'ok' });
  });
};
