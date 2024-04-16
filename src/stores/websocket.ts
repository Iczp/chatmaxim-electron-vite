import { defineStore } from 'pinia';
import { ConnectionState, ConnectionStateText } from '../apis/websockets/ConnectionState';

interface State {
  connectionState: ConnectionState;
  connectionText: string;
  netDelay: number;
}

const defaultValue: State = {
  connectionState: ConnectionState.None,
  connectionText: ConnectionStateText[ConnectionState.None],
  netDelay: -1,
};

export const useWebsocketStore = defineStore('websocket-store', {
  state: (): State => {
    return {
      ...defaultValue,
    };
  },

  actions: {
    set(state: ConnectionState) {
      this.connectionState = state;
      this.connectionText = ConnectionStateText[state];
    },
    setNetDelay(delay: number) {
      this.netDelay = delay;
    },
  },
});
