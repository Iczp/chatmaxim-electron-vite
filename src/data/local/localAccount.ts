import { ipcRenderer } from 'electron';
import { getToken } from '../../apis/auth/TokenController';
import { authV2 } from '../../apis/v2';
import { env } from '../../env';

function matchesAuthHost(accountId: unknown): accountId is string {
  if (typeof accountId !== 'string') return false;
  try {
    const value = JSON.parse(accountId);
    return Array.isArray(value) && value.length === 2 && value[0] === env.auth_host &&
      typeof value[1] === 'string' && !!value[1].trim();
  } catch { return false; }
}

/** 仅以认证服务 userinfo 返回的 sub 作为本地数据分区，不能从令牌内容猜测账号。 */
export async function resolveLocalAccountId(): Promise<string | null> {
  if (!ipcRenderer?.invoke) return null;
  const current = await ipcRenderer.invoke('auth-token', { action: 'get' });
  if (!current?.token?.access_token) return null;
  if (matchesAuthHost(current.accountId)) return current.accountId;
  // 首次建立绑定需要在线；已绑定时离线启动无需请求网络。
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await getToken();
    if (!token?.access_token) return null;
    const snapshot = await ipcRenderer.invoke('auth-token', { action: 'get' });
    if (snapshot?.token?.access_token !== token.access_token || !Number.isSafeInteger(snapshot?.sessionVersion)) continue;
    const info = await authV2.userInfo();
    if (typeof info?.sub !== 'string' || !info.sub.trim()) throw new Error('用户信息缺少账号标识');
    const accountId = JSON.stringify([env.auth_host, info.sub]);
    const saved = await ipcRenderer.invoke('auth-token', {
      action: 'set-account', currentAccessToken: token.access_token, sessionVersion: snapshot.sessionVersion, accountId,
    });
    if (saved?.success) return accountId;
    // 令牌刷新或账号切换时不能绑定旧响应，重新获取与当前会话匹配的用户信息。
  }
  throw new Error('登录状态变化，无法绑定本地账号');
}

export type LocalAccountSnapshot = { accountId: string; sessionVersion: number };

/** 仅读取已绑定会话，不触发网络。 */
export async function readLocalAccountSnapshot(): Promise<LocalAccountSnapshot | null> {
  const current = await ipcRenderer.invoke('auth-token', { action: 'get' });
  if (!current?.token?.access_token || !matchesAuthHost(current.accountId) ||
      !Number.isSafeInteger(current.sessionVersion)) return null;
  return { accountId: current.accountId, sessionVersion: current.sessionVersion };
}

export async function isLocalAccountCurrent(snapshot: LocalAccountSnapshot): Promise<boolean> {
  const current = await readLocalAccountSnapshot();
  return !!current && current.accountId === snapshot.accountId && current.sessionVersion === snapshot.sessionVersion;
}

export async function readAuthenticatedSessionVersion(): Promise<number | null> {
  const current = await ipcRenderer.invoke('auth-token', { action: 'get' });
  return current?.token?.access_token && Number.isSafeInteger(current.sessionVersion) ? current.sessionVersion : null;
}
