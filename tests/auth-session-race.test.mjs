import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// 加载真实主进程处理器，仅替换 Electron 状态、IPC 广播与 HTTP 边界。
function createHandler() {
  const values = new Map();
  const events = [];
  const state = {};
  const requests = [];
  const dependencies = {
    '../global': { TOKEN_KEY: 'token', globalState: state, store: {
      get: key => values.get(key), set: (key, value) => values.set(key, value),
      delete: key => values.delete(key),
    } },
    '../env': { env: { auth_host: 'https://auth.test', client_id: 'client' } },
    '../commons/messageHub': { messageHub: { broadcastAll: (...args) => events.push(args) } },
  };
  const source = fs.readFileSync(new URL('../electron/main/handles/authTokenHandle.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => dependencies[name], URLSearchParams, Date,
    console, fetch: () => new Promise(resolve => requests.push(resolve)) });
  const call = (action, extra = {}) => exports.authTokenHandle.handle({}, { action, ...extra });
  return { call, requests, events, values, state };
}
const token = name => ({ access_token: name, refresh_token: `r-${name}`, expires_in: 300 });
const response = (status, value) => ({ ok: status === 200, status, json: async () => value });

test('退出后迟到的刷新成功不能恢复会话', async () => {
  const h = createHandler();
  await h.call('set', { token: token('old') });
  const pending = h.call('refresh', { currentAccessToken: 'old' });
  await h.call('clear');
  h.requests[0](response(200, token('refreshed')));
  assert.equal((await pending).error, 'auth_session_changed');
  assert.equal((await h.call('get')).token, null);
  assert.equal(h.state.isAuthorized, false);
});

test('切换账号后旧刷新失败不能清除新账号，新刷新仍保持单飞', async () => {
  const h = createHandler();
  await h.call('set', { token: token('old') });
  const old = h.call('refresh', { currentAccessToken: 'old' });
  await h.call('set', { token: token('new') });
  const first = h.call('refresh', { currentAccessToken: 'new' });
  h.requests[0](response(401));
  assert.equal((await old).error, 'auth_session_changed');
  const second = h.call('refresh', { currentAccessToken: 'new' });
  assert.equal(h.requests.length, 2);
  h.requests[1](response(200, token('new-refreshed')));
  assert.equal((await first).token.access_token, 'new-refreshed');
  assert.equal((await second).token.access_token, 'new-refreshed');
  assert.equal((await h.call('get')).token.access_token, 'new-refreshed');
});

test('无效刷新响应不能覆盖当前会话', async () => {
  const h = createHandler();
  await h.call('set', { token: token('old') });
  const pending = h.call('refresh', { currentAccessToken: 'old' });
  h.requests[0](response(200, {}));
  assert.equal((await pending).error, 'invalid_token_response');
  assert.equal((await h.call('get')).token.access_token, 'old');
});
