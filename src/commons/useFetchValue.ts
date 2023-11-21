import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getStoreValue } from './openChildWindow';
import { setWindow, SetWindowParams } from './setWindow';

export const useFetchValue = <T>(args: SetWindowParams): Promise<T> => {
  return new Promise((resolve, reject) => {
    const route = useRoute();
    const _fn = () => {
      const event = route.query.event as string;
      const storeValue = getStoreValue<T>(event);
      //   console.log('fetchValue', event, storeValue);
      if (!storeValue) {
        reject({
          message: `值为空`,
          event,
          fullPath: route.fullPath,
        });
        return;
      }
      resolve(storeValue as T);
      setWindow(args);
    };
    onMounted(_fn);
    watch(route, _fn);
  });
};
