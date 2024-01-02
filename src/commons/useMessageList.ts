import { Ref, onActivated, onDeactivated, ref } from 'vue';
import { MessageService } from '../apis';
import { MessageDto, MessageOwnerDto } from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { eventBus } from '../commons/eventBus';
import { formatMessage } from './utils';
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
  const isPendingOfFetchHistorical = ref(false);
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

  const fetchItems = async (query: MessageGetListInput, isLast: boolean): Promise<MessageDto[]> => {
    const req = { maxResultCount, sessionUnitId, ...query };
    console.log('fetchItems query', req);
    const ret = await service(req);
    const items = formatMessage({
      sessionUnitId,
      items: ret.items!.reverse(),
      lastItem:
        list.value.length > 0
          ? isLast
            ? list.value.findLast(x => x.state == MessageStateEnums.Ok)
            : list.value[0]
          : undefined,
    });
    if (items.length != 0) {
      setMaxMessageId(items);
      setMinMessageId(items);
    }
    return items;
  };

  const fetchLatest = async ({ caller }: { caller?: string }): Promise<FetchMessageResult> =>
    new Promise(async (resolve, reject) => {
      if (isPendingOfFetchLatest.value) {
        reject(
          `fetchLatest caller:${caller},isPendingForFetchLatest:${isPendingOfFetchLatest.value}`,
        );
        return;
      }
      isPendingOfFetchLatest.value = true;
      console.warn('fetchLatest caller', caller);
      fetchItems({ minMessageId: maxMessageId.value }, true)
        .then(items => {
          console.log(
            'fetchLatest',
            items.map(x => x.id),
          );
          resolve({ items, list, maxResultCount });
        })
        .catch(reject)
        .finally(() => {
          isPendingOfFetchLatest.value = false;
        });
    });

  const fetchHistorical = (): Promise<FetchMessageResult> =>
    new Promise(async (resolve, reject) => {
      if (isBof.value) {
        reject({ message: '没有了' });
        return;
      }
      isPendingOfFetchHistorical.value = true;
      fetchItems({ maxMessageId: minMessageId.value }, false)
        .then(items => {
          isBof.value = items.length < maxResultCount;
          if (items.length == 0) {
            reject({ message: '没有数据' });
            return;
          }
          if (isBof.value) {
            items[0].isShowTime = true;
          }
          list.value = items.concat(list.value);
          console.log(
            'fetchHistorical',
            items.map(x => x.id),
          );
          resolve({ items, list, maxResultCount });
        })
        .catch(err => {
          reject(err);
        })
        .finally(() => {
          isPendingOfFetchHistorical.value = false;
        });
    });

  const onMessage = (callback: (e: MessageDto) => void): void => {
    eventBus.on('chat', ([data, receivedMessage]) => {
      console.log('onMessage', receivedMessage);
      if (data.scopes.some(x => x.sessionUnitId == sessionUnitId)) {
        callback(receivedMessage);
      }
    });
  };

  const offMessage = (): void => eventBus.off('chat');

  onActivated(() => {});

  onDeactivated(offMessage);

  const cancelChecked = () => {
    list.value.map(x => (x.checked = false));
  };

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
    cancelChecked,
    isPendingOfFetchLatest,
    isPendingOfFetchHistorical,
  };
};
