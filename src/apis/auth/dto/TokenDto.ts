export type TokenDto = {
  /**
   *
   *
   * @type {(string | null | undefined)}
   * @memberof TokenResult
   */
  readonly access_token: string | null | undefined;

  /**
   *
   *
   * @type {(string | null | undefined)}
   * @memberof TokenResult
   */
  readonly token_type: string | null | undefined;

  /**
   * 过期时间，单位：秒
   *
   * @type {(number | null | undefined)}
   * @memberof TokenResult
   */
  readonly expires_in: number;

  /**
   *
   *
   * @type {(string | null | undefined)}
   * @memberof TokenResult
   */
  readonly refresh_token: string | null | undefined;

  /**
   * Create time
   *
   * @type {Date}
   */
  creation_time?: Date;
};
