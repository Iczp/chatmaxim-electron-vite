import { Ref, onActivated, onDeactivated, ref } from 'vue';
import { MessageService } from '../apis';
import { MessageDto, MessageOwnerDto } from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { eventBus } from '../commons/eventBus';
import { ReceivedDto } from '../apis/websockets/ReceivedDto';
import * as CommandConsts from '../apis/websockets/commandConsts';
export const useMessageList = ({ sessionUnitId }: { sessionUnitId: string }) => {
  let receivedData: ReceivedDto<any> | undefined = undefined;
  const maxMessageId = ref<number | undefined>();
  const minMessageId = ref<number | undefined>();
  let maxResultCount = 20;
  const isBof = ref(false);
  const isEof = ref(false);
  const latestMessageCount = ref<number>(0);
  const items = ref<MessageDto[]>([]);
  const service = MessageService.getApiChatMessage;
  // let task = CancelablePromise<PagedResultDto<MessageOwnerDto>>

  const setMaxMessageId = (list: MessageDto[]): void => {
    maxMessageId.value = Math.max(maxMessageId.value || 0, ...list.map(x => x.id || 0));
    console.log('setMaxMessageId', maxMessageId.value);
  };
  const setMinMessageId = (list: MessageDto[]): void => {
    minMessageId.value = Math.min(...list.map(x => x.id || 0));
    console.log('setMinMessageId', minMessageId.value);
  };

  const formatItems = (list: MessageOwnerDto[]): MessageDto[] => {
    return list.map(
      x =>
        <MessageDto>{
          ...x,
          isSelf: sessionUnitId == x.senderSessionUnit?.id,
          state: MessageStateEnums.Ok,
          isShowTime: true,
        },
    );
  };

  const fetchItems = async (query: MessageGetListInput): Promise<MessageDto[]> => {
    const req = { maxResultCount, sessionUnitId, ...query };
    console.log('fetchItems query', req);
    const ret = await service(req);
    const list = formatItems(ret.items!.reverse());
    if (list.length != 0) {
      setMaxMessageId(list);
      setMinMessageId(list);
    }
    return list;
  };

  const fetchLatest = async (args: {
    // minMessageId?: number;
    onBefore?: (items: Ref<MessageDto[]>, list: MessageDto[]) => Promise<void>;
    caller?: string;
  }) => {
    // minMessageId.value = args?.minMessageId || maxMessageId.value;

    console.warn('caller', args.caller);

    const list = await fetchItems({ minMessageId: maxMessageId.value });

    if (args.onBefore) {
      await args.onBefore(items, list);
    }
    if (list.length == maxResultCount) {
      items.value = list;
    } else {
      items.value = items.value.concat(list);
    }
  };

  const fetchHistorical = async () => {
    if (isBof.value) {
      throw new Error('没有了');
    }
    const list = await fetchItems({ maxMessageId: minMessageId.value });
    isBof.value = list.length < maxResultCount;
    items.value = list.concat(items.value);
    console.log(
      'fetchHistorical',
      list.map(x => x.id),
    );
  };

  const ifCommand = (command: string) => {
    if (receivedData?.command == command) {
    }
  };

  const onMessage = (callback: (e: MessageDto) => void) => {
    eventBus.on('chat', ([data, receivedMessage]) => {
      console.log('onMessage', receivedMessage);

      const isSelfSender = receivedMessage.senderSessionUnit?.id == sessionUnitId;
      // if (isSelfSender) {
      //   return;
      // }
      callback(receivedMessage);
      // fetchLatest().then(res => {
      //   console.warn('[chat] fetchLatest');
      // });
    });
  };

  onActivated(() => {});

  onDeactivated(() => {
    eventBus.off('chat');
  });
  return {
    latestMessageCount,
    items,
    fetchLatest,
    fetchHistorical,
    isBof,
    isEof,
    onMessage,
    maxMessageId,
    minMessageId,
  };
};
