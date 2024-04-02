import { ipcRenderer } from 'electron';
import { useWebsocketStore } from '../../stores/websocket';
import { ConnectionState, ConnectionStateText } from './ConnectionState';
import { ReceivedDto } from './ReceivedDto';
import { useWebSocketCore } from './useWebSocketCore';
import { TicketService } from './TicketService';
import { Ref } from 'vue';

export let connectionState: ConnectionState = ConnectionState.None;

export const useWebSocketKit = () => {
  const setState = (state: ConnectionState) => {
    connectionState = state;
    console.log('set connectionState', state, ConnectionStateText[state]);
    const store = useWebsocketStore();
    store.set(state);
  };

  const onMessage = (ws: WebSocket, e: MessageEvent<any>) => {
    if (typeof e.data === 'string') {
      if (/^\d+$/gi.test(e.data)) {
        // console.log(`Received number:${e.data}`);
      } else {
        try {
          console.log(`WebSocket Received:`, e.data);
          const data = JSON.parse(e.data) as ReceivedDto<any>;
          // emit self window
          ipcRenderer.emit('websocket', {}, { payload: e.data });
          // sent to remote window
          ipcRenderer.invoke('websocket', e.data);
        } catch (error) {
          console.error(`data:${error}`);
        }
      }
    }
  };

  const onConnected = (ws: WebSocket) => {};

  const onDisconnected = (ws: WebSocket, event: CloseEvent) => {};

  const onError = (ws: WebSocket, event: Event) => {};

  const onReady = async (retried: number): Promise<string | URL | undefined> => {
    try {
      const res = await TicketService.generate({});
      console.log('TicketService.generate', res);
      setState(ConnectionState.SignOk);
      return res.webSocketUrl;
    } catch (err) {
      console.log('TicketService.generate error', err);
      setState(ConnectionState.SignFail);

      setTimeout(() => {
        
      }, 1000);
    }
  };

  const { status, data, close } = useWebSocketCore({
    onReady,
    url: async () => {
      try {
        const res = await TicketService.generate({});
        console.log('TicketService.generate', res);
        setState(ConnectionState.SignOk);
        return res.webSocketUrl;
      } catch (err) {
        console.log('TicketService.generate error', err);
        setState(ConnectionState.SignFail);
      }
    },
    autoReconnect: true,
    heartbeat: {
      message: 'ping',
      interval: 1000,
      pongTimeout: 1000,
    },
    onMessage,
    onConnected,
    onDisconnected,
    onError,
  });
};
