import { computed, onUnmounted } from 'vue';
import { useImStore } from '../stores/imStore';
import { appEvent, AppEvents } from '../ipc/appEvent';
import { readAuthenticatedSessionVersion } from '../data/local/localAccount';
import { readOwnerScope, readCachedOwners } from '../data/local/ownerCache';

export const useBadges = () => {
  const store = useImStore();
  let epoch = 0;
  let viewVersion: number | null = null;
  let disposed = false;

  const refresh = () => {
    store.getChatObjectByCurrentUser();
    store.getBadgeByCurrentUser();
  };

  const badge = computed(() => store.badge);
  const badgeItems = computed(() =>
    store.badgeItems.map(x => {
      //分离窗口的角标
      const separatedSum = store
        .getSessionItems(x.chatObjectId!)
        .filter(x => x.isSeparated)
        .map(x => x.id)
        .reduce((partialSum, n) => partialSum + (store.getSessionUnit(n!)?.publicBadge || 0), 0);
      return {
        ...x,
        badge: Number(x?.badge || 0) - separatedSum,
      };
    }),
  );

  const initialize = async (): Promise<{ ownerId: number; sessionVersion: number } | null> => {
    const currentEpoch = epoch;
    let selected: number | null = null;
    try {
      const version = await readAuthenticatedSessionVersion();
      if (disposed || currentEpoch !== epoch || version == null) return null;
      viewVersion = version;
      const scope = await readOwnerScope();
      if (scope?.sessionVersion === version) {
        const cached = await readCachedOwners(scope);
        if (disposed || currentEpoch !== epoch || version !== await readAuthenticatedSessionVersion()) return null;
        store.setChatObjects(cached.owners.map(owner => ({ chatObjectId: owner.id, owner })));
        selected = cached.owners.find(owner => owner.id === cached.currentOwnerId)?.id ?? cached.owners[0]?.id ?? null;
      }
    } catch { console.warn('[im] 读取本地聊天身份失败'); }
    if (!disposed && currentEpoch === epoch) refresh();
    return selected != null && viewVersion != null ? { ownerId: selected, sessionVersion: viewVersion } : null;
  };
  const unsubscribe = appEvent.on(AppEvents.authChanged, payload => {
    const version = payload.args?.[1];
    if (payload.args?.[0] == null || viewVersion == null || version !== viewVersion) {
      epoch++;
      viewVersion = null;
      store.chatObjects.clear();
      if (payload.args?.[0] != null) void initialize();
    }
  });
  onUnmounted(() => { disposed = true; epoch++; unsubscribe(); });
  const ready = initialize();

  return { badge, badgeItems, refresh, ready };
};
