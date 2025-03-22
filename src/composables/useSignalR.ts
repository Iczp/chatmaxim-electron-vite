import * as signalR from '@microsoft/signalr';
import { getToken } from '../apis/auth/TokenController';
import { env } from '../env';
import { useWindowStore } from '../stores/windowStore';

type SignalRProps = {
  hubUrl?: string;
  onreconnected?: (connectionId?: string) => void;
  onreconnecting?: (error?: Error) => void;
  onclose?: (error?: Error) => void;
  receiveMessage?: (...args: any[]) => any;
};

export const useSignalR = ({
  hubUrl = env.chat_hub_url,
  onreconnected = (connectionId?: string) => {
    console.log('onreconnected', connectionId);
  },
  onreconnecting = (error?: Error) => {
    console.log('onreconnecting', error);
  },
  onclose = (error?: Error) => {
    console.log('onclose', error);
  },
  receiveMessage = (...args: any[]) => {
    console.log('ReceivedMessage', ...args);
  },
}: SignalRProps) => {
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
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on('ReceivedMessage', receiveMessage);
  connection.onreconnected(onreconnected);
  connection.onreconnecting(onreconnecting);
  connection.onclose(async () => {
    try {
      onclose();
    } catch (error) {
      console.error('onclose', error);
    }
    await start();
  });

  async function start() {
    try {
      await connection.start();
      console.log('SignalR Connected.');
    } catch (err) {
      console.log(err);
      setTimeout(start, 5000);
    }
  }

  // Start the connection.
  start();

  return {
    connection,
    start,
    send: connection.invoke.bind(connection),
  };
};
