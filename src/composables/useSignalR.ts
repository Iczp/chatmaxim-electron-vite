import * as signalR from '@microsoft/signalr';
import { getToken } from '../apis/auth/TokenController';
import { env } from '../env';
import { useWindowStore } from '../stores/windowStore';
import { ref } from 'vue';

type SignalRProps = {
  hubUrl?: string;
  pingInterval?: number;
  retryDelay?: number;
  onconnected?: (connectionId?: string | null) => void;
  onreconnected?: (connectionId?: string | null) => void;
  onreconnecting?: (error?: Error) => void;
  onclose?: (error?: Error) => void;
  onreceived?: (...args: any[]) => any;
};

export const useSignalR = ({
  hubUrl = env.chat_hub_url,
  pingInterval = 10000,
  retryDelay = 10000,
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
  onreceived = (...args: any[]) => {
    console.log('ReceivedMessage', ...args);
  },
}: SignalRProps) => {
  const isRetry = ref(true);
  const netDelay = ref<number | null | undefined>();
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
        console.log('nextisRetryInMilliseconds', retryContext);
        return retryDelay;
      },
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on('ReceivedMessage', onreceived);
  connection.on('Pong', args => {
    console.log('Pong', args);
  });
  connection.onreconnected(connectionId => {
    startHeartbeat(pingInterval);
    onreconnected(connectionId);
  });
  connection.onreconnecting(onreconnecting);
  connection.onclose(async () => {
    try {
      stopHeartbeat();
      onclose();
    } catch (error) {
      console.error('onclose', error);
    }
    // Restart the connection if it closes.
    if (isRetry.value && connection.state === signalR.HubConnectionState.Disconnected) {
      setTimeout(start, 5000);
    }
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
    netDelay.value = null;
    timer && clearInterval(timer);
    console.log('stopHeartbeat', timer);
  };

  const start = async () => {
    try {
      await connection.start();
      startHeartbeat(pingInterval);
      onconnected(connection.connectionId);
      console.log('SignalR Connected.');
    } catch (err) {
      console.error(err);
      // setTimeout(start, 5000);
    }
  };

  const stop = async (retry: boolean = false) => {
    try {
      isRetry.value = retry;
      stopHeartbeat();
      await connection.stop();
      console.log('SignalR Disconnected.');
    } catch (err) {
      console.error(err);
    }
  };

  // Start the connection.
  start();

  return {
    netDelay,
    connection,
    send: connection.invoke.bind(connection),
    start,
    startHeartbeat,
    stopHeartbeat,
    stop,
  };
};
