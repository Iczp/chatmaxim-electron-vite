import { MessageDto } from '../apis/dtos';
import { ReceivedDto } from '../apis/websockets/ReceivedDto';
import mittExtend from './mittExtend';

// const Message: string = 'Message';
// export const EventConsts = {
//   Message,
// };
export type EventBus = {
  /**
   * websocket connected
   */
  connected: undefined;
  /**
   * websocket disconnected
   */
  disconnected: undefined;
  /**
   * websocket message
   */
  message: ReceivedDto<any>;
  /**
   * websocket chat
   */
  chat: [ReceivedDto<any>, MessageDto];
  /**
   * websocket IncrementCompleted
   */
  IncrementCompleted: ReceivedDto<any>;
  // [key: string]: any;
};
// const { on, once, all, off } = mittExtend();
export const eventBus = mittExtend<EventBus>();