import { MessageDto } from '../apis/dtos';
import { ReceivedDto } from '../apis/websockets/ReceivedDto';
import mittExtend from './mittExtend';

const Message: string = 'Message';
export const EventConsts = {
  Message,
};
export type EventBus = {
  [key: string]: any;
  message: ReceivedDto<any>;
  chat: [ReceivedDto<any>, MessageDto];
};
// const { on, once, all, off } = mittExtend();
export const eventBus = mittExtend<EventBus>();

// eventBus.on('message',(e)=>{

// })
