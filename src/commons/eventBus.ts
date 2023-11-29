import mittExtend from './mittExtend';

export type EventBus = {
  message: string;
  [key: string]: string;
};
// const { on, once, all, off } = mittExtend();
export const eventBus = mittExtend<EventBus>();

// eventBus.on('message',(e)=>{

// })
