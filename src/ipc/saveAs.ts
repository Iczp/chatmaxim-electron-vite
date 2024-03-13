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
export const saveAsOfMessage = (message?: MessageOwnerDto): Promise<SaveResult> =>
  new Promise<SaveResult>((resolve, reject) => {
    const rejectError = (error: any, message?: string): void => {
      reject(<SaveResult>{ error, success: false });
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
              .catch(rejectError);
          })
          .catch(err => rejectError(err, 'Download fail'));
        break;
      default:
        rejectError(null, `Message type:'${message.messageType}' not supported`);
        break;
    }
  });
export const saveBlob = async (blob: Blob, fileName: string): Promise<string> => {
  var buffers = await blob.arrayBuffer();
  let fileData = new Int8Array(buffers);
  console.log('blob', blob, buffers, fileData);
  return await ipcRenderer.invoke('save-as', { fileName, fileData });
};
