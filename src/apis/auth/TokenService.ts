import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { TokenDto } from './dto';
import { toQueryString } from '../../commons/utils';
import { TOKEN_URL } from './TokenController';

/**
 * OpenIddict Token 请求体。
 *
 * 旧版仅支持 password / refresh_token，现按后端能力扩展：
 * password、refresh_token、client_credentials、scan-token。
 */
export type TokenRequestInput = {
  client_id?: string;
  client_secret?: string;
  grant_type: string;
  username?: string;
  password?: string;
  refresh_token?: string;
  /** 扫码登录一次性票据 */
  scan_token?: string;
  scope?: string;
};

export class TokenService {
  /**
   * 获取Token（全部 grant_type 共用）
   */
  public static fetchToken(input: TokenRequestInput): CancelablePromise<TokenDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: TOKEN_URL,
      mediaType: 'application/x-www-form-urlencoded',
      body: toQueryString(input),
    });
  }

  /**
   * 刷新Token
   */
  public static RefreshToken(input: TokenRequestInput): CancelablePromise<TokenDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: TOKEN_URL,
      mediaType: 'application/x-www-form-urlencoded',
      body: toQueryString(input),
    });
  }
}
