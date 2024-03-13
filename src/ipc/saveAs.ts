import { MessageOwnerDto } from '../apis/dtos';
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
  blob?: Blob;
};

/**
 * 保存消息附件
 *
 * @param {MessageOwnerDto} [message]
 * @return {*}  {Promise<SaveResult>}
 */
export const saveAsOfMessage = (
  message?: MessageOwnerDto,
  onDownloadSuccess?: (blob: Blob) => void,
): Promise<SaveResult> =>
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
        const { url, blob: contentBlob } = message.content as AttachmentsBaseDto;

        var fileName = getFileNameOfMessage(message);

        const _saveToFile = (blob: Blob) => {
          saveBlob(blob, fileName)
            .then(filePath => {
              resolve(<SaveResult>{ filePath, blob, success: true });
            })
            .catch((err: any) => {
              rejectError(err, err.canceled ? 'User Cancel' : undefined);
            });
        };

        if (contentBlob) {
          _saveToFile(contentBlob);
        } else {
          downloadFile(url!)
            .then(res => {
              onDownloadSuccess?.(res.blob);
              _saveToFile(toRaw(blob.value!));
            })
            .catch(err => rejectError(err, 'Download fail'));
        }

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
