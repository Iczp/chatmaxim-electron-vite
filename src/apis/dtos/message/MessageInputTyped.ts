export type MessageInputTyped<T> = {
  /**
   * 引用消息Id
   */
  quoteMessageId?: number | null;
  /**
   * Ignore Connections
   */
  ignoreConnections?: Array<string> | null;
  /**
   * Remind SessionUnitId
   */
  remindList?: Array<string> | null;
  /**
   *
   *
   * @type {T}
   */
  content?: T;
};
