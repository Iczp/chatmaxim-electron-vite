import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function setup({ invoke, getToken, userInfo }) {
  const dependencies = {
    electron: { ipcRenderer: { invoke } },
    '../../apis/auth/TokenController': { getToken },
    '../../apis/v2': { authV2: { userInfo } },
    '../../env': { env: { auth_host: 'https://auth.test' } },
  };
  const source = fs.readFileSync(new URL('../src/data/local/localAccount.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => dependencies[name], Promise, JSON, Error });
  return exports.resolveLocalAccountId;
}

test('已绑定账号时离线使用主进程标识，不调用网络', async () => {
  const resolve = setup({ invoke: async () => ({ token: { access_token: 'x' }, accountId: JSON.stringify(['https://auth.test', 'bound']), sessionVersion: 1 }),
    getToken: () => { throw new Error('unexpected refresh'); }, userInfo: () => { throw new Error('unexpected request'); } });
  assert.equal(await resolve(), JSON.stringify(['https://auth.test', 'bound']));
});

test('首次绑定只能使用 userinfo 的 sub 与当前令牌', async () => {
  const calls = [];
  const resolve = setup({ invoke: async (_channel, arg) => {
    calls.push(arg); return arg.action === 'get' ? { token: { access_token: 'x' }, sessionVersion: 1 } : { success: true };
  }, getToken: async () => ({ access_token: 'x' }), userInfo: async () => ({ sub: 'user-1' }) });
  assert.equal(await resolve(), JSON.stringify(['https://auth.test', 'user-1']));
  assert.equal(calls[2].currentAccessToken, 'x');
  assert.equal(calls[2].sessionVersion, 1);
});

test('用户信息请求期间会话变化时重新查询而不绑定旧账号', async () => {
  const saved = [];
  let attempt = 0;
  const resolve = setup({ invoke: async (_channel, arg) => {
    if (arg.action === 'get') return { token: { access_token: attempt === 2 ? 'new' : 'old' }, sessionVersion: attempt };
    saved.push(arg.accountId); return { success: saved.length === 2 };
  }, getToken: async () => ({ access_token: ++attempt === 1 ? 'old' : 'new' }), userInfo: async () => ({ sub: attempt === 1 ? 'old' : 'new' }) });
  assert.equal(await resolve(), JSON.stringify(['https://auth.test', 'new']));
  assert.equal(saved.length, 2);
});

test('缺少可信用户标识时不绑定', async () => {
  const calls = [];
  const resolve = setup({ invoke: async (_channel, arg) => { calls.push(arg); return { token: { access_token: 'x' }, sessionVersion: 1 }; },
    getToken: async () => ({ access_token: 'x' }), userInfo: async () => ({ name: 'test' }) });
  await assert.rejects(resolve(), /缺少账号标识/);
  assert.equal(calls.length, 2);
});


test('认证服务地址变化时不复用旧服务的账号分区', async () => {
  let called = 0;
  const resolve = setup({ invoke: async (_channel, arg) => arg.action === 'get'
    ? { token: { access_token: 'x' }, accountId: JSON.stringify(['https://old.test', 'user']), sessionVersion: 1 }
    : { success: true }, getToken: async () => ({ access_token: 'x' }),
    userInfo: async () => { called++; return { sub: 'user' }; } });
  assert.equal(await resolve(), JSON.stringify(['https://auth.test', 'user']));
  assert.equal(called, 1);
});
