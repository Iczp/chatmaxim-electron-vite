import { GrantTypeEnum } from './GrantTypeEnum';
import { TokenInputBase } from './TokenInputBase';

export type RefreshTokenInput = TokenInputBase & {
  /**
   * refresh_token value
   *
   * @type {(string | GrantTypeEnum)}
   */
  refresh_token: string | GrantTypeEnum;
};
