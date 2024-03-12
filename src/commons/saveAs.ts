import log from 'video.js/dist/types/utils/log';
import { FileContentDto, MessageOwnerDto, VideoContentDto } from '../apis/dtos';
import { AttachmentsBaseDto } from '../apis/dtos/message/AttachmentsBaseDto';
import { MessageTypeEnums } from '../apis/enums';
import { useDownload } from './useDownload';
import { toRaw } from 'vue';

export const saveAsOfMessage = (message?: MessageOwnerDto): string | undefined => {
  if (!message) {
    return;
  }
  const { downloadFile, blob } = useDownload();

  switch (message.messageType) {
    case MessageTypeEnums.Image:
    case MessageTypeEnums.Video:
    case MessageTypeEnums.File:
    case MessageTypeEnums.Sound:
      const { url } = message.content as AttachmentsBaseDto;
      downloadFile(url!).then(res => {
        saveBlob(toRaw(blob.value!), 'dd');
      });
      break;
  }
};
export const saveBlob = async (blob: Blob, fileName: string) => {
  var buffers = await blob.arrayBuffer();
  let fileData = new Int8Array(buffers);
  console.log('blob', blob, buffers, fileData);
};
