import { computed } from 'vue';
import { useUserStore } from '../stores/user';

export const useChatObjectList = () => {
  const store = useUserStore();
  store.getChatObjectByCurrentUser();
  store.getBadgeByCurrentUser();

  const badge = computed(() => store.badge);
  const badgeItems = computed(() => store.badgeItems);
  return { badge, badgeItems };
};
