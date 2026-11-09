import { onUnmounted } from 'vue';
import type { SessionUnitOwnerDto } from '../apis/dtos';
import { apiV2 } from '../apis/v2';
import { useImStore } from '../stores/imStore';
import { appEvent, AppEvents } from '../ipc/appEvent';
import { readAuthenticatedSessionVersion } from '../data/local/localAccount';
import { readFriendScope, readCachedFriend, saveCachedFriends } from '../data/local/friendCache';
import { mergeFriendRaw } from '../data/local/friendMerge';

/** 本地好友详情先更新聊天，再后台获取服务端详情。 */
export function useFriendDetail(ownerId: number, sessionUnitId: string) {
  const store = useImStore();
  let epoch = 0;
  let version: number | null = null;
  let inFlight: Promise<void> | null = null;
  let disposed = false;
  const unsubscribe = appEvent.on(AppEvents.authChanged, payload => {
    if (payload.args?.[0] == null || version == null || payload.args?.[1] !== version) {
      epoch++;
      version = null;
      inFlight = null;
      store.ownerMap.delete(sessionUnitId);
    }
  });
  onUnmounted(() => { disposed = true; epoch++; unsubscribe(); });

  const load = (): Promise<void> => {
    if (inFlight) return inFlight;
    const currentEpoch = epoch;
    const task = (async () => {
      const sessionVersion = await readAuthenticatedSessionVersion();
      if (sessionVersion == null || disposed || currentEpoch !== epoch) return;
      version = sessionVersion;
      const current = async () => !disposed && currentEpoch === epoch &&
        sessionVersion === await readAuthenticatedSessionVersion();
      try {
        const scope = await readFriendScope(ownerId);
        if (scope?.sessionVersion === sessionVersion) {
          const cached = await readCachedFriend(scope, sessionUnitId);
          if (!await current()) return;
          if (cached) {
            const inMemory = store.getSessionUnit(sessionUnitId);
            store.setMany([inMemory ? mergeFriendRaw(cached, inMemory) : cached]);
          }
        }
      } catch { /* 本地库不可用时仍尝试网络 */ }
      if (!await current()) return;
      try {
        const remote = await apiV2.sessions.friend(sessionUnitId);
        if (!await current()) return;
        if ((remote.id && remote.id !== sessionUnitId) || (remote.ownerId != null && Number(remote.ownerId) !== ownerId)) {
          throw new Error('好友详情与当前会话不匹配');
        }
        const previous = store.getSessionUnit(sessionUnitId);
        const merged: SessionUnitOwnerDto = mergeFriendRaw(previous, { ...remote, id: sessionUnitId, ownerId });
        store.setMany([merged]);
        const scope = await readFriendScope(ownerId, true);
        if (scope?.sessionVersion === sessionVersion && await current()) await saveCachedFriends(scope, [merged]);
      } catch { console.warn('[chat] 获取好友详情失败，保留本地资料'); }
    })();
    inFlight = task;
    void task.finally(() => { if (inFlight === task) inFlight = null; }).catch(() => {});
    return task;
  };
  return { load };
}
