import { onActivated, ref, watch, WatchOptions } from 'vue';
import { CancelablePromise, MessageService } from '../apis';
import { MessageDto, MessageOwnerDto, PagedResultDto } from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { useFetchList } from './useFetchList';
import mitt from 'mitt';
import { usePagedResult } from './usePagedResult';
export const useMessageList = ({ sessionUnitId }: { sessionUnitId: string }) => {
  let maxMessageId: number | undefined = undefined;
  let minMessageId: number | undefined = undefined;
  const latestMessageCount = ref<number>(0);
  const items = ref<MessageDto[]>([]);
  const service = MessageService.getApiChatMessage;
  // let task = CancelablePromise<PagedResultDto<MessageOwnerDto>>
  const emitter = mitt<{
    changeTick: any;
  }>();

  const setMaxMessageId = (list: MessageDto[]): void => {
    maxMessageId = Math.max(maxMessageId || 0, ...list.map(x => x.id || 0));
  };
  const setMinMessageId = (list: MessageDto[]): void => {
    minMessageId = Math.min(...list.map(x => x.id || 0));
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
    const req = { maxResultCount: 10, sessionUnitId, ...query };
    console.log('fetchItems query', req);
    const ret = await service(req);
    const list = formatItems(ret.items!.reverse());
    setMaxMessageId(list);
    setMinMessageId(list);
    return list;
  };

  const fetchLatest = async () => {
    const list = await fetchItems({ minMessageId: maxMessageId });
    items.value = items.value.concat(list);
  };

  const fetchHistorical = async () => {
    const list = await fetchItems({ maxMessageId: minMessageId });
    items.value = list.concat(items.value);
    console.log(
      'fetchHistorical',
      list.map(x => x.id),
    );
  };

  // watch(
  //   () => query.value,
  //   v => {
  //     console.log('#watch', v);
  //   },
  //   {
  //     immediate: true,
  //     deep: true,
  //   },
  // );

  return { latestMessageCount, items, fetchLatest, fetchHistorical };
};
