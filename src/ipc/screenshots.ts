import { ipcRenderer } from 'electron';

export type Bounds = { height: number; width: number; x: number; y: number };

export type ScreenshotsResult = {
  success: boolean;
  bounds?: {
    bounds?: Bounds;
    display?: Bounds & {
      id: number;
      scaleFactor: number;
    };
  };
  buffer?: Int8Array;
  event: object;
  file?: File;
};

export const screenshots = (arg: any): Promise<ScreenshotsResult> => {
  return new Promise<ScreenshotsResult>((resolve, reject) => {
    ipcRenderer
      .invoke('screenshots', {
        ...arg,
      })
      .then(res => {
        if (res.success) {
          // 创建Blob
          const blob = new Blob([res.buffer], { type: 'image/png' });
          var file = new File([blob], `srceenshot-${new Date().getTime()}.png`, {
            type: 'image/png',
          });
          resolve({ ...res, file });
        } else {
          reject(res);
        }
      })
      .catch(reject);
  });
};
