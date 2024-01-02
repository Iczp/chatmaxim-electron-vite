import { ApiError, MessageSenderService } from '../apis';
import { MessageDto, MessageOwnerDto, SessionUnitSenderDto } from '../apis/dtos';
import { MessageStateEnums, MessageTypeEnums } from '../apis/enums';
import { useImStore } from '../stores/im';
import { useProgressStore } from '../stores/progress';
import { formatMessage } from './utils';

export const uploadFile = ({
  path,
  onProgress,
}: {
  path?: string;
  onProgress?: (percent: number) => void;
}): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (!path) {
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
  messageType,
  content,
  senderSessionUnit,
  lastItem,
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
  onBefore?: (input: MessageDto) => void;
  onProgress?: (percent: number) => void;
  onSuccess?: (entity: MessageOwnerDto, input: MessageDto) => void;
  onError?: (error: ApiError, input: MessageDto) => void;
  onAfter?: (input: MessageDto) => void;
}) => {
  const store = useImStore();
  const autoId = store.generateMessageId();
  const input: MessageDto = formatMessage({
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
      },
    ],
    lastItem,
  })[0];
  onBefore?.call(this, input);

  const progressStore = useProgressStore();
  const path = content.path;
  await uploadFile({
    path,
    onProgress(percent) {
      progressStore.set(`${autoId}`, { percent, sessionUnitId }, true, 1500);
    },
  });
  // upload file
  // ...

  MessageSenderService.send({
    messageType,
    sessionUnitId: sessionUnitId,
    requestBody: {
      quoteMessageId: quoteMessage?.id,
      ignoreConnections: null,
      remindList: [],
      content,
    },
  })
    .then(res => {
      console.log('sendRet', res);
      store.setMaxMessageId(res.id!);
      store.setLastMessageForSender(res);
      onSuccess?.call(this, res, input);
    })
    .catch((err: ApiError) => {
      onError?.call(this, err, input);
    })
    .finally(() => {
      onAfter?.call(this, input);
    });
};
