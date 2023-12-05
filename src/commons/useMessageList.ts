import { Ref, onActivated, onDeactivated, ref } from 'vue';
import { MessageService } from '../apis';
import { MessageDto, MessageOwnerDto } from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { eventBus } from '../commons/eventBus';
export type FetchMessageResult = {
  items: MessageDto[];
  list: Ref<MessageDto[]>;
  maxResultCount: number;
};
export const useMessageList = ({
  sessionUnitId,
  maxResultCount = 20,
}: {
  sessionUnitId: string;
  maxResultCount?: number;
}) => {
  const maxMessageId = ref<number | undefined>();
  const minMessageId = ref<number | undefined>();
  const isPendingOfFetchLatest = ref(false);
  const isBof = ref(false);
  const isEof = ref(false);
  const latestMessageCount = ref<number>(0);
  const list = ref<MessageDto[]>([]);
  const service = MessageService.getApiChatMessage;

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

  const fetchLatest = async ({ caller }: { caller?: string }): Promise<FetchMessageResult> => {
    // minMessageId.value = args?.minMessageId || maxMessageId.value;
    if (isPendingOfFetchLatest.value) {
      throw new Error(`caller:${caller},isPendingForFetchLatest:${isPendingOfFetchLatest.value}`);
    }
    isPendingOfFetchLatest.value = true;
    console.warn('caller', caller);
    const items = await fetchItems({ minMessageId: maxMessageId.value });
    isPendingOfFetchLatest.value = false;
    console.log(
      'fetchLatest',
      items.map(x => x.id),
    );
    return { items, list, maxResultCount };
  };

  const fetchHistorical = async (): Promise<FetchMessageResult> => {
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
    return { items, list, maxResultCount };
  };

  const onMessage = (callback: (e: MessageDto) => void): void => {
    eventBus.on('chat', ([data, receivedMessage]) => {
      console.log('onMessage', receivedMessage);
      callback(receivedMessage);
    });
  };

  const offMessage = (): void => eventBus.off('chat');

  onActivated(() => {});

  onDeactivated(offMessage);

  return {
    latestMessageCount,
    list,
    isBof,
    isEof,
    maxMessageId,
    minMessageId,
    fetchLatest,
    fetchHistorical,
    onMessage,
    offMessage,
  };
};
