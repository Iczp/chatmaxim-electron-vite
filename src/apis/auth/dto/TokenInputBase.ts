export type TokenInputBase = {
  /**
   * Client Id
   *
   * @type {string}
   * @memberof TokenInputBase
   */
  client_id: string;

  /**
   * Client 密钥
   *
   * @type {(string | undefined)}
   */
  client_secret?: string;

  /**
   * Bearer
   *
   * @type {string}
   * @memberof TokenInputBase
   */
  readonly grant_type: string | 'password' | 'refresh_token';
};
