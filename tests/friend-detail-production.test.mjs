import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(file, deps) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], Map, Number, Promise, console });
  return exports;
}
const merge = compile('../src/data/local/friendMerge.ts', {});
function setup({ cached = null, network } = {}) {
  let version = 1;
  let auth;
  const rows = new Map();
  const writes = [];
  const store = { ownerMap: rows, getSessionUnit: id => rows.get(id), setMany: items => items.forEach(item => rows.set(item.id, item)) };
  const deps = {
    vue: { onUnmounted() {} },
    '../apis/v2': { apiV2: { sessions: { friend: network } } },
    '../stores/imStore': { useImStore: () => store },
    '../ipc/appEvent': { appEvent: { on: (_name, handler) => { auth = handler; return () => {}; } }, AppEvents: { authChanged: 'auth' } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => version },
    '../data/local/friendCache': { readFriendScope: async () => ({ accountId: 'a', ownerId: 3, sessionVersion: version }),
      readCachedFriend: async () => cached, saveCachedFriends: async (_scope, items) => writes.push(...items) },
    '../data/local/friendMerge': merge,
  };
  return { service: compile('../src/composables/useFriendDetail.ts', deps).useFriendDetail(3, 'unit'), rows, writes,
    switchAccount: () => { version++; auth({ args: [{ access_token: 'new' }, version] }); } };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('先显示本地好友，随后合并网络详情并写回', async () => {
  let finish;
  const h = setup({ cached: { id: 'unit', ownerId: 3, score: 10, destination: { name: 'local' } },
    network: () => new Promise(resolve => { finish = resolve; }) });
  const task = h.service.load();
  await flush();
  assert.equal(h.rows.get('unit').destination.name, 'local');
  finish({ id: 'unit', ownerId: 3, destination: { code: 'server' } });
  await task;
  assert.equal(h.rows.get('unit').destination.name, 'local');
  assert.equal(h.rows.get('unit').destination.code, 'server');
  assert.equal(h.writes[0].score, 10);
});

test('网络失败或返回错误会话时保留缓存', async () => {
  for (const network of [async () => { throw new Error('offline'); }, async () => ({ id: 'other', ownerId: 3 })]) {
    const h = setup({ cached: { id: 'unit', ownerId: 3, score: 1, destination: { name: 'cached' } }, network });
    await h.service.load();
    assert.equal(h.rows.get('unit').destination.name, 'cached');
    assert.equal(h.writes.length, 0);
  }
});

test('账号切换清除旧好友并丢弃迟到网络响应', async () => {
  let finish;
  const h = setup({ cached: { id: 'unit', ownerId: 3, score: 1 }, network: () => new Promise(resolve => { finish = resolve; }) });
  const task = h.service.load();
  await flush();
  h.switchAccount();
  finish({ id: 'unit', ownerId: 3, score: 2 });
  await task;
  assert.equal(h.rows.size, 0);
  assert.equal(h.writes.length, 0);
});

test('会话资料接口的旧响应不会写入新账号', async () => {
  let version = 1;
  let auth;
  let finish;
  const deps = {
    vue: { ref: value => ({ value }), onUnmounted() {} },
    '../apis': { SessionUnitService: { getApiChatSessionUnitDetail: () => new Promise(resolve => { finish = resolve; }) } },
    '../ipc/appEvent': { appEvent: { on: (_event, handler) => { auth = handler; return () => {}; } }, AppEvents: { authChanged: 'auth' } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => version },
  };
  const h = compile('../src/composables/useSessionUnitDetail.ts', deps).useSessionUnitDetail({ sessionUnitId: 'unit' });
  const task = h.fetchDetail();
  await flush();
  version = 2;
  auth({ args: [{ access_token: 'new' }, version] });
  finish({ id: 'unit', owner: { name: 'old' } });
  await task;
  assert.equal(h.detail.value, undefined);
});

test('独立窗口优先显示更新后的会话，账号变化后不再回退旧窗口数据', async () => {
  let auth;
  let current;
  const deps = {
    vue: { computed: fn => ({ get value() { return fn(); } }), ref: value => ({ value }), onUnmounted() {} },
    '../commons/utils': {}, '../apis/enums': {},
    '../stores/imStore': { useImStore: () => ({ getSessionUnit: () => current }) },
    '../stores/windowStore': { useWindowStore: () => ({ name: 'child' }) },
    './usePayload': { usePayload: () => ({ value: { sessionUnit: { id: 'unit', title: 'old payload' } } }) },
    '../ipc/appEvent': { appEvent: { on: (_event, handler) => { auth = handler; return () => {}; } }, AppEvents: { authChanged: 'auth' } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => 1 },
    './useRemoteStore': {},
  };
  const entity = compile('../src/composables/useSessionUnit.ts', deps).computedSessionUnitEntity('unit');
  await flush();
  assert.equal(entity.value.title, 'old payload');
  current = { id: 'unit', title: 'updated' };
  assert.equal(entity.value.title, 'updated');
  current = undefined;
  auth({ args: [{ access_token: 'new' }, 2] });
  assert.equal(entity.value, undefined);
});
