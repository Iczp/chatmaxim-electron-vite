// import { CancelablePromise } from '../core/CancelablePromise';

import { TokenService } from './TokenService';
import { TokenDto } from './dto';

export const TOKEN_KEY: string = 'TOKEN-V2023';
export const TOKEN_URL: string = '/connect/token';
let cacheToken: TokenDto | null = null;
/**
 * 是否TokenUrl
 * @param {string} url 输入
 * @return {*}  {boolean}
 */
export const isTokenUrl = (url?: string): boolean => {
  return url != null && (url == TOKEN_URL || url.endsWith(TOKEN_URL));
};

export type loginResult = {
  /**
   *
   *
   * @type {string}
   */
  message: string;

  /**
   *
   *
   * @type {boolean}
   */
  success: boolean;

  /**
   *
   *
   * @type {*}
   */
  detail?: any;
};
export const login = ({
  username,
  password,
}: {
  /**
   * 用户名
   *
   * @type {string}
   */
  username?: string;

  /**
   * 密码
   *
   * @type {string}
   */
  password?: string;
}): Promise<loginResult> => {
  return new Promise((resolve, reject) => {
    TokenService.fetchToken({
      client_id: 'IM_App',
      // client_secret: '1q2w3E*',
      grant_type: 'password',
      username: username || 'admin',
      password: password || '1q2w3E*',
      scope: 'IM offline_access roles profile phone email address',
    })
      .then((token) => {
        token = handleToken(token);
        resolve({
          message: '',
          success: true,
          detail: token,
        });
      })
      .catch((err) => {
        console.error(err);
        reject({
          message: '登录失败',
          success: false,
          detail: err,
        });
      });
  });
};

const handleToken = (token: TokenDto): TokenDto => {
  token.creation_time = new Date();
  cacheToken = token;
  // console.log('handleToken', token);
  storageToken(JSON.stringify(token));
  return token;
};
const refreshToken = async (token: TokenDto) => {
  var newToken = await TokenService.RefreshToken({
    client_id: 'IM_App',
    // client_secret: '1q2w3E*',
    refresh_token: token.refresh_token,
    grant_type: 'refresh_token',
  });
  newToken = handleToken(newToken);
  return newToken;
};

/**
 * 获取Token
 *
 * @return {*}  {(Promise<TokenDto | null>)}
 */

// export const getToken = (): Promise<TokenDto | null> => {
//   return new Promise(async (resolve, reject) => {
//     let token = getLocalToken();
//     console.log('getToken 1', token);
//     if (token) {
//       if (isTokenExpired(token)) {
//         token = await refreshToken(token);
//       }
//       resolve(token);
//       return;
//     }
//     console.log('getToken 2', token);
//     var ret = await login({});
//     console.log('getToken 3 cacheToken', cacheToken);
//     resolve(ret.detail);
//   });
// };

export const getToken = async (): Promise<TokenDto | null> => {
  let token = getLocalToken();
  console.log('getToken 1', token);
  if (token) {
    if (isTokenExpired(token)) {
      token = await refreshToken(token);
    }
    return token;
  }
  console.log('getToken 2', token);
  var ret = await login({});
  console.log('getToken 3 cacheToken', cacheToken);
  return ret.detail;
};
/**
 * 存储Token
 *
 * @param {string} value
 */
export const storageToken = (value: string): void => {
  // localStorage.setItem(TOKEN_KEY, value);
};

/**
 * 是否过期
 *
 * @param {(TokenDto | null)} token
 * @return {*}  {boolean}
 */
export const isTokenExpired = (token: TokenDto | null): boolean => {
  // console.log('isTokenExpired token', token);
  // return true;

  if (!token) {
    return false;
  }
  const creation_ticks = token.creation_time?.getTime() || 0;
  const diffSeconds = (new Date().getTime() - creation_ticks) / 1000;
  const isExpired = diffSeconds > token.expires_in - 300;
  // console.error('isTokenExpired diffSeconds', diffSeconds, isExpired);
  return isExpired;
};

/**
 * 获取本地Token
 *
 * @return {*}  {(TokenDto | null)}
 */
export const getLocalToken = (): TokenDto | null => {
  let token: TokenDto | null = null;
  if (cacheToken) {
    token = cacheToken;
    console.log('getLocalToken cacheToken');
  } else {
    let tokenString = localStorage.getItem(TOKEN_KEY);
    if (tokenString) {
      token = JSON.parse(tokenString);
      if (token && token.creation_time) {
        token.creation_time = new Date(token.creation_time);
      }
      cacheToken = token;
    }
  }

  if (isTokenExpired(token)) {
    return null;
  }

  return token;
};
