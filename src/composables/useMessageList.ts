import { Ref, onActivated, onDeactivated, onUnmounted, ref } from 'vue';
import { apiV2 } from '../apis/v2';
import { MessageDto, MessageOwnerDto } from '../apis/dtos';
import { MessageGetListInput } from '../apis/dtos/MessageGetListInput';
import { MessageStateEnums } from '../apis/enums';
import { eventBus } from '../commons/eventBus';
import { formatMessage } from '../commons/utils';
import { ReceivedDto } from '../apis/websockets/ReceivedDto';
import { Handler } from 'mitt';
import { mergeMessages } from '../commons/mergeMessages';
import { MessageMutationSync } from '../realtime/messageMutationSync';
import { appEvent, AppEvents } from '../ipc/appEvent';
import { readAuthenticatedSessionVersion } from '../data/local/localAccount';
import { readMessageScope, isMessageScopeCurrent, readCachedMessages, saveCachedMessages, readHistoryComplete, markHistoryComplete, openMutationStore, readCachedMessagesByIds, readPendingMessages, readCachedMessageByClientId } from '../data/local/messageCache';
import { notifyMessageChanged, onMessageChanged } from '../data/local/messageInvalidation';

export type FetchMessageResult = {
  items: MessageDto[];
  list: Ref<MessageDto[]>;
  maxResultCount: number;
};

