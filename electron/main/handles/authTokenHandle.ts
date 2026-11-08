import { IpcMainHandle } from '../IpcMainHandle';
import { TOKEN_KEY, globalState, store } from '../global';
import { env } from '../env';
import { messageHub } from '../commons/messageHub';

/**
 * 规范化 Token 结构，确保 expires_at 与时间类型可用
 */
const normalizeToken = (value: any): any => {
  if (!value) return null;
  let token: any = value;
  if (typeof value === 'string') {
    try {
      token = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!token?.access_token) return null;
  if (token.creation_time && !(token.creation_time instanceof Date)) {
    token.creation_time = new Date(token.creation_time);
  }
  if (!token.creation_time) {
    token.creation_time = new Date();
  }
  if (!token.expires_at) {
    const created = token.creation_time instanceof Date ? token.creation_time.getTime() : Date.now();
    token.expires_at = created + Number(token.expires_in || 0) * 1000;
  }
  return token;
};

// 持久标记用于区分首次迁移旧版 localStorage 和明确退出后的空会话。
const LEGACY_MIGRATION_KEY = `${TOKEN_KEY}-legacy-migrated`;
let authGeneration = 0;

let refreshInFlightPromise: Promise<{
  success: boolean;
  token?: any;
  rejected?: boolean;
  status?: number;
  error?: string;
  refreshed?: boolean;
}> | null = null;

/**
 * 主进程持有唯一 Token 副本，并作为唯一的 Token 刷新协调者。
 * 覆盖：
 * 1. 多窗口并发过期单飞；
 * 2. 多窗口并发 401 单飞与重试；
 * 3. 服务端 refresh token 轮换；
 * 4. 400/401 凭据失效时全窗口广播清退；
 * 5. 零凭据日志泄漏。
 */
export const authTokenHandle: IpcMainHandle = {
  channel: 'auth-token',
  handle: async (
    _: Electron.IpcMainInvokeEvent,
    {
      action,
      token,
      currentAccessToken,
      force,
    }: {
      action: 'get' | 'set' | 'clear' | 'refresh' | 'migrate';
      token?: any;
      currentAccessToken?: string;
      force?: boolean;
    },
  ): Promise<any> => {
    switch (action) {
      case 'get': {
        const value = store.get(TOKEN_KEY);
        const resolved = normalizeToken(value ?? globalState.token ?? null);
        return { token: resolved };
      }

      case 'migrate': {
        const current = normalizeToken(store.get(TOKEN_KEY) ?? globalState.token ?? null);
        if (current || store.get(LEGACY_MIGRATION_KEY)) {
          return { token: current };
        }
        const candidate = normalizeToken(token);
        if (candidate) {
          authGeneration++;
          refreshInFlightPromise = null;
          store.set(LEGACY_MIGRATION_KEY, true);
          store.set(TOKEN_KEY, candidate);
          globalState.token = candidate;
          globalState.isAuthorized = true;
          messageHub.broadcastAll('auth:changed', [candidate]);
        }
        return { token: candidate };
      }

      case 'set': {
        const normalized = normalizeToken(token);
        if (normalized) {
          authGeneration++;
          refreshInFlightPromise = null;
          store.set(LEGACY_MIGRATION_KEY, true);
          store.set(TOKEN_KEY, normalized);
          globalState.token = normalized;
          globalState.isAuthorized = true;
          messageHub.broadcastAll('auth:changed', [normalized]);
        }
        return { success: true };
      }

      case 'clear': {
        authGeneration++;
        refreshInFlightPromise = null;
        store.set(LEGACY_MIGRATION_KEY, true);
        store.delete(TOKEN_KEY);
        globalState.token = undefined;
        globalState.isAuthorized = false;
        messageHub.broadcastAll('auth:changed', [null]);
        return { success: true };
      }

      case 'refresh': {
        const currentStored = normalizeToken(store.get(TOKEN_KEY) ?? globalState.token);
        // 如果调用者传了 currentAccessToken，且当前存储的 token 已经被其它窗口/请求成功刷新，直接返回最新 token
        if (
          !force &&
          currentStored?.access_token &&
          currentAccessToken &&
          currentStored.access_token !== currentAccessToken
        ) {
          return { success: true, token: currentStored, refreshed: false };
        }

        if (!currentStored?.refresh_token) {
          return {
            success: false,
            rejected: true,
            error: 'No refresh token available',
          };
        }

        // 如果主进程当前已在刷新中，直接等待共享单飞 Promise
        if (refreshInFlightPromise) {
          return refreshInFlightPromise;
        }

        const generation = authGeneration;
        const refreshTask = (async () => {
          try {
            const tokenUrl = `${env.auth_host}/connect/token`;
            const params = new URLSearchParams();
            params.append('client_id', env.client_id);
            if (env.client_secret) {
              params.append('client_secret', env.client_secret);
            }
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', currentStored.refresh_token);

            const response = await fetch(tokenUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
              },
              body: params.toString(),
            });

            if (response.ok) {
              const data = await response.json();
              if (generation !== authGeneration) {
                return { success: false, rejected: false, error: 'auth_session_changed' };
              }
              if (!data.refresh_token) {
                // 某些服务端不轮换 refresh_token，此时保留旧值
                data.refresh_token = currentStored.refresh_token;
              }
              const nextToken = normalizeToken(data);
              if (!nextToken) {
                return { success: false, rejected: false, error: 'invalid_token_response' };
              }
              store.set(TOKEN_KEY, nextToken);
              globalState.token = nextToken;
              globalState.isAuthorized = true;
              messageHub.broadcastAll('auth:changed', [nextToken]);
              console.log('[auth-token] refresh succeeded', {
                token_type: nextToken.token_type,
                expires_in: nextToken.expires_in,
              });
              return { success: true, token: nextToken, refreshed: true };
            }

            const status = response.status;
            if (generation !== authGeneration) {
              return { success: false, rejected: false, error: 'auth_session_changed' };
            }
            // 400 (invalid_grant) 或 401 明确说明 refresh token 失效/被撤销
            if (status === 400 || status === 401) {
              store.set(LEGACY_MIGRATION_KEY, true);
              store.delete(TOKEN_KEY);
              globalState.token = undefined;
              globalState.isAuthorized = false;
              messageHub.broadcastAll('auth:changed', [null]);
              console.warn('[auth-token] refresh rejected by server:', status);
              return {
                success: false,
                rejected: true,
                status,
                error: 'refresh_token_rejected',
              };
            }

            console.warn('[auth-token] refresh failed with status:', status);
            return {
              success: false,
              rejected: false,
              status,
              error: `refresh_http_${status}`,
            };
          } catch (error: any) {
            console.warn('[auth-token] refresh network error:', error?.message || error);
            return {
              success: false,
              rejected: false,
              error: error?.message || 'network_error',
            };
          }
        })();
        refreshInFlightPromise = refreshTask;
        void refreshTask.finally(() => {
          if (refreshInFlightPromise === refreshTask) refreshInFlightPromise = null;
        });

        return refreshTask;
      }

      default:
        return { success: false, message: `unknown action:${action}` };
    }
  },
};
