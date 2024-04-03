import { computed } from 'vue';
import { useWindowStore } from '../stores/window';

export const usePayload = <T>(key?: string) => {
  const windowStore = useWindowStore();
  const payload = computed(
    () => (key ? (windowStore?.payload || {})[key] : windowStore.payload) as T | undefined,
  );
  return payload;
};
