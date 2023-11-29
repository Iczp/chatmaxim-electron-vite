import { defineStore } from 'pinia';
import { ConnectionState, ConnectionStateText } from '../apis/websockets/ConnectionState';

interface State {
  connectionState: ConnectionState;
  connectionText: string;
}

const defaultValue: State = {
  connectionState: ConnectionState.None,
  connectionText: ConnectionStateText[ConnectionState.None],
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
  },
});
