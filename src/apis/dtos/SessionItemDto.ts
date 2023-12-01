export type SessionItemDto = {
  /**
   * sessionUnitId:
   *
   * @type {string| null}
   */
  id?: string;

  /**
   * chatObjectId
   *
   * @type {number| null}
   */
  ownerId?: number | null;

  /**
   * sorting number
   *
   * @type {number| null}
   */
  sorting?: number | null;

  /**
   * lastMessageId
   *
   * @type {number| null}
   */
  lastMessageId?: number | null;
};
