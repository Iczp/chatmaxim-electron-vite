export type RefreshTokenInput = {
  /**
   * Client Id
   *
   * @type {string}
   * @memberof RefreshTokenInput
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
   * @memberof RefreshTokenInput
   */
  readonly grant_type: 'refresh_token';

  /**
   * refresh_token value
   *
   * @type {(string | null | undefined)}
   */
  refresh_token: string | null | undefined;
};
