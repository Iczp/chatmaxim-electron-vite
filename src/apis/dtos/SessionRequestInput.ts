export type SessionRequestInput = {
  /**
   * 所属聊天对象Id[发起者]
   */
  ownerId: number;
  /**
   * 目标聊天对象Id[被请求者]
   */
  destinationId: number;
  /**
   * 请求消息
   */
  requestMessage?: string;
};
