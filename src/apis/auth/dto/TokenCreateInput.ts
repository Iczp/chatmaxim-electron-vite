import { TokenInputBase } from './TokenInputBase';

export type TokenCreateInput = TokenInputBase & {
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
