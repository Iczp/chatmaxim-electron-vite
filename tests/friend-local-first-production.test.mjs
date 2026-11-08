import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function setup({ initial = [], remote, pages = [] }) {
  let version = 1;
  let listener;
  let resolveRemote;
  const saved = [];
  const store = { ownerMap: new Map(), destinationMap: new Map(), chatObjects: new Map(), messageMap: {}, sessionItemsMap: {}, getSessionUnit(id) { return this.ownerMap.get(id); }, setMany(items) { for (const item of items) this.ownerMap.set(item.id, item); } };
  const api = remote || (() => new Promise(resolve => { resolveRemote = resolve; }));
  const deps = {
    vue: { ref: value => ({ value }), watch() {}, onActivated() {}, onDeactivated() {}, onUnmounted() {} },
    '../apis/v2': { apiV2: { sessions: { friends: api } } },
    '../stores/imStore': { useImStore: () => store },
    '../ipc/appEvent': { AppEvents: { authChanged: 'auth' }, appEvent: { on: (_event, callback) => { listener = callback; return () => {}; } } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => version },
    '../data/local/friendMerge': { mergeFriendRaw: (old, item) => ({ ...old, ...item }) },
    '../data/local/friendCache': {
      readFriendScope: async () => ({ accountId: 'account', ownerId: 1, sessionVersion: version }),
      readCachedFriends: async (_scope, _limit, before) => before ? pages : initial,
      isFriendScopeCurrent: async scope => scope.sessionVersion === version,
      saveCachedFriends: async (scope, rows) => { saved.push({ scope, rows }); },
    },
  };
  const source = fs.readFileSync(new URL('../src/composables/useSessionUnitList.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], console, Map, Number, Error, Promise });
  return { list: exports.useSessionUnitList({ ownerId: 1, maxResultCount: 2 }), store, saved,
    resolve: rows => resolveRemote({ items: rows }), refreshToken: () => listener({ args: [{ access_token: 'refreshed' }, version] }), changeAccount: () => { version++; listener({ args: [{ access_token: 'new' }, version] }); } };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('本地好友先进入真实 store，网络响应后更新并写入缓存', async () => {
  const h = setup({ initial: [{ id: 'old', ownerId: 1, score: 1 }] });
  const pending = h.list.fetchLatest();
  await flush();
  assert.equal(h.list.list.value[0].id, 'old');
  assert.equal(h.store.ownerMap.has('old'), true);
  h.resolve([{ id: 'new', ownerId: 1, score: 2 }]);
  await pending; await flush();
  assert.equal(h.list.list.value[0].id, 'new');
  assert.equal(h.saved[0].rows[0].id, 'new');
});

test('断网时保留本地好友且不误判已经加载全部', async () => {
  const h = setup({ initial: [{ id: 'old', ownerId: 1, score: 1 }], remote: async () => { throw new Error('offline'); } });
  const result = await h.list.fetchLatest();
  assert.equal(result.items[0].id, 'old');
  assert.equal(h.list.isBof.value, false);
});

test('好友分页优先读取本地完整页', async () => {
  let requests = 0;
  const h = setup({ initial: [{ id: 'a', ownerId: 1, score: 3 }, { id: 'b', ownerId: 1, score: 2 }],
    pages: [{ id: 'c', ownerId: 1, score: 1 }, { id: 'd', ownerId: 1, score: 0 }],
    remote: async () => { requests++; return { items: [{ id: 'a', ownerId: 1, score: 3 }, { id: 'b', ownerId: 1, score: 2 }] }; } });
  await h.list.fetchLatest();
  await h.list.fetchHistorical();
  assert.equal(requests, 1);
  assert.equal(Array.from(h.list.list.value, x => x.id).join(','), 'a,b,c,d');
});

test('账号切换立即清除旧列表，旧请求晚到不得恢复旧数据', async () => {
  const h = setup({ initial: [{ id: 'old', ownerId: 1, score: 1 }] });
  const pending = h.list.fetchLatest();
  await flush();
  h.changeAccount();
  assert.equal(h.list.list.value.length, 0);
  assert.equal(h.store.ownerMap.size, 0);
  h.resolve([{ id: 'old-remote', ownerId: 1, score: 2 }]);
  await assert.rejects(pending, /登录状态已变化/);
  assert.equal(h.list.list.value.length, 0);
  assert.equal(h.saved.length, 0);
});


test('同一会话的令牌刷新不清除本地好友', async () => {
  const h = setup({ initial: [{ id: 'old', ownerId: 1, score: 1 }], remote: async () => { throw new Error('offline'); } });
  await h.list.fetchLatest();
  h.refreshToken();
  assert.equal(h.list.list.value[0].id, 'old');
});

test('本地不足一页时仅从网络补足剩余数量', async () => {
  const requested = [];
  const h = setup({ initial: [{ id: 'a', ownerId: 1, score: 4 }, { id: 'b', ownerId: 1, score: 3 }],
    pages: [{ id: 'c', ownerId: 1, score: 2 }],
    remote: async input => {
      requested.push(input.maxResultCount);
      return { items: requested.length === 1
        ? [{ id: 'a', ownerId: 1, score: 4 }, { id: 'b', ownerId: 1, score: 3 }]
        : [{ id: 'd', ownerId: 1, score: 1 }] };
    } });
  await h.list.fetchLatest();
  const page = await h.list.fetchHistorical();
  assert.equal(requested.join(','), '2,1');
  assert.equal(page.items.length, 2);
  assert.equal(h.list.isBof.value, false);
});
