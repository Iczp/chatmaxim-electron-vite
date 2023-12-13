import { computed } from 'vue';
import { useImStore } from '../stores/im';

export const useChatObjectList = () => {
  const store = useImStore();
  store.getChatObjectByCurrentUser();
  store.getBadgeByCurrentUser();

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
  return { badge, badgeItems };
};
