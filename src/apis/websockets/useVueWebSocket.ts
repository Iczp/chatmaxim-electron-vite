// import { UseWebSocketReturn, WebSocketStatus, useWebSocket } from '@vueuse/core';
// import { TicketService } from './TicketService';
// import { ref } from 'vue';

// export type SignStatus = 'NONE' | 'SIGN-ING' | 'SIGN-FAIL';
// export type Status = WebSocketStatus | SignStatus;

// export const useVueWebSocket = ({ immediate = true }: { immediate?: boolean }) => {
//   const status = ref<Status>('NONE');

//   //   const logger = console

//   const connect = () => {
//     status.value = 'SIGN-ING';
//     TicketService.generate({})
//       .then(res => {
//         console.log('useVueWebSocket TicketService.generate', res);
//         status.value = 'CONNECTING';
//         const { data, send, open, close } = useWebSocket(res.webSocketUrl, {
//           immediate: true,
//           heartbeat: false,
//           onConnected(ws) {
//             status.value = 'OPEN';
//             console.log('useVueWebSocket onConnected', ws);
//             send('ping 123456789');
//           },
//           onDisconnected(ws, event) {
//             status.value = 'CLOSED';
//             console.log('useVueWebSocket onDisconnected', ws, event);
//           },
//           onError(ws, event) {
//             console.log('useVueWebSocket onError', ws, event);
//           },
//           onMessage(ws, event) {
//             console.log('useVueWebSocket onMessage', ws, event);
//           },
//         });

//         window.addEventListener('beforeunload', e => {
//           close();
//           console.warn('beforeunload', e);
//         });
//       })
//       .catch(err => {
//         status.value = 'SIGN-FAIL';
//         console.warn('useVueWebSocket TicketService.generate err:', err);
//       });
//   };

//   if (immediate) {
//     connect();
//   }

//   return {
//     status,
//   };
// };
