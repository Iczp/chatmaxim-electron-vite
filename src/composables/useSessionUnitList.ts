import { Ref, onActivated, onDeactivated, ref, watch } from 'vue';
import { SessionUnitService } from '../apis';
import { SessionItemDto, SessionUnitOwnerDto } from '../apis/dtos';
import { SessionUnitGetListInput } from '../apis/dtos/SessionUnitGetListInput';
import { useImStore } from '../stores/imStore';
export type FetchSessionUnitResult = {
  items: SessionUnitOwnerDto[];
  list: Ref<SessionUnitOwnerDto[]>;
  maxResultCount: number;
};
export const useSessionUnitList = ({
  ownerId,
  maxResultCount = 20,
}: {
  ownerId: number;
  maxResultCount?: number;
}) => {
  const store = useImStore();

  const maxMessageId = ref<number | undefined>();
  const minMessageId = ref<number | undefined>();
  const isPendingOfFetchHistorical = ref(false);
  const isPendingOfFetchLatest = ref(false);

  const keyword = ref<string>('');

  const isBof = ref(false);
  const isEof = ref(false);

  const list = ref<SessionUnitOwnerDto[]>([]);
  const service = SessionUnitService.getApiChatSessionUnitList;

  const setMaxMessageId = (items: SessionUnitOwnerDto[]): void => {
    maxMessageId.value =
      Math.max(maxMessageId.value || 0, ...items.map(x => x.lastMessage?.id || 0)) || undefined;
    console.log('setMaxMessageId', maxMessageId.value);
  };

  const setMinMessageId = (items: SessionUnitOwnerDto[]): void => {
    minMessageId.value = Math.min(...items.map(x => x.lastMessage?.id || 0)) || undefined;
    console.log('setMinMessageId', minMessageId.value);
  };

  const fetchItems = async (
    query: SessionUnitGetListInput,
    isLast: boolean,
  ): Promise<SessionUnitOwnerDto[]> => {
    const req = { maxResultCount, ownerId, ...query };
    console.log('fetchItems query', req);
    const ret = await service(req);
    const items = ret.items!;
    if (items.length != 0) {
      store.setMany(items);
      setMaxMessageId(items);
      setMinMessageId(items);
    }
    return items;
  };

  const fetchLatest = async ({ caller }: { caller?: string }): Promise<FetchSessionUnitResult> =>
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
          // console.log(
          //   'fetchLatest',
          //   items.map(x => x.id),
          // );
          resolve({ items, list, maxResultCount });
        })
        .catch(reject)
        .finally(() => {
          isPendingOfFetchLatest.value = false;
        });
    });

  const fetchHistorical = (caller?: string): Promise<FetchSessionUnitResult> =>
    new Promise(async (resolve, reject) => {
      if (isBof.value) {
        reject({ message: '没有了' });
        return;
      }
      isPendingOfFetchHistorical.value = true;
      console.warn('fetchHistorical caller', caller);
      fetchItems({ maxMessageId: minMessageId.value, keyword: keyword.value }, false)
        .then(items => {
          isBof.value = items.length < maxResultCount;
          if (items.length == 0) {
            reject({ message: '没有数据' });
            return;
          }
          list.value = items.concat(list.value);
          // console.log(
          //   'fetchHistorical',
          //   items.map(x => x.id),
          // );
          resolve({ items, list, maxResultCount });
        })
        .catch(err => {
          reject(err);
        })
        .finally(() => {
          isPendingOfFetchHistorical.value = false;
        });
    });

  const refresh = () => {
    fetchLatest({
      caller: 'refresh',
    });
  };

  onActivated(() => {});

  onDeactivated(() => {});

  watch(
    () => keyword.value,
    async (newValue, oldValue) => {
      if (newValue != oldValue && newValue.length > 0) {
        console.warn('keyword changed', newValue, oldValue);
        await searchSessionUnitList(newValue);
      }
    },
  );

  const searchResult = ref<{
    [key: string]: {
      isEnd: boolean;
      isPosting: boolean;
      items: SessionItemDto[];
    };
  }>({});

  const searchSessionUnitList = async (keyword: string) => {
    console.log('searchSessionUnitList', keyword);
    if (!searchResult.value[keyword]) {
      searchResult.value[keyword] = { isEnd: false, isPosting: false, items: [] };
    }
    const ret = searchResult.value[keyword];
    const req = { maxResultCount, ownerId, keyword, skipCount: ret.items.length };
    console.log('fetchItems query', req);
    ret.isPosting = false;
    const res = await service(req);
    ret.isPosting = true;
    ret.isEnd = res.items!.length < maxResultCount;
    ret.items = ret.items.concat(res.items!);
    searchResult.value[keyword] = ret;
    console.log('searchResult', searchResult.value);
  };

  return {
    list,
    isBof,
    isEof,
    maxMessageId,
    minMessageId,
    refresh,
    fetchLatest,
    fetchHistorical,
    isPendingOfFetchLatest,
    isPendingOfFetchHistorical,
    keyword,
    searchResult,
  };
};
