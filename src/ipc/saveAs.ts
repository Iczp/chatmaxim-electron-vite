import log from 'video.js/dist/types/utils/log';
import { FileContentDto, MessageOwnerDto, VideoContentDto } from '../apis/dtos';
import { AttachmentsBaseDto } from '../apis/dtos/message/AttachmentsBaseDto';
import { MessageTypeEnums } from '../apis/enums';
import { useDownload } from '../commons/useDownload';
import { toRaw } from 'vue';
import { ipcRenderer } from 'electron';
import { getFileNameOfMessage } from '../commons/utils';

export type SaveResult = {
  success?: boolean;
  message?: string;
  filePath?: string;
  error: any;
};

/**
 * 保存消息附件
 *
 * @param {MessageOwnerDto} [message]
 * @return {*}  {Promise<SaveResult>}
 */
export const saveAsOfMessage = (message?: MessageOwnerDto): Promise<SaveResult> =>
  new Promise<SaveResult>((resolve, reject) => {
    const rejectError = (error: any, message?: string): void => {
      reject(<SaveResult>{ error: error || { message }, success: false });
    };
    if (!message) {
      console.warn('message fail');
      rejectError(null, `Message fail`);
      return;
    }
    const { downloadFile, blob } = useDownload();

    switch (message.messageType) {
      case MessageTypeEnums.Image:
      case MessageTypeEnums.Video:
      case MessageTypeEnums.File:
      case MessageTypeEnums.Sound:
        const { url } = message.content as AttachmentsBaseDto;
        downloadFile(url!)
          .then(res => {
            var fileName = getFileNameOfMessage(message);
            saveBlob(toRaw(blob.value!), fileName)
              .then(filePath => {
                resolve(<SaveResult>{ filePath, success: true });
              })
              .catch((err: any) => {
                rejectError(err, err.canceled ? 'User Cancel' : undefined);
              });
          })
          .catch(err => rejectError(err, 'Download fail'));
        break;
      default:
        rejectError(null, `Message type:'${message.messageType}' not supported`);
        break;
    }
  });

/**
 * 保存 Blob
 *
 * @param {Blob} blob
 * @param {string} fileName
 * @return {*}  {Promise<string>}
 */
export const saveBlob = (blob: Blob, fileName: string): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    var buffers = await blob.arrayBuffer();
    let fileData = new Int8Array(buffers);
    // console.log('blob', blob, buffers, fileData);
    ipcRenderer
      .invoke('save-as', { fileName, fileData })
      .then(res => {
        console.log('save-as', res);
        if (res.success) {
          resolve(res.filePath);
        } else {
          reject(res);
        }
      })
      .catch((err: any) => {
        console.error(JSON.stringify(err));
        reject(err);
      });
  });
};
