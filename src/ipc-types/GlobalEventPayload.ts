export type GlobalEventName =
  /**  */
  | 'websocket@message'
  /**  */
  | 'websocket@connected'
  /**  */
  | 'websocket@error'
  /**  */
  | 'websocket@disconnected'
  | 'message@rollback'
  | 'app@login'
  | 'app@logout';

export type GlobalEventPayload = {
  callerId?: number;
  callerName?: string;
  eventName?: GlobalEventName;
  args: any[];
  ticks: number;
};
