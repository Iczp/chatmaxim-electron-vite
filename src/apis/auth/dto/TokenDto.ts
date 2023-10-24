export type TokenDto = {
  /**
   *
   *
   * @type {(string )}
   * @memberof TokenResult
   */
  readonly access_token: string;

  /**
   *
   *
   * @type {(string )}
   * @memberof TokenResult
   */
  readonly token_type: string;

  /**
   * 过期时间，单位：秒
   *
   * @type {(number )}
   * @memberof TokenResult
   */
  readonly expires_in: number;

  /**
   *
   *
   * @type {(string )}
   * @memberof TokenResult
   */
  readonly refresh_token: string;

  /**
   * Create time
   *
   * @type {Date}
   */
  creation_time?: Date;
};
