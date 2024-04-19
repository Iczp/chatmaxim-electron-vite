import { ipcRenderer } from 'electron';
import { useWebsocketStore } from '../../stores/websocketStore';
import { ConnectionState, ConnectionStateText } from './ConnectionState';
import { ReceivedDto } from './ReceivedDto';
import { useWebSocketCore } from './useWebSocketCore';
import { TicketService } from './TicketService';
import { ref } from 'vue';
import { eventBus } from '../../commons/eventBus';
import { useWebsocketUi } from './useWebsocketUi';
import { globalEvent } from '../../global-events';

export let connectionState: ConnectionState = ConnectionState.None;
export type NetDelay = {
  index?: number;
  delay?: number;
  creationTime: number;
  receivedTime?: number;
};
export const useWebSocketKit = ({
  ui = true,
  onConnected,
}: {
  ui?: boolean;
  onConnected?: (ws: WebSocket) => void;
}) => {
  const websocketStore = useWebsocketStore();
  const pingMap = ref(new Map<string, NetDelay>());
  const pingTime = ref<Date>();
  const netDelay = ref(-1);
  const setState = (state: ConnectionState) => {
    connectionState = state;
    console.log('set connectionState', state, ConnectionStateText[state]);
    websocketStore.set(state);
  };

  const setNetDelay = (delay: number) => {
    netDelay.value = delay;
    websocketStore.setNetDelay(delay);
  };

  if (ui) {
    useWebsocketUi();
  }

  const { status, data, close, send, ws } = useWebSocketCore({
    autoReconnect: {
      // retries: 10,
      delay: 1000 * 30, //30s
      onFailed() {
        console.warn('useWebSocketKit onFailed');
      },
    },
    heartbeat: {
      message: () => `ping ${new Date().getTime()}`,
      interval: 1000,
      pongTimeout: 1000,
    },
    onReady: async (retried: number): Promise<string | URL | undefined> => {
      console.log('useWebSocketKit onReady', retried);
      try {
        setState(ConnectionState.Signing);
        const res = await TicketService.generate({});
        console.log('useWebSocketKit TicketService.generate', res);
        setState(ConnectionState.SignOk);
        return res.webSocketUrl;
      } catch (err) {
        console.log('useWebSocketKit TicketService.generate error', err);
        setState(ConnectionState.SignFail);
      }
    },
    onPing(content) {
      if (pingTime.value) {
        // console.log(`useWebSocketKit ping:${(new Date().getTime() - pingTime.value.getTime()) / 1000}s`);
      }
      // console.log(`useWebSocketKit onPing:${content}`);
      pingTime.value = new Date();
      pingMap.value.set(content, {
        creationTime: pingTime.value.getTime(),
      });
    },
    onMessage: (ws: WebSocket, e: MessageEvent<any>) => {
      // setState(ConnectionState.Ok);
      
      if (typeof e.data !== 'string') {
        return;
      }
      if (/^ping \d+$/gi.test(e.data)) {
        const obj = pingMap.value.get(e.data);
        if (obj) {
          obj.receivedTime = new Date().getTime();
          const delay = obj.receivedTime - obj.creationTime;
          obj.delay = delay;
          setNetDelay(delay);
          // console.log('useWebSocketKit Received ping:', e.data, pingMap.value);
        }
        // console.log(`useWebSocketKit Received ping number:${e.data}`);
        return;
      }
      // object message
      try {
        console.log(`useWebSocketKit WebSocket Received:`, e.data);
        const data = JSON.parse(e.data) as ReceivedDto<any>;
        // emit self window
        ipcRenderer.emit('websocket', {}, { payload: e.data });
        // sent to remote window
        ipcRenderer.invoke('websocket', e.data);
        globalEvent.invoke('websocket@message', e.data);
      } catch (error) {
        console.error(`data:${error}`);
      }
    },
    onConnected: (ws: WebSocket) => {
      globalEvent.invoke('websocket@connected');
      console.log('useWebSocketKit onConnected', ws);
      setState(ConnectionState.Ok);
      eventBus.emit('connected');
      onConnected?.(ws);
    },
    onDisconnected: (ws: WebSocket, event: CloseEvent) => {
      globalEvent.invoke('websocket@disconnected');
      console.log('useWebSocketKit onDisconnected', ws, event);
      setState(ConnectionState.Close);
      eventBus.emit('disconnected');
    },
    onError: (ws: WebSocket, event: Event) => {
      globalEvent.invoke('websocket@error');
      console.log('onError', ws, event);
    },
  });

  return {
    connectionState,
    pingTime,
    netDelay,
    data,
    status,
    close,
    send,
    open,
    ws,
  };
};
