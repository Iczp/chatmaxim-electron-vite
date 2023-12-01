import { computed } from 'vue';
import { useUserStore } from '../stores/user';

export const useChatObjectList = () => {
  const userStore = useUserStore();
  userStore.getChatObjectByCurrentUser();
  userStore.getBadgeByCurrentUser();

  const badge = computed(() => userStore.badge);
  const badgeItems = computed(() => userStore.badgeItems);
  return { badge, badgeItems };
};
