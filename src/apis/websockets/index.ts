import { ReceivedDto } from './ReceivedDto';
import { TicketService } from './TicketService';
import { ipcRenderer } from 'electron';
import { receivedHandle } from './receivedHandle';
export type { ConnectionDto } from './ConnectionDto';

export const connect = (wsUrl: string): void => {
  var W3CWebSocket = require('websocket').w3cwebsocket;

  var client = new W3CWebSocket(wsUrl);

  client.onerror = function () {
    console.error('Connection Error', wsUrl);
  };

  client.onopen = function () {
    console.log('WebSocket Client Connected');

    function sendNumber() {
      if (client.readyState === client.OPEN) {
        var number = new Date().getTime(); // Math.round(Math.random() * 0xffffff);
        client.send(number.toString());
        setTimeout(sendNumber, 1000);
      }
    }
    // sendNumber();
  };

  client.onclose = function () {
    console.log('echo-protocol Client Closed');
  };

  client.onmessage = function (e: any) {
    if (typeof e.data === 'string') {
      if (/^\d+$/gi.test(e.data)) {
        // console.log(`Received number:${e.data}`);
      } else {
        try {
          console.log(`WebSocket Received:`, e.data);
          const data = JSON.parse(e.data) as ReceivedDto;
          receivedHandle(data);
          
          ipcRenderer.invoke('websocket', e.data);
          // ipcRenderer.emit('websocket',e.data)
        } catch (error) {
          console.error(`data:${error}`);
        }
      }
    }
  };
  return client;
};

export const generateTickect = () => {
  TicketService.generate({}).then(res => {
    console.log('TicketService.generate', res);
    connect(res.webSocketUrl);
  });
};
