// @ts-ignore
import { Howl, Howler } from 'howler';

/**
 * 获取音频时长
 *
 * @param {string} filePath
 * @return {*}  {Promise<number>}
 */
export const getSoundDuration = (filePath: string): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    console.log('getSoundDuration', filePath);
    const sound = new Howl({
      src: [filePath],
      autoplay: false,
      loop: false,
      volume: 0,
      onload: (e: any) => {
        console.log('Howl onload:', e);
        // 获取音频时长
        const duration = sound.duration();
        console.log('Howl onload duration:', duration);
        resolve(duration);
      },
      onloaderror: (err: any) => {
        reject(err);
        console.error('getSoundDuration', err);
      },
    });
  });
};
