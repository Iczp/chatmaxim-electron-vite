import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getStoreValue } from './openChildWindow';
import { setWindow } from './setWindow';
import { WindowParams } from '../ipc-types';

export const useRemoteStore = <T>(args?: WindowParams) => {
  const storeValue = ref<T | undefined>();
  const route = useRoute();
  const _fn = (caller: string) => {
    console.log('caller:', caller);
    const event = route.query.event as string;
    storeValue.value = getStoreValue<T>(event);
    console.log('useRemoteStore', event, storeValue.value);
    if (storeValue.value && args) {
      setWindow(args);
      // console.log('useRemoteStore resolve');
    }
  };
  onMounted(() => _fn('onMounted'));
  watch(
    () => route.fullPath,
    v => _fn('watch route'),
  );

  return storeValue;
};
