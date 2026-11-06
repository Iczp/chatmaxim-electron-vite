import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * 模拟主进程与渲染进程的认证单飞协调逻辑，验证所有 P0 验收场景：
 * 1. 多窗口并发过期/刷新只产生 1 次 HTTP 请求；
 * 2. 旧 token 晚到时直接返回已刷新的最新 token，不发网络请求；
 * 3. 服务端 refresh_token 轮换时正确更新；未轮换时正确保留；
 * 4. 400/401 invalid_grant 彻底清空凭据并广播登出；
 * 5. 网络波动（5xx/断网）不误清会话；
 * 6. 401 拦截受控最多重试 1 次，防止无限循环。
 */

function createMockAuthCoordinator(options = {}) {
  let storedToken = options.initialToken || null;
  let refreshCount = 0;
  let refreshInFlight = null;
  const broadcastEvents = [];

  const broadcastAll = (event, args) => {
    broadcastEvents.push({ event, args, time: Date.now() });
  };

  const handleRefresh = async ({ currentAccessToken, force = false, fetchFn }) => {
    // 1. 如果已被其它窗口刷新过，直接返回
    if (
      !force &&
      storedToken?.access_token &&
      currentAccessToken &&
      storedToken.access_token !== currentAccessToken
    ) {
      return { success: true, token: storedToken, refreshed: false };
    }

    if (!storedToken?.refresh_token) {
      return { success: false, rejected: true, error: 'No refresh token available' };
    }

    if (refreshInFlight) {
      return refreshInFlight;
    }

    refreshInFlight = (async () => {
      try {
        refreshCount++;
        const res = await fetchFn({
          refreshToken: storedToken.refresh_token,
        });

        if (res.status === 200) {
          const next = {
            ...res.data,
            refresh_token: res.data.refresh_token || storedToken.refresh_token,
            expires_at: Date.now() + (res.data.expires_in || 3600) * 1000,
          };
          storedToken = next;
          broadcastAll('auth:changed', [next]);
          return { success: true, token: next, refreshed: true };
        }

        if (res.status === 400 || res.status === 401) {
          storedToken = null;
          broadcastAll('auth:changed', [null]);
          return { success: false, rejected: true, status: res.status, error: 'refresh_token_rejected' };
        }

        return { success: false, rejected: false, status: res.status, error: `refresh_http_${res.status}` };
      } catch (err) {
        return { success: false, rejected: false, error: err.message };
      } finally {
        refreshInFlight = null;
      }
    })();

    return refreshInFlight;
  };

  return {
    getStoredToken: () => storedToken,
    setStoredToken: (token) => { storedToken = token; },
    getRefreshCount: () => refreshCount,
    getBroadcastEvents: () => broadcastEvents,
    handleRefresh,
  };
}

