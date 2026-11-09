import { AxiosProgressEvent } from 'axios';
import { ulid } from 'ulid';
import { ApiError, CancelablePromise, ChatObjectService, MessageSenderService } from '../apis';
import { ChatObjectDto, MessageDto, MessageOwnerDto, SessionUnitSenderDto } from '../apis/dtos';
import { MessageStateEnums, MessageTypeEnums } from '../apis/enums';
import { useImStore } from '../stores/imStore';
import { useProgressStore } from '../stores/progressStore';
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

export const createClientMessageId = (): string => ulid();

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
  clientMessageId: retryClientMessageId,
}: {
  sessionUnitId: string;
  clientMessageId?: string;
  messageType: MessageTypeEnums;
  content: any;
  senderSessionUnit?: SessionUnitSenderDto;
  lastItem?: MessageDto;
  quoteMessage?: MessageOwnerDto;
  remindList?: Array<string>;
  file?: Blob | File | any;
  onBefore?: (input: MessageDto) => Promise<void>;
  onProgress?: (progressEvent: AxiosProgressEvent) => void;
  onSuccess?: (entity: MessageOwnerDto, input: MessageDto) => void | Promise<void>;
  onError?: (error: SendMessageError, input: MessageDto) => void | Promise<void>;
  onAfter?: (input: MessageDto) => void | Promise<void>;
}) => {
  const store = useImStore();
  const autoId = store.generateMessageId();
  const clientMessageId = retryClientMessageId || createClientMessageId();

  let input: MessageDto = formatMessage({
    sessionUnitId,
    items: [
      {
        autoId,
        clientMessageId,
        scrollerKey: `a-${autoId}`,
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
        clientMessageId,
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
        clientMessageId,
        quoteMessageId,
        ignoreConnections: null,
        remindList,
        content,
      },
    });
  };

  let result: MessageOwnerDto;
  try {
    result = await senderService();
  } catch (err: any) {
    try {
      await onError?.call(this, {
        message: `发送失败:${err?.body?.error?.message || err?.message}`,
        success: false,
        detail: err,
      }, input);
    } finally { await onAfter?.call(this, input); }
    return;
  }
  try {
    store.setMaxMessageId(result.id!);
    store.setLastMessageForSender(result);
    await onSuccess?.call(this, result, input);
  } finally { await onAfter?.call(this, input); }
};


