import { ApiError, MessageSenderService } from '../apis';
import { MessageDto, MessageOwnerDto, SessionUnitSenderDto } from '../apis/dtos';
import { MessageStateEnums, MessageTypeEnums } from '../apis/enums';
import { useImStore } from '../stores/im';
import { formatMessage } from './utils';

export const sendMessage = async ({
  sessionUnitId,
  quoteMessage,
  messageType,
  content,
  senderSessionUnit,
  lastItem,
  onBefore,
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
