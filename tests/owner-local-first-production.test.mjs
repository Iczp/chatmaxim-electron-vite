import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(file, deps) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], Map, Number, Math, Promise, console });
  return exports;
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('先展示本地身份并恢复选择，然后启动在线刷新', async () => {
  const steps = [];
  const store = { chatObjects: new Map(), badgeItems: [], setChatObjects(items) { steps.push('cache'); this.chatObjects.set(items[0].chatObjectId, items[0]); },
    getChatObjectByCurrentUser() { steps.push('owners'); }, getBadgeByCurrentUser() { steps.push('badge'); } };
  const deps = {
    vue: { computed: fn => ({ get value() { return fn(); } }), onUnmounted() {} },
    '../stores/imStore': { useImStore: () => store },
    '../ipc/appEvent': { appEvent: { on: () => () => {} }, AppEvents: { authChanged: 'auth' } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => 1 },
    '../data/local/ownerCache': { readOwnerScope: async () => ({ accountId: 'a', sessionVersion: 1 }),
      readCachedOwners: async () => ({ owners: [{ id: 7, name: 'cached' }], currentOwnerId: 7 }) },
  };
  const h = compile('../src/composables/useBadges.ts', deps).useBadges();
  const result = await h.ready;
  assert.equal(result.ownerId, 7);
  assert.equal(result.sessionVersion, 1);
  assert.equal(steps.join(','), 'cache,owners,badge');
  assert.equal(store.chatObjects.get(7).owner.name, 'cached');
});

test('账号切换后旧的身份请求不能覆盖新账号，也不能阻塞新请求', async () => {
  let version = 1;
  const tasks = [];
  const deps = {
    pinia: { defineStore: (_id, options) => options },
    '../apis': { ChatObjectService: { getApiChatChatObjectByCurrentUser: () => new Promise(resolve => tasks.push(resolve)) } },
    '../apis/v2': {}, '../commons/utils': {}, '../commons/setTray': {}, vue: {},
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => version },
    '../data/local/ownerCache': { readOwnerScope: async () => null },
  };
  const options = compile('../src/stores/imStore.ts', deps).useImStore;
  const store = Object.assign(options.state(), options.actions);
  store.getChatObjectByCurrentUser();
  await flush();
  version = 2;
  store.getChatObjectByCurrentUser();
  await flush();
  assert.equal(tasks.length, 2);
  tasks[0]({ items: [{ id: 1 }] });
  await flush();
  assert.equal(store.isPendingForGetChatObjectByCurrentUser, true);
  tasks[1]({ items: [{ id: 2 }] });
  await flush();
  assert.equal([...store.chatObjects.keys()].join(','), '2');
  assert.equal(store.isPendingForGetChatObjectByCurrentUser, false);
});

test('退出后迟到的本地身份结果不得重新显示', async () => {
  let version = 1;
  let finish;
  let authHandler;
  const store = { chatObjects: new Map(), badgeItems: [], setChatObjects(items) { items.forEach(x => this.chatObjects.set(x.chatObjectId, x)); },
    getChatObjectByCurrentUser() {}, getBadgeByCurrentUser() {} };
  const deps = {
    vue: { computed: fn => ({ get value() { return fn(); } }), onUnmounted() {} },
    '../stores/imStore': { useImStore: () => store },
    '../ipc/appEvent': { appEvent: { on: (_event, cb) => { authHandler = cb; return () => {}; } }, AppEvents: { authChanged: 'auth' } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => version },
    '../data/local/ownerCache': { readOwnerScope: async () => ({ accountId: 'a', sessionVersion: 1 }),
      readCachedOwners: () => new Promise(resolve => { finish = resolve; }) },
  };
  const h = compile('../src/composables/useBadges.ts', deps).useBadges();
  await flush();
  version = null;
  authHandler({ args: [null, 2] });
  finish({ owners: [{ id: 7 }], currentOwnerId: 7 });
  assert.equal(await h.ready, null);
  assert.equal(store.chatObjects.size, 0);
});
