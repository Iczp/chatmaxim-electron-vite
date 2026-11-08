import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(path, dependencies) {
  const source = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => dependencies[name], console, setTimeout });
  return exports;
}
const merge = compile('../src/commons/mergeMessages.ts', {});
function createList(api) {
  const listeners = new Map();
  const eventBus = {
    on: (name, fn) => listeners.set(name, fn),
    off: (name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); },
  };
  const deps = {
    vue: { ref: value => ({ value }), onActivated() {}, onDeactivated() {}, onUnmounted() {} },
    '../apis/v2': { apiV2: { messages: api } },
    '../apis/enums': { MessageStateEnums: { Ok: 1 } },
    '../commons/eventBus': { eventBus },
    '../commons/utils': { formatMessage: ({ items }) => items.map(x => ({ ...x, state: 1, scrollerKey: `m-${x.id}` })) },
    '../commons/mergeMessages': merge,
    '../ipc/appEvent': { AppEvents: { authChanged: 'auth' }, appEvent: { on: () => () => {} } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => 1 },
    '../data/local/messageCache': { readMessageScope: async () => null },
    '../realtime/messageMutationSync': { MessageMutationSync: class { applyKnown(rows) { return rows; } sync() { return Promise.resolve(); } } },
  };
  const mod = compile('../src/composables/useMessageList.ts', deps);
  return { list: mod.useMessageList({ sessionUnitId: 'unit', ownerId: 1, maxResultCount: 2 }), listeners };
}

test('断线后 latest 连续翻页直到拉完，保留已获取消息', async () => {
  const calls = [];
  const api = {
    history: async () => ({ items: [{ id: 1 }] }),
    latest: async ({ minMessageId }) => {
      calls.push(minMessageId);
      return { items: minMessageId === 1 ? [{ id: 2 }, { id: 3 }] : [{ id: 4 }] };
    },
  };
  const { list } = createList(api);
  await list.fetchLatest();
  await list.fetchLatest();
  assert.equal(calls.join(','), '1,3');
  assert.equal(Array.from(list.list.value, x => x.id).join(','), '1,2,3,4');
});

test('拉取期间发生新通知时，再次请求以补齐并发变更', async () => {
  let finish;
  const calls = [];
  const api = {
    history: async () => ({ items: [{ id: 1 }] }),
    latest: ({ minMessageId }) => {
      calls.push(minMessageId);
      if (calls.length === 1) return new Promise(resolve => { finish = resolve; });
      return Promise.resolve({ items: [{ id: 3 }] });
    },
  };
  const { list } = createList(api);
  await list.fetchLatest();
  const first = list.fetchLatest();
  await new Promise(resolve => setImmediate(resolve));
  const next = list.fetchLatest();
  finish({ items: [{ id: 2 }] });
  await Promise.all([first, next]);
  assert.equal(calls.join(','), '1,2');
  assert.equal(Array.from(list.list.value, x => x.id).join(','), '1,2,3');
});

test('非推进游标返回错误，已应用的页面保留且允许重试', async () => {
  let stuck = true;
  const api = { history: async () => ({ items: [{ id: 1 }] }),
    latest: async () => ({ items: stuck ? [{ id: 1 }, { id: 1 }] : [] }) };
  const { list } = createList(api);
  await list.fetchLatest();
  await assert.rejects(list.fetchLatest(), /游标未推进/);
  assert.equal(list.list.value.length, 1);
  stuck = false;
  await list.fetchLatest();
});

test('取消订阅只移除本聊天注册的处理器', () => {
  const { list, listeners } = createList({});
  list.onMessage(() => {});
  const handler = listeners.get('chat');
  assert.ok(handler);
  list.offMessage();
  assert.equal(listeners.has('chat'), false);
});
