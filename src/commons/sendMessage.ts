import { AxiosProgressEvent } from 'axios';
import { ApiError, CancelablePromise, ChatObjectService, MessageSenderService } from '../apis';
import { ChatObjectDto, MessageDto, MessageOwnerDto, SessionUnitSenderDto } from '../apis/dtos';
import { MessageStateEnums, MessageTypeEnums } from '../apis/enums';
import { useImStore } from '../stores/im';
import { useProgressStore } from '../stores/progress';
import { formatMessage, isAudioSuffix, isImageMime, isVideoMime } from './utils';
export type SendMessageError = {
  message: string;
  detail: ApiError | any;
  success: boolean;
};
const uploadFile = ({
  file,
  onProgress,
}: {
  file?: File | Blob | any;
  onProgress?: (progressEvent: AxiosProgressEvent) => void;
}): CancelablePromise<ChatObjectDto> => {
  return new CancelablePromise<ChatObjectDto>((resolve, reject) => {
    ChatObjectService.uploadPortrait({
      id: 13,
      file,
      onUploadProgress(progressEvent) {
        console.log('uploadFile onUploadProgress', progressEvent);
        onProgress?.call(this, progressEvent);
      },
    })
      .then(res => {
        setTimeout(() => {
          resolve(res);
        }, 1500);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const uploadFileMork = ({
  file: file,
  onProgress,
}: {
  file?: File | Blob | any;
  onProgress?: (percent: number) => void;
}): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (!file) {
      resolve();
      return;
    }

    let percent = 0;
    const exec = () => {
      setTimeout(() => {
        percent += Math.floor(Math.random() * 30);
        console.log('percent', percent);
        onProgress?.call(this, percent);
        if (percent > 100) {
          percent = 100;
          resolve();
        } else {
          exec();
        }
      }, 300);
    };

    exec();
  });
};

export const sendMessage = async ({
  sessionUnitId,
  quoteMessage,
  remindList,
  messageType,
  content,
  senderSessionUnit,
  lastItem,
  file,
  onBefore,
  onProgress,
  onSuccess,
  onError,
  onAfter,
}: {
  sessionUnitId: string;
  messageType: MessageTypeEnums;
  content: any;
  senderSessionUnit?: SessionUnitSenderDto;
  lastItem?: MessageDto;
  quoteMessage?: MessageOwnerDto;
  remindList?: Array<string>;
  file?: Blob | File | any;
  onBefore?: (input: MessageDto) => Promise<void>;
  onProgress?: (progressEvent: AxiosProgressEvent) => void;
  onSuccess?: (entity: MessageOwnerDto, input: MessageDto) => void;
  onError?: (error: SendMessageError, input: MessageDto) => void;
  onAfter?: (input: MessageDto) => void;
}) => {
  const store = useImStore();
  const autoId = store.generateMessageId();
  console.log('sendMessage content', content);

  let input: MessageDto = formatMessage({
    sessionUnitId,
    items: [
      {
        autoId,
        isSelf: true,
        isShowTime: true,
        messageType,
        senderName: senderSessionUnit?.owner?.name,
        senderSessionUnit,
        quoteMessage,
        content,
        state: MessageStateEnums.Sending,
        creationTime: new Date().toUTCString(),
        file,
      },
    ],
    lastItem,
  })[0];

  // input.file = file;

  if (onBefore) {
    await onBefore?.call(this, input);
  }

  const progressStore = useProgressStore();

  const quoteMessageId = quoteMessage?.id;

  const senderService = (): CancelablePromise<MessageOwnerDto> => {
    if (file) {
      console.log('file', file);

      const onUploadProgress = (progressEvent: AxiosProgressEvent): void => {
        progressStore.set(
          `${autoId}`,
          { percent: Math.floor(Number(progressEvent.progress) * 100), sessionUnitId },
          true,
          1500,
        );
        onProgress?.call(this, progressEvent);
      };
      const postData: any = {
        sessionUnitId,
        quoteMessageId,
        remindList,
        file,
        onUploadProgress,
      };
      if (isImageMime(file.type)) {
        return MessageSenderService.sendUploadImage(postData);
      } else if (isVideoMime(file.type)) {
        return MessageSenderService.sendUploadVideo(postData);
      } else if (isAudioSuffix(file.name)) {
        postData.duration = Math.floor(content.time);
        console.log(' postData.duration', postData.duration);
        return MessageSenderService.sendUploadSound(postData);
      }
      return MessageSenderService.sendUploadFile(postData);
    }
    return MessageSenderService.sendContent({
      messageType,
      sessionUnitId,
      requestBody: {
        quoteMessageId,
        ignoreConnections: null,
        remindList,
        content,
      },
    });
  };

  const _send = () => {
    senderService()
      .then(res => {
        console.log('sendRet', res);
        store.setMaxMessageId(res.id!);
        store.setLastMessageForSender(res);
        onSuccess?.call(this, res, input);
      })
      .catch((err: ApiError) => {
        onError?.call(
          this,
          <SendMessageError>{
            message: `发送失败:${err?.body?.error?.message || err?.message}`,
            success: false,
            detail: err,
          },
          input,
        );
      })
      .finally(() => {
        onAfter?.call(this, input);
      });
  };

  _send();
};
