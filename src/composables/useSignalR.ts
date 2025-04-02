import * as signalR from '@microsoft/signalr';
import { getToken } from '../apis/auth/TokenController';
import { env } from '../env';
import { useWindowStore } from '../stores/windowStore';
import { ref } from 'vue';

type SignalRProps = {
  hubUrl?: string;
  pingInterval?: number;
  onconnected?: (connectionId?: string | null) => void;
  onreconnected?: (connectionId?: string | null) => void;
  onreconnecting?: (error?: Error) => void;
  onclose?: (error?: Error) => void;
  receiveMessage?: (...args: any[]) => any;
};

export const useSignalR = ({
  hubUrl = env.chat_hub_url,
  pingInterval = 10000,
  onconnected = (connectionId?: string | null) => {
    console.log('onreconnected', connectionId);
  },
  onreconnected = (connectionId?: string | null) => {
    console.log('onreconnected', connectionId);
  },
  onreconnecting = (error?: Error) => {
    console.warn('onreconnecting', error);
  },
  onclose = (error?: Error) => {
    console.log('onclose', error);
  },
  receiveMessage = (...args: any[]) => {
    console.log('ReceivedMessage', ...args);
  },
}: SignalRProps) => {
  const netDelay = ref(-1);
  const windowStore = useWindowStore();
  const deviceId = windowStore.machineId;
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${hubUrl}?deviceId=${deviceId}`, {
      accessTokenFactory: async () => {
        const token = await getToken();
        console.log('accessTokenFactory', token);
        return token?.access_token || '';
      },
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: retryContext => {
        stopHeartbeat();
        netDelay.value = -1;
        console.log('nextRetryDelayInMilliseconds', retryContext);
        return 5000;
      },
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on('ReceivedMessage', receiveMessage);
  connection.on('Pong', args => {
    console.log('Pong', args);
  });
  connection.onreconnected(connectionId => {
    startHeartbeat(pingInterval);
    netDelay.value = 0;
    onreconnected(connectionId);
  });
  connection.onreconnecting(onreconnecting);
  connection.onclose(async () => {
    try {
      stopHeartbeat();
      netDelay.value = -1;
      onclose();
    } catch (error) {
      console.error('onclose', error);
    }
    // Restart the connection if it closes.
    // if (connection.state === signalR.HubConnectionState.Disconnected) {
    //   setTimeout(start, 5000);
    // }
  });

  let timer: NodeJS.Timeout | null = null;
  const startHeartbeat = (ms: number = 5000) => {
    stopHeartbeat();
    timer = setInterval(async () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        let ticks = new Date().getTime();
        var ret = await connection.invoke('Heartbeat', ticks);
        const stopTicks = new Date().getTime();
        netDelay.value = stopTicks - ticks;
        // console.log('Heartbeat', ret, ticks, netDelay.value);
      } else {
        console.warn('connection.state', connection.state);
      }
    }, ms);
    console.log('startHeartbeat', ms, timer);
  };
  const stopHeartbeat = () => {
    timer && clearInterval(timer);
    console.log('stopHeartbeat', timer);
  };

  async function start() {
    try {
      await connection.start();
      startHeartbeat(pingInterval);
      onconnected(connection.connectionId);
      console.log('SignalR Connected.');
    } catch (err) {
      console.error(err);
      // setTimeout(start, 5000);
    }
  }

  // Start the connection.
  start();

  return {
    netDelay,
    connection,
    send: connection.invoke.bind(connection),
    start,
    startHeartbeat,
    stopHeartbeat,
  };
};
