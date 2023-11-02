export type SessionItemDto = {
  /**
   * sessionUnitId:
   *
   * @type {string}
   */
  id: string;

  /**
   * chatObjectId
   *
   * @type {number}
   */
  oid: number;

  /**
   * sorting number
   *
   * @type {number}
   */
  sorting: number;

  /**
   * lastMessageId
   *
   * @type {number}
   */
  lastMessageId: number;
};