describe('P0 认证与跨窗口单飞刷新协调', () => {
  it('多窗口并发调用刷新时，严格单飞，仅产生 1 次 HTTP 请求', async () => {
    const coordinator = createMockAuthCoordinator({
      initialToken: { access_token: 'old_access_token', refresh_token: 'valid_refresh_token' },
    });

    let mockNetworkCalls = 0;
    const fetchFn = async () => {
      mockNetworkCalls++;
      await new Promise(r => setTimeout(r, 20)); // 模拟网络延迟
      return {
        status: 200,
        data: {
          access_token: 'new_access_token_123',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      };
    };

    // 模拟 5 个渲染窗口/请求同时触发刷新
    const results = await Promise.all([
      coordinator.handleRefresh({ currentAccessToken: 'old_access_token', fetchFn }),
      coordinator.handleRefresh({ currentAccessToken: 'old_access_token', fetchFn }),
      coordinator.handleRefresh({ currentAccessToken: 'old_access_token', fetchFn }),
      coordinator.handleRefresh({ currentAccessToken: 'old_access_token', fetchFn }),
      coordinator.handleRefresh({ currentAccessToken: 'old_access_token', fetchFn }),
    ]);

    assert.equal(mockNetworkCalls, 1, '网络请求次数必须严格为 1');
    assert.equal(coordinator.getRefreshCount(), 1, '主进程刷新次数必须为 1');
    for (const r of results) {
      assert.equal(r.success, true);
      assert.equal(r.token.access_token, 'new_access_token_123');
    }
    assert.equal(coordinator.getStoredToken().access_token, 'new_access_token_123');
  });

  it('旧 token 响应晚到时，直接返回已刷新的最新 token，不发网络请求', async () => {
    const coordinator = createMockAuthCoordinator({
      initialToken: { access_token: 'already_refreshed_token', refresh_token: 'rt_abc' },
    });

    let networkCalled = false;
    const fetchFn = async () => {
      networkCalled = true;
      return { status: 200, data: {} };
    };

    // 某个晚到请求携带了更旧的 token
    const result = await coordinator.handleRefresh({
      currentAccessToken: 'very_old_token_from_slow_window',
      fetchFn,
    });

    assert.equal(networkCalled, false, '不应发出网络请求');
    assert.equal(result.success, true);
    assert.equal(result.refreshed, false);
    assert.equal(result.token.access_token, 'already_refreshed_token');
  });

  it('服务端未返回新 refresh_token 时，保留既有 refresh_token', async () => {
    const coordinator = createMockAuthCoordinator({
      initialToken: { access_token: 'old_at', refresh_token: 'preserve_this_rt' },
    });

    const fetchFn = async () => ({
      status: 200,
      data: {
        access_token: 'new_at',
        token_type: 'Bearer',
        expires_in: 1800,
        // refresh_token 未提供
      },
    });

    const result = await coordinator.handleRefresh({ currentAccessToken: 'old_at', fetchFn });
    assert.equal(result.success, true);
    assert.equal(result.token.refresh_token, 'preserve_this_rt');
    assert.equal(coordinator.getStoredToken().refresh_token, 'preserve_this_rt');
  });

  it('服务端返回新 refresh_token 时，支持轮换更新', async () => {
    const coordinator = createMockAuthCoordinator({
      initialToken: { access_token: 'old_at', refresh_token: 'old_rt' },
    });

    const fetchFn = async () => ({
      status: 200,
      data: {
        access_token: 'new_at',
        refresh_token: 'rotated_new_rt',
        token_type: 'Bearer',
        expires_in: 1800,
      },
    });

    const result = await coordinator.handleRefresh({ currentAccessToken: 'old_at', fetchFn });
    assert.equal(result.success, true);
    assert.equal(result.token.refresh_token, 'rotated_new_rt');
    assert.equal(coordinator.getStoredToken().refresh_token, 'rotated_new_rt');
  });

  it('400/401 凭据失效时清退会话并广播 auth:changed null', async () => {
    const coordinator = createMockAuthCoordinator({
      initialToken: { access_token: 'expired_at', refresh_token: 'revoked_rt' },
    });

    const fetchFn = async () => ({
      status: 400,
      data: { error: 'invalid_grant', error_description: 'The refresh token is invalid.' },
    });

    const result = await coordinator.handleRefresh({ currentAccessToken: 'expired_at', fetchFn });
    assert.equal(result.success, false);
    assert.equal(result.rejected, true);
    assert.equal(result.error, 'refresh_token_rejected');
    assert.equal(coordinator.getStoredToken(), null, '本地存储必须清空');

    const events = coordinator.getBroadcastEvents();
    assert.equal(events.length, 1);
    assert.equal(events[0].event, 'auth:changed');
    assert.equal(events[0].args[0], null);
  });

  it('网络故障（500/断网）不会误清会话，允许后续重试', async () => {
    const initial = { access_token: 'current_at', refresh_token: 'valid_rt' };
    const coordinator = createMockAuthCoordinator({ initialToken: initial });

    const fetchFn = async () => {
      throw new Error('ECONNRESET');
    };

    const result = await coordinator.handleRefresh({ currentAccessToken: 'current_at', fetchFn });
    assert.equal(result.success, false);
    assert.equal(result.rejected, false);
    assert.equal(result.error, 'ECONNRESET');
    assert.deepEqual(coordinator.getStoredToken(), initial, '网络故障不得清除已有的 Token');
  });
});

describe('401 拦截受控重试逻辑', () => {
  it('业务请求遇 401 触发刷新重试；二次 401 不得再次重试', async () => {
    let refreshCalls = 0;
    let requestAttempts = 0;

    const mockRefreshToken = async () => {
      refreshCalls++;
      return { access_token: 'refreshed_at', token_type: 'Bearer' };
    };

    // 模拟 Axios 拦截器调用链
    const executeRequest = async (config) => {
      requestAttempts++;
      // 模拟服务端持续返回 401（例如被封禁）
      const error = {
        config,
        response: { status: 401 },
      };

      // 拦截器逻辑
      if (
        error.response?.status === 401 &&
        config &&
        !config._retry401
      ) {
        config._retry401 = true;
        const newToken = await mockRefreshToken();
        config.headers = { Authorization: `${newToken.token_type} ${newToken.access_token}` };
        return executeRequest(config);
      }

      throw error;
    };

    const initialConfig = { url: '/api/chat/messages', headers: {} };
    await assert.rejects(
      async () => executeRequest(initialConfig),
      (err) => err.response?.status === 401,
    );

    assert.equal(refreshCalls, 1, '刷新函数只应调用 1 次');
    assert.equal(requestAttempts, 2, '原请求失败后仅重试 1 次，共 2 次尝试');
    assert.equal(initialConfig._retry401, true, '_retry401 标记必须为 true');
  });
});
