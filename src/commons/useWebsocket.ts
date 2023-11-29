import { computed, onMounted, ref, watch } from 'vue';
import { useWebsocketStore } from '../stores/websocket';
import { startup } from '../apis/websockets';
import { message } from 'ant-design-vue';
import { ConnectionState } from '../apis/websockets/ConnectionState';

export const useWebsocket = () => {
  const store = useWebsocketStore();
  const connectionState = computed(() => store.connectionState);
  const connectionText = computed(() => store.connectionText);
  const retryCount = ref(0);

  onMounted(() => startup());
  const key = 'websocket';
  watch(
    () => connectionState.value,
    state => {
      const params = {
        content: connectionText.value,
        key,
        class: 'websocket-state',
        style: {
          top: '64px',
        },
      };
      switch (state) {
        case ConnectionState.Ok:
          message.success({ ...params, duration: 2 });
          break;
        case ConnectionState.SignOk:
          message.info(params);
          break;
        case ConnectionState.Error:
        case ConnectionState.SignFail:
          message.error({ ...params, duration: 5 });
          break;
        case ConnectionState.Connecting:
        case ConnectionState.Signing:
          message.loading(params);
          break;
        case ConnectionState.Close:
          message.warn(params);
          break;
        case ConnectionState.None:
        default:
          break;
      }
    },
    {
      immediate: true,
    },
  );

  return { connectionText, connectionState, retryCount };
};
