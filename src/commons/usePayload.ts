import { computed } from 'vue';
import { useWindowStore } from '../stores/window';

export const usePayload = <T>() => {
  const windowStore = useWindowStore();
  const payload = computed(() => windowStore.payload as T | undefined);
  return payload;
};
