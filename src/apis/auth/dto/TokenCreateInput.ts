export type TokenCreateInput = {
  /**
   * Client Id
   *
   * @type {string}
   * @memberof TokenCreateInput
   */
  client_id: string;

  /**
   * Client 密钥
   *
   * @type {(string | undefined)}
   */
  client_secret?: string | undefined;

  /**
   * Bearer
   *
   * @type {string}
   * @memberof TokenCreateInput
   */
  grant_type: string | 'password';

  /**
   * 用户名
   *
   * @type {string}
   * @memberof TokenCreateInput
   */
  username: string;

  /**
   * 密码
   *
   * @type {(string | null | undefined)}
   * @memberof TokenCreateInput
   */
  password: string | null | undefined;

  /**
   *IM offline_access roles profile phone email address
   *
   * @type {(string| null | undefined)}
   * @memberof TokenCreateInput
   */
  scope: string | null | undefined | 'IM offline_access roles profile phone email address';
};
