import { computed } from 'vue';
import { useImStore } from '../stores/im';

export const useChatObjectList = () => {
  const store = useImStore();
  store.getChatObjectByCurrentUser();
  store.getBadgeByCurrentUser();

  const badge = computed(() => store.badge);
  const badgeItems = computed(() => store.badgeItems);
  return { badge, badgeItems };
};
