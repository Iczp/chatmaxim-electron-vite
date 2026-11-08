import { ipcRenderer } from 'electron';
import { TokenService } from './TokenService';
import { TokenDto, LoginResult, LoginInput } from './dto';
import { GrantTypeEnum } from './dto/GrantTypeEnum';
import { env } from '../../env';
import { setAuthorize } from '../../ipc/setAuthorize';
import { eventBus } from '../../commons/eventBus';
import { appEvent, AppEvents } from '../../ipc/appEvent';

export const TOKEN_KEY: string = env.token_key;

export const TOKEN_URL: string = '/connect/token';

/** Token 变化事件（登录/刷新/退出），供 store 与多窗口同步 */
export const AUTH_CHANGED_EVENT = 'auth:changed';

let cacheToken: TokenDto | null = null;

let refreshPromise: Promise<TokenDto> | null = null;

let loadPromise: Promise<void> | null = null;

let authListenerInstalled = false;

type ClientCredentialsCache = { token: string; expiresAt: number };

const clientCredentialsCache = new Map<string, ClientCredentialsCache>();

/**
 * 是否 Token 端点（该端点不附加 Bearer）
 */
export const isTokenUrl = (url?: string): boolean => {
  return url != null && (url == TOKEN_URL || url.endsWith(TOKEN_URL));
};

/**
 * 是否登录
 */
export const isLogined = (): boolean => getLocalToken() != null;

