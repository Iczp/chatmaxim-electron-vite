export type GlobalEventPayload = {
    callerId?: number;
    callerName?: string;
    args: Array<any>;
    ticks: number;
  };