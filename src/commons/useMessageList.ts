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
  const isPendingForFetchLatest = ref(false);
  const isBof = ref(false);
  const isEof = ref(false);
  const latestMessageCount = ref<number>(0);
  const list = ref<MessageDto[]>([]);
  const service = MessageService.getApiChatMessage;
  // let task = CancelablePromise<PagedResultDto<MessageOwnerDto>>

  const setMaxMessageId = (items: MessageDto[]): void => {
    maxMessageId.value =
      Math.max(maxMessageId.value || 0, ...items.map(x => x.id || 0)) || undefined;
    console.log('setMaxMessageId', maxMessageId.value);
  };
  const setMinMessageId = (items: MessageDto[]): void => {
    minMessageId.value = Math.min(...items.map(x => x.id || 0)) || undefined;
    console.log('setMinMessageId', minMessageId.value);
  };

  const formatItems = (items: MessageOwnerDto[]): MessageDto[] => {
    return items.map(
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
    const items = formatItems(ret.items!.reverse());
    if (items.length != 0) {
      setMaxMessageId(items);
      setMinMessageId(items);
    }
    return items;
  };

  const fetchLatest = async (args: {
    caller?: string;
  }): Promise<{
    items: MessageDto[];
    list: Ref<MessageDto[]>;
    maxResultCount: number;
  }> => {
    // minMessageId.value = args?.minMessageId || maxMessageId.value;
    if (isPendingForFetchLatest.value) {
      throw new Error(
        `caller:${args.caller},isPendingForFetchLatest:${isPendingForFetchLatest.value}`,
      );
    }
    isPendingForFetchLatest.value = true;
    console.warn('caller', args.caller);
    const items = await fetchItems({ minMessageId: maxMessageId.value });
    isPendingForFetchLatest.value = false;
    console.log(
      'fetchLatest',
      items.map(x => x.id),
    );
    return { items, list, maxResultCount };
  };

  const fetchHistorical = async () => {
    if (isBof.value) {
      throw new Error('没有了');
    }
    const items = await fetchItems({ maxMessageId: minMessageId.value });
    isBof.value = items.length < maxResultCount;
    list.value = items.concat(list.value);
    console.log(
      'fetchHistorical',
      items.map(x => x.id),
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
    list,
    fetchLatest,
    fetchHistorical,
    isBof,
    isEof,
    onMessage,
    maxMessageId,
    minMessageId,
  };
};
