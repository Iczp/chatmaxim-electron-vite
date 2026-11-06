import { Ref, onActivated, onDeactivated, ref, watch } from 'vue';
import { apiV2 } from '../apis/v2';
import { SessionItemDto, SessionUnitOwnerDto } from '../apis/dtos';
import { SessionUnitGetListInput } from '../apis/dtos/SessionUnitGetListInput';
import { useImStore } from '../stores/imStore';

export type FetchSessionUnitResult = {
  items: SessionUnitOwnerDto[];
  list: Ref<SessionUnitOwnerDto[]>;
  maxResultCount: number;
};

const mergeSessionUnits = (
  current: SessionUnitOwnerDto[],
  incoming: SessionUnitOwnerDto[],
  mode: 'replace' | 'append' = 'append',
): SessionUnitOwnerDto[] => {
  const map = new Map<string, SessionUnitOwnerDto>();
  if (mode === 'append') {
    current.forEach(item => item.id && map.set(item.id, item));
    incoming.forEach(item => item.id && map.set(item.id, item));
    return [...map.values()];
  }
  // replace / refresh: incoming takes precedence
  incoming.forEach(item => item.id && map.set(item.id, item));
  current.forEach(item => item.id && !map.has(item.id) && map.set(item.id, item));
  return [...map.values()];
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

  const updateMessageIdBounds = (items: SessionUnitOwnerDto[]): void => {
    const ids = items.map(x => x.lastMessage?.id || x.lastMessageId || 0).filter(id => id > 0);
    if (ids.length === 0) return;
    const max = Math.max(...ids);
    const min = Math.min(...ids);
    maxMessageId.value = Math.max(maxMessageId.value || 0, max) || undefined;
    minMessageId.value = minMessageId.value ? Math.min(minMessageId.value, min) : min;
  };

  const fetchItems = async (
    query: SessionUnitGetListInput & { maxScore?: number; cursorId?: string },
    isLast: boolean,
  ): Promise<SessionUnitOwnerDto[]> => {
    // 新后端：会话列表走 /session-unit-cache/friends（支持 ownerId / maxResultCount / maxScore / cursorId / maxMessageId）
    const ret = await apiV2.sessions.friends({
      ownerId,
      maxResultCount,
      keyword: query.keyword || undefined,
      maxMessageId: isLast ? undefined : query.maxMessageId || undefined,
      maxScore: isLast ? undefined : query.maxScore,
      cursorId: isLast ? undefined : query.cursorId,
    });
    const items = ret.items || [];
    if (items.length !== 0) {
      store.setMany(items);
      updateMessageIdBounds(items);
    }
    return items;
  };

  const fetchLatest = async ({ caller }: { caller?: string } = {}): Promise<FetchSessionUnitResult> =>
    new Promise(async (resolve, reject) => {
      if (isPendingOfFetchLatest.value) {
        reject(`fetchLatest caller:${caller}, isPendingForFetchLatest: true`);
        return;
      }
      isPendingOfFetchLatest.value = true;
      console.warn('fetchLatest caller', caller);
      fetchItems({}, true)
        .then(items => {
          if (list.value.length === 0) {
            list.value = items;
          } else {
            list.value = mergeSessionUnits(list.value, items, 'replace');
          }
          isBof.value = items.length < maxResultCount;
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

      const lastItem = list.value[list.value.length - 1];
      const queryParams: SessionUnitGetListInput & { maxScore?: number; cursorId?: string } = {
        keyword: keyword.value || undefined,
        maxMessageId: lastItem?.lastMessage?.id || lastItem?.lastMessageId || minMessageId.value,
        maxScore: (lastItem as any)?.score ?? (lastItem as any)?.Score,
        cursorId: lastItem?.id,
      };

      fetchItems(queryParams, false)
        .then(items => {
          isBof.value = items.length < maxResultCount;
          if (items.length === 0) {
            reject({ message: '没有数据' });
            return;
          }
          list.value = mergeSessionUnits(list.value, items, 'append');
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
    fetchLatest({ caller: 'refresh' });
  };

  onActivated(() => {});
  onDeactivated(() => {});

  watch(
    () => keyword.value,
    async (newValue, oldValue) => {
      if (newValue !== oldValue && newValue.length > 0) {
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

  const searchSessionUnitList = async (searchKw: string) => {
    console.log('searchSessionUnitList', searchKw);
    if (!searchResult.value[searchKw]) {
      searchResult.value[searchKw] = { isEnd: false, isPosting: false, items: [] };
    }
    const ret = searchResult.value[searchKw];
    const last = ret.items[ret.items.length - 1];
    ret.isPosting = true;
    try {
      const res = await apiV2.sessions.friends({
        ownerId,
        keyword: searchKw,
        maxResultCount,
        maxMessageId: last?.lastMessageId || undefined,
        maxScore: last?.score || undefined,
        cursorId: last?.id || undefined,
      });
      ret.isEnd = (res.items || []).length < maxResultCount;
      const mapped = (res.items || []).map(x => ({
        id: x.id,
        ownerId: x.ownerId,
        sorting: x.sorting,
        lastMessageId: x.lastMessage?.id || x.lastMessageId,
        score: (x as any).score,
        ticks: (x as any).ticks,
      }));
      ret.items = ret.items.concat(mapped);
      searchResult.value[searchKw] = ret;
    } finally {
      ret.isPosting = false;
    }
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
