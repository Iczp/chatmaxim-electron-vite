import { ReceivedDto } from './ReceivedDto';
import { TicketService } from './TicketService';
import { ipcRenderer } from 'electron';
import { ConnectionState, ConnectionStateText } from './ConnectionState';
import { useWebsocketStore } from '../../stores/websocket';
export type { ConnectionDto } from './ConnectionDto';

export let isConnected: boolean = false;
export let connectionState: ConnectionState = ConnectionState.None;
export let heartbeatRunning: boolean = false;
export let websocketClient: any = null;

const setState = (state: ConnectionState) => {
  connectionState = state;
  console.log('set connectionState', state, ConnectionStateText[state]);
  const store = useWebsocketStore();
  store.set(state);
};

export const isCanReConnect = () => {
  return [
    ConnectionState.None,
    ConnectionState.Close,
    ConnectionState.Error,
    ConnectionState.SignFail,
  ].some(x => x == connectionState);
};

export const connect = (wsUrl: string): void => {
  var W3CWebSocket = require('websocket').w3cwebsocket;

  setState(ConnectionState.Connecting);
  var client = new W3CWebSocket(wsUrl);

  client.onerror = () => {
    console.error('Connection Error', wsUrl);
  };

  // setInterval
  const heartbeatStart = () => {
    if (heartbeatRunning && client.readyState === client.OPEN) {
      var number = new Date().getTime(); // Math.round(Math.random() * 0xffffff);
      client.send(number.toString());
      setTimeout(heartbeatStart, 3000);
    }
  };

  client.onopen = () => {
    isConnected = true;
    setState(ConnectionState.Ok);
    console.log('WebSocket Client Connected');
    heartbeatRunning = true;
    heartbeatStart();
  };

  client.onclose = () => {
    console.log('echo-protocol Client Closed');
    isConnected = false;
    heartbeatRunning = false;
    setState(ConnectionState.Close);
  };

  client.onmessage = (e: any) => {
    // setState(ConnectionState.Ok);
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
  return client;
};

export const generateTickect = () => {
  if (websocketClient) {
    websocketClient?.close();
    console.warn('websocketClient?.close()');
  }
  setState(ConnectionState.Signing);
  TicketService.generate({})
    .then(res => {
      console.log('TicketService.generate', res);
      setState(ConnectionState.SignOk);
      websocketClient = connect(res.webSocketUrl);
    })
    .catch(err => {
      setState(ConnectionState.SignFail);
    });
};

export const startup = (): Promise<ConnectionState> => {
  if (isCanReConnect()) {
    generateTickect();
    return Promise.resolve(connectionState);
  }
  return Promise.reject(connectionState);

  // return new Promise((resolve,reject)=>{

  // })
};
