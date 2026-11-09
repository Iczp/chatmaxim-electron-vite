import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function setup({ initial = [], remote, pages = [], changes, changesStore, readFriend = async () => null } ) {
  let version = 1;
  let listener;
  let resolveRemote;
  let friendEvent;
  const saved = [];
  const store = { ownerMap: new Map(), destinationMap: new Map(), chatObjects: new Map(), messageMap: {}, sessionItemsMap: {}, getSessionUnit(id) { return this.ownerMap.get(id); }, setMany(items) { for (const item of items) this.ownerMap.set(item.id, item); } };
  const api = remote || (() => new Promise(resolve => { resolveRemote = resolve; }));
  const deps = {
    vue: { ref: value => ({ value }), watch() {}, onActivated() {}, onDeactivated() {}, onUnmounted() {} },
    '../apis/v2': { apiV2: { sessions: { friends: api, changes } } },
    '../stores/imStore': { useImStore: () => store },
    '../ipc/appEvent': { AppEvents: { authChanged: 'auth' }, appEvent: { on: (_event, callback) => { listener = callback; return () => {}; } } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => version },
    '../data/local/friendMerge': { mergeFriendRaw: (old, item) => ({ ...old, ...item }) },
    '../data/local/friendInvalidation': { onFriendsChanged: handler => { friendEvent = handler; return () => {}; } },
    '../data/local/friendCache': {
      readFriendScope: async () => ({ accountId: 'account', ownerId: 1, sessionVersion: version }),
      readCachedFriends: async (_scope, _limit, before) => before ? pages : initial,
      readCachedFriend: readFriend,
      isFriendScopeCurrent: async scope => scope.sessionVersion === version,
      saveCachedFriends: async (scope, rows) => { saved.push({ scope, rows }); },
      openFriendChangesStore: async () => changesStore,
    },
  };
  const changesSource = fs.readFileSync(new URL('../src/realtime/friendChangesSync.ts', import.meta.url), 'utf8');
  const changesJs = ts.transpileModule(changesSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const changesExports = {};
  vm.runInNewContext(changesJs, { exports: changesExports, require: name => deps[name], console, Map, Set, Number, Math, JSON, Error, Promise });
  deps['../realtime/friendChangesSync'] = changesExports;
  const source = fs.readFileSync(new URL('../src/composables/useSessionUnitList.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], console, Map, Number, Error, Promise,
    navigator: { locks: { request: (_name, _options, callback) => callback({}) } } });
  return { list: exports.useSessionUnitList({ ownerId: 1, maxResultCount: 2 }), store, saved,
    friendChanged: (ids, extra = {}) => friendEvent({ ownerId: 1, sessionVersion: version, ids, ...extra }),
    resolve: rows => resolveRemote({ items: rows }), refreshToken: () => listener({ args: [{ access_token: 'refreshed' }, version] }), changeAccount: () => { version++; listener({ args: [{ access_token: 'new' }, version] }); } };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('窗口好友通知读取已提交缓存，低于已加载边界的好友不插入当前分页', async () => {
  const data = { a: { id: 'a', ownerId: 1, score: 11, destination: { name: 'updated' } },
    low: { id: 'low', ownerId: 1, score: 1 } };
  const h = setup({ initial: [{ id: 'a', ownerId: 1, score: 10 }, { id: 'b', ownerId: 1, score: 5 }],
    remote: async () => ({ items: [{ id: 'a', ownerId: 1, score: 10 }, { id: 'b', ownerId: 1, score: 5 }] }),
    readFriend: async (_scope, id) => data[id] });
  await h.list.fetchLatest();
  h.friendChanged(['a', 'low']);
  await flush();
  assert.equal(h.store.ownerMap.get('a').destination.name, 'updated');
  assert.equal(h.list.list.value.map(x => x.id).join(','), 'a,b');
});

test('切换账号后迟到的好友通知不能更新列表', async () => {
  let finish;
  const h = setup({ initial: [{ id: 'a', ownerId: 1, score: 1 }], remote: async () => ({ items: [] }),
    readFriend: () => new Promise(resolve => { finish = resolve; }) });
  await h.list.fetchLatest();
  h.friendChanged(['a']);
  await flush();
  h.changeAccount();
  finish({ id: 'a', ownerId: 1, score: 2 });
  await flush();
  assert.equal(h.list.list.value.length, 0);
});

test('较早的好友缓存读取迟到时不能覆盖较新的窗口通知', async () => {
  let finish;
  let reads = 0;
  const h = setup({ initial: [{ id: 'a', ownerId: 1, score: 1 }], remote: async () => ({ items: [] }),
    readFriend: () => ++reads === 1 ? new Promise(resolve => { finish = resolve; })
      : Promise.resolve({ id: 'a', ownerId: 1, score: 3, destination: { name: 'new' } }) });
  await h.list.fetchLatest();
  h.friendChanged(['a']);
  await flush();
  h.friendChanged(['a']);
  await flush();
  finish({ id: 'a', ownerId: 1, score: 2, destination: { name: 'old' } });
  await flush();
  assert.equal(h.store.ownerMap.get('a').destination.name, 'new');
});

test('重连刷新使用持久增量并把提交后的好友更新到列表', async () => {
  const calls = [];
  const h = setup({ initial: [{ id: 'old', ownerId: 1, score: 100 }], remote: async () => ({ items: [] }),
    changes: async input => { calls.push(input); return { items: [{ id: 'old', ownerId: 1, ticks: 101, score: 101 }] }; },
    changesStore: { readTicks: async () => 100, apply: async rows => rows.map(row => ({ ...row, destination: { name: 'merged' } })) } });
  await h.list.fetchLatest();
  await h.list.syncChanges();
  assert.equal(calls[0].minTicks, 99);
  assert.equal(h.store.ownerMap.get('old').destination.name, 'merged');
});

test('变更提高末项分数后，分页边界仍指向当前排序的最后一项', async () => {
  const h = setup({ initial: [{ id: 'a', ownerId: 1, score: 10 }, { id: 'b', ownerId: 1, score: 5 }],
    remote: async () => ({ items: [{ id: 'a', ownerId: 1, score: 10 }, { id: 'b', ownerId: 1, score: 5 }] }),
    pages: [{ id: 'c', ownerId: 1, score: 4 }, { id: 'd', ownerId: 1, score: 3 }],
    changes: async () => ({ items: [{ id: 'b', ownerId: 1, score: 11, ticks: 11 }] }),
    changesStore: { readTicks: async () => 10, apply: async rows => rows } });
  await h.list.fetchLatest();
  await h.list.syncChanges();
  assert.equal(h.list.list.value.map(x => x.id).join(','), 'b,a');
  await h.list.fetchHistorical();
  assert.equal(h.list.list.value.map(x => x.id).join(','), 'b,a,c,d');
});

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

test('账号切换后新请求可启动，旧请求结束不清除新加载状态', async () => {
  const calls = [];
  const h = setup({ remote: () => new Promise(resolve => calls.push(resolve)) });
  const old = h.list.fetchLatest();
  await flush();
  h.changeAccount();
  const current = h.list.fetchLatest();
  await flush();
  assert.equal(calls.length, 2);
  calls[0]({ items: [] });
  await assert.rejects(old, /登录状态已变化/);
  assert.equal(h.list.isPendingOfFetchLatest.value, true);
  calls[1]({ items: [] });
  await current;
  assert.equal(h.list.isPendingOfFetchLatest.value, false);
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