const normalizeToken = (value: any): TokenDto | null => {
  if (!value) return null;
  let token: TokenDto;
  try {
    token = typeof value === 'string' ? (JSON.parse(value) as TokenDto) : (value as TokenDto);
  } catch {
    return null;
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

const emitAuthChanged = (token: TokenDto | null) => {
  try {
    eventBus.emit(AUTH_CHANGED_EVENT as any, token as any);
  } catch (error) {
    console.warn('[auth] emit auth changed failed', error);
  }
};

/**
 * 监听主进程及跨窗口下发的 Token 变更事件，自动保持内存与存储一致。
 */
export const setupAuthListener = (): void => {
  if (authListenerInstalled) return;
  authListenerInstalled = true;
  appEvent.on(AppEvents.authChanged, payload => {
    const rawToken = payload.args?.[0];
    if (rawToken) {
      const token = normalizeToken(rawToken);
      if (token) {
        cacheToken = token;
        setStorageToken(JSON.stringify(token));
        emitAuthChanged(token);
      }
    } else {
      cacheToken = null;
      localStorage.removeItem(TOKEN_KEY);
      emitAuthChanged(null);
    }
  });
};

/**
 * 启动时从主进程对齐 Token，避免多窗口 localStorage 不一致。
 */
export const initToken = async (): Promise<void> => {
  try {
    setupAuthListener();
    if (typeof ipcRenderer !== 'undefined' && ipcRenderer?.invoke) {
      const result = await ipcRenderer.invoke('auth-token', { action: 'get' });
      const token = normalizeToken(result?.token);
      if (token) {
        cacheToken = token;
        setStorageToken(JSON.stringify(token));
        return;
      }
    }
    const local = normalizeToken(getStorageToken());
    if (local) {
      cacheToken = local;
      if (typeof ipcRenderer !== 'undefined' && ipcRenderer?.invoke) {
        await ipcRenderer.invoke('auth-token', { action: 'set', token: local });
      }
    }
  } catch (error) {
    console.warn('[auth] initToken failed', error);
  }
};

const ensureLoaded = (): Promise<void> => {
  if (cacheToken) return Promise.resolve();
  loadPromise ??= initToken().finally(() => {
    loadPromise = null;
  });
  return loadPromise;
};

/**
 * 登录（password grant）
 */
export const login = ({
  username,
  password,
  scope,
}: LoginInput & { scope?: string }): Promise<LoginResult> => {
  return new Promise((resolve, reject) => {
    TokenService.fetchToken({
      client_id: env.client_id,
      client_secret: env.client_secret || undefined,
      grant_type: GrantTypeEnum.Password,
      username,
      password,
      scope: scope || env.auth_scope,
    })
      .then(async token => {
        token = await handleToken(token, 'login');
        resolve({
          message: '登录成功',
          success: true,
          detail: token,
        });
      })
      .catch(err => {
        const message = err?.body?.error_description || err.message;
        console.error('[auth] login failed:', err);
        reject({
          message: '登录失败:' + message,
          success: false,
          detail: err,
        });
      });
  });
};

/**
 * 扫码登录票据换正式 Token（grant_type=scan-token）
 */
export const loginWithScanToken = (scanToken: string): Promise<LoginResult> => {
  return new Promise((resolve, reject) => {
    TokenService.fetchToken({
      client_id: env.client_id,
      client_secret: env.client_secret || undefined,
      grant_type: 'scan-token',
      scan_token: scanToken,
      scope: env.auth_scope,
    } as any)
      .then(async token => {
        token = await handleToken(token, 'scan-token');
        resolve({ message: '扫码登录成功', success: true, detail: token });
      })
      .catch(err => {
        const message = err?.body?.error_description || err.message;
        reject({ message: '扫码登录失败:' + message, success: false, detail: err });
      });
  });
};

/**
 * 保存 Token 并同步到主进程 / 其它窗口。
 */
export const handleToken = async (token: TokenDto, caller?: string): Promise<TokenDto> => {
  const normalized = normalizeToken(token)!;
  normalized.creation_time = normalized.creation_time || new Date();
  normalized.expires_at =
    normalized.creation_time.getTime() + Number(normalized.expires_in || 0) * 1000;
  cacheToken = normalized;
  console.log(`[auth] handleToken(${caller})`, {
    token_type: normalized.token_type,
    expires_in: normalized.expires_in,
  });
  setStorageToken(JSON.stringify(normalized));
  try {
    if (typeof ipcRenderer !== 'undefined' && ipcRenderer?.invoke) {
      await ipcRenderer.invoke('auth-token', { action: 'set', token: normalized });
    }
  } catch (error) {
    console.warn('[auth] sync token to main failed', error);
  }
  emitAuthChanged(normalized);
  return normalized;
};

/**
 * 刷新 Token：
 * 1. 优先委托主进程唯一协调者单飞刷新，保障多窗口与 401 并发不产生多重刷新与轮换失效；
 * 2. 渲染进程内部同步保留单飞 Promise；
 * 3. 非 Electron 环境提供优雅降级。
 */
export const refreshToken = async (token?: TokenDto): Promise<TokenDto> => {
  const currentToken = token || cacheToken || normalizeToken(getStorageToken());
  if (!currentToken?.refresh_token) {
    throw new Error('No refresh token is available.');
  }
  if (refreshPromise) {
    return refreshPromise;
  }
  refreshPromise = (async () => {
    try {
      if (typeof ipcRenderer !== 'undefined' && ipcRenderer?.invoke) {
        const res = await ipcRenderer.invoke('auth-token', {
          action: 'refresh',
          currentAccessToken: currentToken.access_token,
        });
        if (res?.success && res.token) {
          const nextToken = normalizeToken(res.token)!;
          cacheToken = nextToken;
          setStorageToken(JSON.stringify(nextToken));
          emitAuthChanged(nextToken);
          return nextToken;
        }
        if (res?.rejected) {
          // 主进程已清理并广播；再次清理可能误删随后登录的新会话。
          throw new Error('refresh_token_rejected');
        }
        throw new Error(res?.error || 'refresh_token_failed');
      } else {
        const newToken = await TokenService.RefreshToken({
          client_id: env.client_id,
          client_secret: env.client_secret || undefined,
          refresh_token: currentToken.refresh_token,
          grant_type: GrantTypeEnum.Refresh_token,
        } as any);
        let nextToken: TokenDto = newToken;
        // 某些服务端不轮换 refresh_token，此时保留旧值
        if (!newToken.refresh_token) {
          nextToken = { ...newToken, refresh_token: currentToken.refresh_token };
        }
        return await handleToken(nextToken, 'refreshToken');
      }
    } catch (error: any) {
      const status = error?.status;
      if (status === 400 || status === 401) {
        await clearSession('refresh_token_rejected');
      }
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
};

/**
 * 获取可用 Token：未过期直接返回，过期则刷新。
 */
export const getToken = async (): Promise<TokenDto | null> => {
  await ensureLoaded();
  const token = cacheToken;
  if (!token) return null;
  if (!isTokenExpired(token)) return token;
  try {
    return await refreshToken(token);
  } catch (error) {
    console.error('[auth] refresh token failed', error);
    return null;
  }
};

/**
 * 获取本地 Token（同步，供 UI 判断登录状态）
 */
export const getLocalToken = (): TokenDto | null => {
  if (cacheToken) {
    return cacheToken;
  }
  const token = normalizeToken(getStorageToken());
  if (token) {
    cacheToken = token;
  }
  return token;
};

export const setStorageToken = (value: string): void => {
  localStorage.setItem(TOKEN_KEY, value);
};

export const getStorageToken = (): string | null => localStorage.getItem(TOKEN_KEY);

/**
 * 是否过期（提前 5 分钟视为过期，给刷新留余量）
 */
export const isTokenExpired = (token: TokenDto | null, skewSeconds = 300): boolean => {
  if (!token) return false;
  const created = token.creation_time ? new Date(token.creation_time).getTime() : 0;
  const expiresAt = token.expires_at || created + Number(token.expires_in || 0) * 1000;
  if (!expiresAt) return true;
  return Date.now() >= expiresAt - skewSeconds * 1000;
};

/**
 * 清除登录态（本地 + 主进程 + 其它窗口）
 */
export const clearSession = async (reason?: string): Promise<void> => {
  cacheToken = null;
  refreshPromise = null;
  clientCredentialsCache.clear();
  localStorage.removeItem(TOKEN_KEY);
  try {
    if (typeof ipcRenderer !== 'undefined' && ipcRenderer?.invoke) {
      await ipcRenderer.invoke('auth-token', { action: 'clear' });
    }
  } catch (error) {
    console.warn('[auth] clear token in main failed', error);
  }
  emitAuthChanged(null);
  console.warn('[auth] session cleared:', reason);
};

/**
 * 退出登录：尽力撤销 Token，然后清本地。
 */
export const logout = async (): Promise<void> => {
  const token = getLocalToken();
  if (token?.access_token) {
    try {
      const { authV2 } = await import('../v2');
      await Promise.allSettled([
        authV2.revoke({ token: token.access_token, tokenTypeHint: 'access_token' }),
        token.refresh_token
          ? authV2.revoke({ token: token.refresh_token, tokenTypeHint: 'refresh_token' })
          : Promise.resolve(),
      ]);
    } catch (error) {
      console.warn('[auth] revoke failed, continue local logout', error);
    }
  }
  await clearSession('logout');
};

/**
 * client_credentials（扫码登录 / 设备注册专用），按 cacheKey 缓存。
 */
export const getClientCredentialsToken = async (options: {
  cacheKey: string;
  clientId?: string;
  clientSecret?: string;
  scope: string;
}): Promise<string> => {
  const cached = clientCredentialsCache.get(options.cacheKey);
  if (cached && cached.expiresAt - 60_000 > Date.now()) {
    return cached.token;
  }
  const token = await TokenService.fetchToken({
    client_id: options.clientId || env.client_id,
    client_secret: options.clientSecret || undefined,
    grant_type: 'client_credentials',
    scope: options.scope,
  } as any);
  const expiresAt = Date.now() + Number(token.expires_in || 300) * 1000;
  clientCredentialsCache.set(options.cacheKey, { token: token.access_token, expiresAt });
  return token.access_token;
};

/**
 * 登录成功后切换到主窗口。
 */
export const completeLogin = async (token: TokenDto): Promise<void> => {
  await setAuthorize(token);
};
