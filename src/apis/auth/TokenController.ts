// import { CancelablePromise } from '../core/CancelablePromise';

import { AxiosError } from 'axios';
import { TokenService } from './TokenService';
import { TokenDto, LoginResult, LoginInput } from './dto';
import { GrantTypeEnum } from './dto/GrantTypeEnum';
import { ApiError } from '../core/ApiError';

export const TOKEN_KEY: string = 'TOKEN-V2023';

export const TOKEN_URL: string = '/connect/token';

let cacheToken: TokenDto | null = null;

export let isPostToken: boolean = false;

/**
 * 是否TokenUrl
 * @param {string} url 输入
 * @return {*}  {boolean}
 */
export const isTokenUrl = (url?: string): boolean => {
  return url != null && (url == TOKEN_URL || url.endsWith(TOKEN_URL));
};

/**
 * 是否登录
 *
 * @return {*}  {boolean}
 */
export const isLogined = (): boolean => getLocalToken() != null;

/**
 * 登录
 *
 * @param {LoginInput} { username, password }
 * @return {*}  {Promise<LoginResult>}
 */

export const login = ({ username, password }: LoginInput): Promise<LoginResult> => {
  return new Promise((resolve, reject) => {
    TokenService.fetchToken({
      client_id: 'IM_App',
      // client_secret: '1q2w3E*',
      grant_type: GrantTypeEnum.Password,
      username: username || 'admin',
      password: password || '1q2w3E*',
      scope: 'IM offline_access roles profile phone email address',
    })
      .then(token => {
        token = handleToken(token);
        resolve({
          message: '登录成功',
          success: true,
          detail: token,
        });
      })
      .catch(err => {
        let message = err.body?.error_description || err.message;
        console.error('err:', err, JSON.stringify(err));
        reject({
          message: '登录失败:' + message,
          success: false,
          detail: err,
        });
      });
  });
};

/**
 *
 *
 * @param {TokenDto} token
 * @return {*}  {TokenDto}
 */
export const handleToken = (token: TokenDto): TokenDto => {
  token.creation_time = new Date();
  cacheToken = token;
  // console.log('handleToken', token);
  storageToken(JSON.stringify(token));
  return token;
};

/**
 *
 *
 * @param {TokenDto} token
 * @return {*}
 */
export const refreshToken = async (token: TokenDto) => {
  var newToken = await TokenService.RefreshToken({
    client_id: 'IM_App',
    // client_secret: '1q2w3E*',
    refresh_token: token.refresh_token,
    grant_type: GrantTypeEnum.Refresh_token,
  });
  newToken = handleToken(newToken);
  return newToken;
};

/**
 * 获取Token
 *
 * @param {number} [tryCount=100] 重试次数
 * @return {*}  {(Promise<TokenDto | null>)}
 */

export const getToken = (tryCount: number = 100): Promise<TokenDto | null> => {
  return new Promise(async (resolve, reject) => {
    if (isPostToken) {
      // console.log('isPostToken', isPostToken, tryCount);
      if (tryCount < 0) {
        reject('超过重试次数');
        return;
      }
      setTimeout(async () => {
        // console.log('setTimeout isPostToken', isPostToken);
        tryCount--;
        resolve(await getToken(tryCount));
      }, 100);
      return;
    }
    isPostToken = true;
    let token = await postToken();
    isPostToken = false;
    resolve(token);
  });
};
/**
 * 获取Token
 *
 * @return {*}  {(Promise<TokenDto | null>)}
 */
export const postToken = async (): Promise<TokenDto | null> => {
  let token = getLocalToken();
  // console.log('postToken 1', token);
  if (token) {
    if (isTokenExpired(token)) {
      token = await refreshToken(token);
    }
    return token;
  }
  // console.log('postToken 2', token);
  var ret = await login({
    username: 'admin',
    password: '1q2w3E*',
  });
  // console.log('postToken 3 cacheToken', cacheToken);
  return ret.detail;
};

/**
 * 存储Token
 *
 * @param {string} value
 */
export const storageToken = (value: string): void => {
  localStorage.setItem(TOKEN_KEY, value);
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
    // console.log('getLocalToken cacheToken');
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
