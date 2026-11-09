import { Ref, onActivated, onDeactivated, onUnmounted, ref, watch } from 'vue';
import { apiV2 } from '../apis/v2';
import { SessionItemDto, SessionUnitOwnerDto } from '../apis/dtos';
import { SessionUnitGetListInput } from '../apis/dtos/SessionUnitGetListInput';
import { useImStore } from '../stores/imStore';
import { appEvent, AppEvents } from '../ipc/appEvent';
import { readAuthenticatedSessionVersion } from '../data/local/localAccount';
import { readFriendScope, readCachedFriend, readCachedFriends, saveCachedFriends, isFriendScopeCurrent, openFriendChangesStore } from '../data/local/friendCache';
import { mergeFriendRaw } from '../data/local/friendMerge';
import { onFriendsChanged } from '../data/local/friendInvalidation';
import { syncFriendChanges } from '../realtime/friendChangesSync';

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
  } else {
    // replace / refresh: incoming takes precedence
    incoming.forEach(item => item.id && map.set(item.id, item));
    current.forEach(item => item.id && !map.has(item.id) && map.set(item.id, item));
  }
  // 本地分页索引按 score、id 降序；变更后列表末项仍必须是正确的分页边界。
  return [...map.values()].sort((a, b) => {
    const aValue = a.score ?? (a as any).Score;
    const bValue = b.score ?? (b as any).Score;
    const aScore = aValue == null ? NaN : Number(aValue);
    const bScore = bValue == null ? NaN : Number(bValue);
    const aValid = Number.isSafeInteger(aScore);
    const bValid = Number.isSafeInteger(bScore);
    if (aValid && bValid) return bScore - aScore || (a.id! < b.id! ? 1 : a.id! > b.id! ? -1 : 0);
    return aValid === bValid ? 0 : aValid ? -1 : 1;
  });
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
  let viewSessionVersion: number | null = null;
  let authEpoch = 0;
  const unsubscribeAuth = appEvent.on(AppEvents.authChanged, payload => {
    const version = payload.args?.[1];
    if (payload.args?.[0] == null || viewSessionVersion == null || version !== viewSessionVersion) {
      authEpoch++;
      viewSessionVersion = null;
      list.value = [];
      store.ownerMap.clear();
      store.destinationMap.clear();
      store.chatObjects.clear();
      store.sessionItemsMap = {};
      store.messageMap = {};
      searchResult.value = {};
      minMessageId.value = undefined;
      maxMessageId.value = undefined;
      isBof.value = false;
      isPendingOfFetchLatest.value = false;
      isPendingOfFetchHistorical.value = false;
    }
  });
  onUnmounted(unsubscribeAuth);

  const applyItems = (items: SessionUnitOwnerDto[], mode: 'append' | 'replace') => {
    if (!items.length) return;
    const normalized = items.filter(x => !!x.id && (x.ownerId == null || x.ownerId === ownerId))
      .map(x => mergeFriendRaw(store.getSessionUnit(x.id!), { ...x, ownerId: x.ownerId ?? ownerId }));
    if (!normalized.length) return;
    store.setMany(normalized);
    updateMessageIdBounds(normalized);
    list.value = mergeSessionUnits(list.value, normalized, mode);
  };

  let disposed = false;
  let changeSequence = 0;
  const changesInFlight = new Map<string, number>();
  const unsubscribeFriends = onFriendsChanged(event => {
    if (disposed || event.ownerId !== ownerId || event.sessionVersion !== viewSessionVersion) return;
    const epoch = authEpoch;
    for (const id of event.ids) {
      const sequence = ++changeSequence;
      changesInFlight.set(id, sequence);
      void (async () => {
        try {
          const scope = await readFriendScope(ownerId);
          if (!scope || scope.sessionVersion !== event.sessionVersion) return;
          const row = await readCachedFriend(scope, id);
          if (!row || !await isFriendScopeCurrent(scope)) return;
          if (disposed || epoch !== authEpoch || changesInFlight.get(id) !== sequence) return;
          const existing = list.value.some(item => item.id === id);
          const last = list.value[list.value.length - 1];
          const score = row.score == null ? NaN : Number(row.score);
          const lastScore = last?.score == null ? NaN : Number(last.score);
          const withinLoaded = last && Number.isSafeInteger(score) && Number.isSafeInteger(lastScore) &&
            (score > lastScore || (score === lastScore && id > (last.id ?? '')));
          if (existing || isBof.value || withinLoaded) applyItems([row], 'append');
        } catch { /* 认证或数据库变化时等待下一次刷新 */ }
        finally { if (changesInFlight.get(id) === sequence) changesInFlight.delete(id); }
      })();
    }
  });
  onUnmounted(() => { disposed = true; changesInFlight.clear(); unsubscribeFriends(); });

  const cacheItems = async (items: SessionUnitOwnerDto[], expectedVersion: number | null) => {
    if (!items.length) return;
    try {
      const scope = await readFriendScope(ownerId, true);
      if (scope && scope.sessionVersion === expectedVersion) await saveCachedFriends(scope, items);
    } catch (error) { console.warn('[session] 写入本地好友失败', error); }
  };


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
    limit = maxResultCount,
  ): Promise<SessionUnitOwnerDto[]> => {
    // 新后端：会话列表走 /session-unit-cache/friends（支持 ownerId / maxResultCount / maxScore / cursorId / maxMessageId）
    const ret = await apiV2.sessions.friends({
      ownerId,
      maxResultCount: limit,
      keyword: query.keyword || undefined,
      maxMessageId: isLast ? undefined : query.maxMessageId || undefined,
      maxScore: isLast ? undefined : query.maxScore,
      cursorId: isLast ? undefined : query.cursorId,
    });
    return ret.items || [];
  };

  const fetchLatest = async ({ caller }: { caller?: string } = {}): Promise<FetchSessionUnitResult> => {
    if (isPendingOfFetchLatest.value) throw new Error(`好友列表正在刷新: ${caller || ''}`);
    isPendingOfFetchLatest.value = true;
    const epoch = authEpoch;
    let cached: SessionUnitOwnerDto[] = [];
    try {
      const sessionVersion = await readAuthenticatedSessionVersion();
      if (epoch !== authEpoch) throw new Error('登录状态已变化');
      viewSessionVersion = sessionVersion;
      try {
        const scope = await readFriendScope(ownerId);
        if (scope && list.value.length === 0) {
          if (scope.sessionVersion !== sessionVersion) throw new Error('登录状态已变化');
          cached = await readCachedFriends(scope, maxResultCount);
          if (epoch !== authEpoch || !await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
          applyItems(cached, 'append');
        }
      } catch (error) {
        if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw error;
        console.warn('[session] 读取本地好友失败', error);
      }
      try {
        const items = await fetchItems({}, true);
        if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw new Error('登录状态已变化');
        applyItems(items, 'replace');
        isBof.value = items.length < maxResultCount && list.value.length <= items.length;
        await cacheItems(items, sessionVersion);
        if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw new Error('登录状态已变化');
        return { items, list, maxResultCount };
      } catch (error) {
        if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw error;
        if (cached.length) return { items: cached, list, maxResultCount };
        throw error;
      }
    } finally {
      if (epoch === authEpoch) isPendingOfFetchLatest.value = false;
    }
  };

  const fetchHistorical = async (caller?: string): Promise<FetchSessionUnitResult> => {
    if (isBof.value) throw new Error('没有了');
    if (isPendingOfFetchHistorical.value) throw new Error('正在加载中');
    isPendingOfFetchHistorical.value = true;
    const epoch = authEpoch;
    let cached: SessionUnitOwnerDto[] = [];
    try {
      const sessionVersion = await readAuthenticatedSessionVersion();
      if (epoch !== authEpoch) throw new Error('登录状态已变化');
      viewSessionVersion = sessionVersion;
      const last = list.value[list.value.length - 1];
      const score = Number(last?.score ?? (last as any)?.Score);
      if (!keyword.value && last?.id && Number.isSafeInteger(score)) {
        try {
          const scope = await readFriendScope(ownerId);
          if (scope) {
            if (scope.sessionVersion !== sessionVersion) throw new Error('登录状态已变化');
            cached = await readCachedFriends(scope, maxResultCount, { score, id: last.id });
            if (epoch !== authEpoch || !await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
            applyItems(cached, 'append');
            if (cached.length >= maxResultCount) return { items: cached, list, maxResultCount };
          }
        } catch (error) {
          if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw error;
          console.warn('[session] 读取本地好友分页失败', error);
        }
      }
      const lastItem = list.value[list.value.length - 1];
      const query: SessionUnitGetListInput & { maxScore?: number; cursorId?: string } = {
        keyword: keyword.value || undefined,
        maxMessageId: lastItem?.lastMessage?.id || lastItem?.lastMessageId || minMessageId.value,
        maxScore: lastItem?.score ?? (lastItem as any)?.Score ?? undefined,
        cursorId: lastItem?.id,
      };
      try {
        const remaining = maxResultCount - cached.length;
        const items = await fetchItems(query, false, remaining);
        if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw new Error('登录状态已变化');
        isBof.value = items.length < remaining;
        applyItems(items, 'append');
        if (!keyword.value) await cacheItems(items, sessionVersion);
        if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw new Error('登录状态已变化');
        return { items: [...cached, ...items], list, maxResultCount };
      } catch (error) {
        if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw error;
        if (cached.length) return { items: cached, list, maxResultCount };
        throw error;
      }
    } finally {
      if (epoch === authEpoch) isPendingOfFetchHistorical.value = false;
    }
  };

  const syncChanges = async () => {
    const epoch = authEpoch;
    const sessionVersion = await readAuthenticatedSessionVersion();
    if (sessionVersion == null || epoch !== authEpoch) return;
    viewSessionVersion = sessionVersion;
    const scope = await readFriendScope(ownerId);
    if (!scope || scope.sessionVersion !== sessionVersion) {
      await fetchLatest({ caller: 'refresh' });
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.locks) throw new Error('当前环境不支持好友增量同步协调');
    await navigator.locks.request(`gotoim-friend-changes:${ownerId}`, { mode: 'exclusive', ifAvailable: true }, async lock => {
      if (!lock) return;
      const local = await openFriendChangesStore(scope);
      const synced = await syncFriendChanges(ownerId, local, apiV2.sessions.changes,
        items => applyItems(items, 'replace'),
        async () => epoch === authEpoch && await isFriendScopeCurrent(scope));
      if (!synced && epoch === authEpoch) await fetchLatest({ caller: 'refresh-without-baseline' });
    });
  };
  const refresh = () => {
    void syncChanges().catch(error => {
      console.warn('[session] refresh failed', error);
    });
  };

  onActivated(() => {});
  onDeactivated(() => {});

  watch(
    () => keyword.value,
    async (newValue, oldValue) => {
      if (newValue !== oldValue && newValue.length > 0) {
        console.warn('keyword changed', newValue, oldValue);
        try { await searchSessionUnitList(newValue); }
        catch (error) { console.warn('[session] 搜索好友失败', error); }
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
    const epoch = authEpoch;
    const sessionVersion = await readAuthenticatedSessionVersion();
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
      if (epoch !== authEpoch || sessionVersion !== await readAuthenticatedSessionVersion()) throw new Error('登录状态已变化');
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
    syncChanges,
    fetchLatest,
    fetchHistorical,
    isPendingOfFetchLatest,
    isPendingOfFetchHistorical,
    keyword,
    searchResult,
  };
};
