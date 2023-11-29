export type ConnectionDto = {
  /**
   *
   *
   * @type {string}
   */
  webSocketUrl: string;

  /**
   *
   *
   * @type {number}
   */
  pingIntervalSeconds: number;

  /**
   *
   *
   * @type {number}
   */
  timeoutSeconds: number;

  /**
   *
   *
   * @type {number}
   */
  heartbeatSeconds: number;

  /**
   *
   *
   * @type {number}
   */
  expireSeconds: number;

  /**
   *
   *
   * @type {Date}
   */
  creationTime: Date;
};