export const useMessageList = ({
  sessionUnitId,
  ownerId = 0,
  maxResultCount = 20,
  prependHistory,
}: {
  sessionUnitId: string;
  ownerId?: number;
  maxResultCount?: number;
  prependHistory?: (apply: () => void) => Promise<void>;
}) => {
  const maxMessageId = ref<number | undefined>();
  const minMessageId = ref<number | undefined>();
  const isPendingOfFetchHistorical = ref(false);
  const isPendingOfFetchLatest = ref(false);

  const isBof = ref(false);
  const isEof = ref(false);
  const latestMessageCount = ref<number>(0);
  const list = ref<MessageDto[]>([]);
  let authEpoch = 0;
  let viewSessionVersion: number | null = null;
  let localInitialized = false;
  const createMutationSync = () => {
    const epoch = authEpoch;
    return new MessageMutationSync(sessionUnitId, apiV2.messages, () => list.value, messages => {
      if (epoch === authEpoch) list.value = messages;
    }, () => openMutationStore(ownerId, sessionUnitId, viewSessionVersion), restored => {
      if (epoch !== authEpoch || !restored.length) return;
      list.value = mutationSync.applyKnown(mergeMessages(list.value, restored, 'append'))
        .sort((a, b) => (a.id ?? Number.MAX_SAFE_INTEGER) - (b.id ?? Number.MAX_SAFE_INTEGER));
    });
  };
  let mutationSync = createMutationSync();
  const unsubscribeAuth = appEvent.on(AppEvents.authChanged, payload => {
    const version = payload.args?.[1];
    if (payload.args?.[0] == null || (viewSessionVersion != null && version !== viewSessionVersion)) {
      authEpoch++;
      viewSessionVersion = null;
      list.value = [];
      maxMessageId.value = undefined;
      minMessageId.value = undefined;
      localInitialized = false;
      latestTask = null;
      latestRequested = false;
      isPendingOfFetchLatest.value = false;
      isPendingOfFetchHistorical.value = false;
      isBof.value = false;
      mutationSync = createMutationSync();
    }
  });
  onUnmounted(unsubscribeAuth);

  const ensureCurrent = async (epoch: number, version: number | null) => {
    if (epoch !== authEpoch || version !== await readAuthenticatedSessionVersion()) throw new Error('登录状态已变化');
  };
  const persistMessages = async (items: MessageDto[], version: number | null) => {
    try {
      const scope = await readMessageScope(ownerId, true);
      if (scope && scope.sessionVersion === version) {
        await saveCachedMessages(scope, sessionUnitId, items);
        for (const item of items) if (item.clientMessageId) notifyMessageChanged({
          ownerId, sessionUnitId, sessionVersion: scope.sessionVersion, clientMessageId: item.clientMessageId,
        });
        return scope;
      }
    } catch (error) { console.warn('[chat] 写入本地消息失败', error); }
    return null;
  };

  let disposed = false;
  let invalidationSequence = 0;
  const invalidationVersion = new Map<string, number>();
  const unsubscribeMessages = onMessageChanged(event => {
    if (disposed || event.ownerId !== ownerId || event.sessionUnitId !== sessionUnitId ||
        event.sessionVersion !== viewSessionVersion) return;
    const key = event.clientMessageId;
    const sequence = ++invalidationSequence;
    invalidationVersion.set(key, sequence);
    const epoch = authEpoch;
    void (async () => {
      try {
        const scope = await readMessageScope(ownerId);
        if (!scope || scope.sessionVersion !== event.sessionVersion) return;
        const row = await readCachedMessageByClientId(scope, sessionUnitId, key);
        await ensureCurrent(epoch, scope.sessionVersion);
        if (disposed || invalidationVersion.get(key) !== sequence) return;
        if (row && (row.id == null || list.value.some(item => item.clientMessageId === key))) {
          list.value = mutationSync.applyKnown(mergeMessages(list.value, [row], 'append'));
        }
        else list.value = list.value.filter(item => item.clientMessageId !== key || item.id != null);
      } catch { /* 认证变化或缓存不可用时，等待下一次刷新 */ }
      finally { if (invalidationVersion.get(key) === sequence) invalidationVersion.delete(key); }
    })();
  });
  onUnmounted(() => { disposed = true; unsubscribeMessages(); invalidationVersion.clear(); });


  const formatRawItems = (items: MessageOwnerDto[], isLast: boolean): MessageDto[] => {
    const sorted = items.map(item => {
      const id = Number(item.id);
      if (!Number.isSafeInteger(id) || id <= 0) throw new Error('服务器消息 ID 无法安全表示');
      return { ...item, id };
    }).sort((a, b) => a.id - b.id);
    return formatMessage({
      sessionUnitId,
      items: sorted,
      lastItem:
        list.value.length > 0
          ? isLast
            ? list.value.findLast(x => x.state === MessageStateEnums.Ok)
            : list.value[0]
          : undefined,
    });
  };

  /**
   * 拉取最新增量或首屏消息
   */
  let latestTask: Promise<FetchMessageResult> | null = null;
  let latestRequested = false;

  const fetchLatest = ({ caller }: { caller?: string } = {}): Promise<FetchMessageResult> => {
    latestRequested = true;
    if (latestTask) return latestTask;
    isPendingOfFetchLatest.value = true;
    const epoch = authEpoch;
    const task = (async () => {
      const collected: MessageDto[] = [];
      let cached: MessageDto[] = [];
      const version = await readAuthenticatedSessionVersion();
      viewSessionVersion = version;
      try {
        if (!localInitialized) {
          localInitialized = true;
          try {
            const scope = await readMessageScope(ownerId);
            if (scope && scope.sessionVersion === version) {
              cached = await readCachedMessages(scope, sessionUnitId, 10);
              const pending = await readPendingMessages(scope, sessionUnitId);
              await ensureCurrent(epoch, version);
              if (pending.length) list.value = mergeMessages(list.value, pending, 'append');
              if (cached.length) {
                const ids = cached.map(x => x.id).filter((id): id is number => id != null && id > 0);
                if (ids.length) { minMessageId.value = Math.min(...ids); maxMessageId.value = Math.max(...ids); }
                list.value = mutationSync.applyKnown(mergeMessages(list.value, cached, 'prepend'));
                isBof.value = cached.length < 10 && await readHistoryComplete(scope, sessionUnitId);
              }
            }
          } catch (error) {
            await ensureCurrent(epoch, version);
            localInitialized = false;
            console.warn('[chat] 读取本地消息失败', error);
          }
        }
        do {
          latestRequested = false;
          const isInitial = maxMessageId.value == null;
          let pageCount = 0;
          while (true) {
            const cursor = maxMessageId.value;
            const res = isInitial && pageCount === 0
              ? await apiV2.messages.history({ sessionUnitId, maxResultCount })
              : await apiV2.messages.latest({ sessionUnitId, minMessageId: cursor, maxResultCount });
            await ensureCurrent(epoch, version);
            const rawItems = res.items || [];
            const items = formatRawItems(rawItems, true);
            const validIds = items.map(x => x.id!);
            if (items.length) {
              const batchMax = Math.max(...validIds);
              if (!(isInitial && pageCount === 0) && cursor != null && batchMax <= cursor) throw new Error('消息同步游标未推进');
            }
            const scope = await persistMessages(items, version);
            await ensureCurrent(epoch, version);
            const visible = scope && items.length ? await readCachedMessagesByIds(scope, sessionUnitId, validIds) : items;
            await ensureCurrent(epoch, version);
            if (items.length) {
              maxMessageId.value = Math.max(maxMessageId.value || 0, ...validIds);
              if (minMessageId.value == null) minMessageId.value = Math.min(...validIds);
              list.value = mutationSync.applyKnown(mergeMessages(list.value, visible, isInitial && pageCount === 0 ? 'prepend' : 'append'));
              collected.push(...visible);
            }
            if (isInitial && pageCount === 0) {
              isBof.value = rawItems.length < maxResultCount;
              if (isBof.value && scope) await markHistoryComplete(scope, sessionUnitId);
            }
            pageCount++;
            if ((isInitial && pageCount === 1) || rawItems.length < maxResultCount) break;
            if (pageCount >= 100) throw new Error('消息同步页数超过上限，请重试');
          }
        } while (latestRequested);
        return { items: collected, list, maxResultCount };
      } catch (error) {
        await ensureCurrent(epoch, version);
        if (cached.length) {
          console.warn('[chat] 网络同步失败，保留本地消息');
          return { items: cached, list, maxResultCount };
        }
        throw error;
      }
    })();
    latestTask = task;
    void task.finally(() => {
      if (latestTask === task) { latestTask = null; isPendingOfFetchLatest.value = false; }
    }).catch(() => {});
    return task;
  };

  /** 本地历史优先，每页 30 条；本地不足且未到头时才请求服务端。 */
  const fetchHistorical = async (): Promise<FetchMessageResult> => {
    if (isBof.value) throw new Error('没有了');
    if (isPendingOfFetchHistorical.value) throw new Error('正在加载中');
    isPendingOfFetchHistorical.value = true;
    const epoch = authEpoch;
    let cached: MessageDto[] = [];
    const pageSize = 30;
    try {
      const version = await readAuthenticatedSessionVersion();
      viewSessionVersion = version;
      let scope = null;
      try {
        scope = await readMessageScope(ownerId);
        if (scope && scope.sessionVersion === version && minMessageId.value != null) {
          cached = await readCachedMessages(scope, sessionUnitId, pageSize, { score: minMessageId.value, id: '\u0000' });
          await ensureCurrent(epoch, version);
          if (cached.length) {
            const ids = cached.map(x => x.id).filter((id): id is number => id != null && id > 0);
            if (ids.length) minMessageId.value = Math.min(minMessageId.value ?? Infinity, ...ids);
            const apply = () => { list.value = mutationSync.applyKnown(mergeMessages(list.value, cached, 'prepend')); };
            if (prependHistory) await prependHistory(apply); else apply();
            await ensureCurrent(epoch, version);
          }
          if (cached.length >= pageSize) return { items: cached, list, maxResultCount: pageSize };
          if (await readHistoryComplete(scope, sessionUnitId)) {
            await ensureCurrent(epoch, version);
            isBof.value = true;
            return { items: cached, list, maxResultCount: pageSize };
          }
        }
      } catch (error) {
        await ensureCurrent(epoch, version);
        scope = null;
        console.warn('[chat] 读取本地历史消息失败', error);
      }
      try {
        const remaining = pageSize - cached.length;
        const res = await apiV2.messages.history({ sessionUnitId, maxMessageId: minMessageId.value, maxResultCount: remaining });
        await ensureCurrent(epoch, version);
        const rawItems = res.items || [];
        const items = formatRawItems(rawItems, false);
        const ids = items.map(x => x.id!);
        const savedScope = await persistMessages(items, version);
        await ensureCurrent(epoch, version);
        const visible = savedScope && items.length ? await readCachedMessagesByIds(savedScope, sessionUnitId, ids) : items;
        await ensureCurrent(epoch, version);
        if (ids.length) minMessageId.value = Math.min(minMessageId.value ?? Infinity, ...ids);
        if (visible.length) {
          const apply = () => { list.value = mutationSync.applyKnown(mergeMessages(list.value, visible, 'prepend')); };
          if (prependHistory) await prependHistory(apply); else apply();
          await ensureCurrent(epoch, version);
        }
        isBof.value = rawItems.length < remaining;
        if (isBof.value && savedScope) await markHistoryComplete(savedScope, sessionUnitId);
        return { items: [...visible, ...cached], list, maxResultCount: pageSize };
      } catch (error) {
        await ensureCurrent(epoch, version);
        if (cached.length) {
          console.warn('[chat] 网络历史加载失败，保留本地消息');
          return { items: cached, list, maxResultCount: pageSize };
        }
        throw error;
      }
    } finally {
      if (epoch === authEpoch) isPendingOfFetchHistorical.value = false;
    }
  };

  let messageHandler: Handler<[ReceivedDto<any>, MessageDto]> | undefined;
  const onMessage = (callback: (e: MessageDto) => void): void => {
    if (messageHandler) eventBus.off('chat', messageHandler);
    messageHandler = ([data, receivedMessage]) => {
      if (data?.scopes?.some((x: any) => x.sessionUnitId === sessionUnitId)) {
        callback(receivedMessage);
      }
    };
    eventBus.on('chat', messageHandler);
  };

  const offMessage = (): void => {
    if (messageHandler) eventBus.off('chat', messageHandler);
    messageHandler = undefined;
  };

  onActivated(() => {});
  onDeactivated(offMessage);
  onUnmounted(offMessage);

  const cancelChecked = () => {
    list.value.forEach(x => (x.checked = false));
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
    syncMutations: () => mutationSync.sync(),
    onMessage,
    offMessage,
    cancelChecked,
    isPendingOfFetchLatest,
    isPendingOfFetchHistorical,
  };
};
