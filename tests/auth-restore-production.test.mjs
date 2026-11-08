import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function createRenderer(invoke, initialToken) {
  const values = new Map(initialToken ? [['token', JSON.stringify(initialToken)]] : []);
  const listeners = new Map();
  const localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const deps = {
    electron: { ipcRenderer: { invoke } }, './TokenService': {}, './dto/GrantTypeEnum': {},
    '../../env': { env: { token_key: 'token' } }, '../../ipc/setAuthorize': {},
    '../../commons/eventBus': { eventBus: { emit() {} } },
    '../../ipc/appEvent': { appEvent: { on: (name, cb) => listeners.set(name, cb) }, AppEvents: { authChanged: 'auth:changed' } },
  };
  const source = fs.readFileSync(new URL('../src/apis/auth/TokenController.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], localStorage, console, Date, Promise });
  return { auth: exports, values, listeners };
}
const token = name => ({ access_token: name, refresh_token: `refresh-${name}`, expires_in: 300 });

test('主进程拒绝旧缓存后，窗口不再恢复旧会话', async () => {
  const actions = [];
  const h = createRenderer(async (_channel, arg) => { actions.push(arg.action); return { token: null }; }, token('old'));
  await h.auth.initToken();
  assert.equal(actions.join(','), 'get,migrate');
  assert.equal(h.auth.getLocalToken(), null);
  assert.equal(h.values.has('token'), false);
});

test('初始化读取期间收到登出事件，迟到的读取结果不能复活旧会话', async () => {
  let finish;
  const h = createRenderer(() => new Promise(resolve => { finish = resolve; }), token('old'));
  const init = h.auth.initToken();
  h.listeners.get('auth:changed')({ args: [null] });
  finish({ token: token('old') });
  await init;
  assert.equal(h.auth.getLocalToken(), null);
  assert.equal(h.values.has('token'), false);
});

test('迁移期间收到新账号事件，迟到的迁移结果不能覆盖新账号', async () => {
  let finish;
  const h = createRenderer((_channel, arg) => arg.action === 'get' ? Promise.resolve({ token: null }) : new Promise(resolve => { finish = resolve; }), token('old'));
  const init = h.auth.initToken();
  await new Promise(resolve => setImmediate(resolve));
  h.listeners.get('auth:changed')({ args: [token('new')] });
  finish({ token: token('old') });
  await init;
  assert.equal(h.auth.getLocalToken().access_token, 'new');
});

test('刷新结果在登出广播之后到达时不得恢复本地会话', async () => {
  let finish;
  const h = createRenderer((_channel, arg) => arg.action === 'get'
    ? Promise.resolve({ token: token('old') })
    : new Promise(resolve => { finish = resolve; }), null);
  await h.auth.initToken();
  const pending = h.auth.refreshToken();
  h.listeners.get('auth:changed')({ args: [null] });
  finish({ success: true, token: token('refreshed') });
  await assert.rejects(pending, /auth_session_changed/);
  assert.equal(h.auth.getLocalToken(), null);
});

test('收到本次刷新广播后允许同一刷新结果完成', async () => {
  let finish;
  const h = createRenderer((_channel, arg) => arg.action === 'get'
    ? Promise.resolve({ token: token('old') })
    : new Promise(resolve => { finish = resolve; }), null);
  await h.auth.initToken();
  const pending = h.auth.refreshToken();
  h.listeners.get('auth:changed')({ args: [token('refreshed')] });
  finish({ success: true, token: token('refreshed') });
  assert.equal((await pending).access_token, 'refreshed');
});
