import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function compile(path, deps) {
  const source = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], console, Map, Number, Math, Error, Promise, Infinity });
  return exports;
}
const merge = compile('../src/commons/mergeMessages.ts', {});
function setup({ local = [], pending = [], older = [], history, latest, complete = false, readClient = async () => null, prependHistory } = {}) {
  let version = 1;
  let authHandler;
  let changeHandler;
  const writes = [];
  const reads = [];
  const marks = [];
  const api = { history: history || (async () => ({ items: [] })), latest: latest || (async () => ({ items: [] })) };
  const scope = () => ({ accountId: 'a', ownerId: 1, sessionVersion: version });
  const deps = {
    vue: { ref: value => ({ value }), onActivated() {}, onDeactivated() {}, onUnmounted() {} },
    '../apis/v2': { apiV2: { messages: api } }, '../apis/enums': { MessageStateEnums: { Ok: 1 } },
    '../commons/eventBus': { eventBus: { on() {}, off() {} } },
    '../commons/utils': { formatMessage: ({ items }) => items.map(item => ({ ...item, state: 1, scrollerKey: `m-${item.id}` })) },
    '../commons/mergeMessages': merge,
    '../realtime/messageMutationSync': { MessageMutationSync: class { applyKnown(rows) { return rows; } sync() { return Promise.resolve(); } } },
    '../ipc/appEvent': { AppEvents: { authChanged: 'auth' }, appEvent: { on: (_name, callback) => { authHandler = callback; return () => {}; } } },
    '../data/local/localAccount': { readAuthenticatedSessionVersion: async () => version },
    '../data/local/messageInvalidation': { onMessageChanged: handler => { changeHandler = handler; return () => {}; }, notifyMessageChanged() {} },
    '../data/local/messageCache': {
      readMessageScope: async () => scope(), isMessageScopeCurrent: async value => value.sessionVersion === version,
      readCachedMessages: async (_scope, _unit, limit, before) => { reads.push({ limit, before }); return before ? older : local; },
      readPendingMessages: async () => pending,
      readCachedMessageByClientId: readClient,
      saveCachedMessages: async (_scope, _unit, rows) => writes.push(rows),
      readCachedMessagesByIds: async (_scope, _unit, ids) => writes.flat().filter(row => ids.includes(row.id)),
      openMutationStore: async () => null,
      readHistoryComplete: async () => complete,
      markHistoryComplete: async () => { marks.push(true); },
    },
  };
  const mod = compile('../src/composables/useMessageList.ts', deps);
  return { list: mod.useMessageList({ ownerId: 1, sessionUnitId: 'unit', maxResultCount: 20, prependHistory }), writes, reads, marks,
    change: (clientMessageId, extra = {}) => changeHandler({ ownerId: 1, sessionUnitId: 'unit', sessionVersion: version, clientMessageId, ...extra }),
    switchAccount: () => { version++; authHandler({ args: [{ access_token: 'new' }, version] }); } };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('本地和网络历史分别插入，分别捕获滚动锚点', async () => {
  let finish;
  let anchors = 0;
  const h = setup({ local: [{ id: 10 }], older: [{ id: 8 }, { id: 9 }],
    latest: async () => ({ items: [] }), history: () => new Promise(resolve => { finish = resolve; }),
    prependHistory: async apply => { anchors++; apply(); } });
  await h.list.fetchLatest();
  const task = h.list.fetchHistorical();
  await flush();
  assert.equal(anchors, 1);
  assert.equal(h.list.list.value.map(x => x.id).join(','), '8,9,10');
  finish({ items: [{ id: 7 }] });
  await task;
  assert.equal(anchors, 2);
  assert.equal(h.list.list.value.map(x => x.id).join(','), '7,8,9,10');
});

test('窗口通知从本地库恢复确认消息并忽略其他会话', async () => {
  let reads = 0;
  const h = setup({ pending: [{ clientMessageId: 'c', state: 4 }], readClient: async () => { reads++; return { id: 9, clientMessageId: 'c', state: 1 }; } });
  await h.list.fetchLatest();
  h.change('c', { sessionUnitId: 'other' });
  h.change('c');
  await flush();
  assert.equal(reads, 1);
  assert.equal(h.list.list.value.length, 1);
  assert.equal(h.list.list.value[0].id, 9);
});

test('较早的缓存读取迟到时不能覆盖较新通知', async () => {
  let finish;
  let reads = 0;
  const h = setup({ pending: [{ clientMessageId: 'c', state: 4 }], readClient: () => ++reads === 1
    ? new Promise(resolve => { finish = resolve; }) : Promise.resolve({ id: 9, clientMessageId: 'c', state: 1 }) });
  await h.list.fetchLatest();
  h.change('c');
  await flush();
  h.change('c');
  await flush();
  finish({ clientMessageId: 'c', state: 4 });
  await flush();
  assert.equal(h.list.list.value[0].id, 9);
});

test('删除待发送记录后移除旧窗口中的副本', async () => {
  const h = setup({ pending: [{ clientMessageId: 'c', state: 4 }] });
  await h.list.fetchLatest();
  h.change('c');
  await flush();
  assert.equal(h.list.list.value.length, 0);
});

test('账号切换后丢弃迟到的窗口缓存读取', async () => {
  let finish;
  const h = setup({ pending: [{ clientMessageId: 'c', state: 4 }], readClient: () => new Promise(resolve => { finish = resolve; }) });
  await h.list.fetchLatest();
  h.change('c');
  await flush();
  h.switchAccount();
  finish({ id: 9, clientMessageId: 'c', state: 1 });
  await flush();
  assert.equal(h.list.list.value.length, 0);
});

test('首屏恢复未确认消息，同时保持服务端分页游标', async () => {
  const h = setup({ local: [{ id: 5 }], pending: [{ clientMessageId: 'pending', state: 4 }], latest: async () => ({ items: [] }) });
  await h.list.fetchLatest();
  assert.equal(h.list.list.value.map(x => x.id || x.clientMessageId).join(','), '5,pending');
  assert.equal(h.list.maxMessageId.value, 5);
});

test('本地最近 10 条先显示，随后按本地最大 ID 在线补齐', async () => {
  let finish;
  const calls = [];
  const h = setup({ local: [{ id: 4 }, { id: 5 }], latest: input => { calls.push(input); return new Promise(resolve => { finish = resolve; }); } });
  const pending = h.list.fetchLatest();
  await flush();
  assert.equal(h.reads[0].limit, 10);
  assert.equal(Array.from(h.list.list.value, x => x.id).join(','), '4,5');
  assert.equal(calls[0].minMessageId, 5);
  finish({ items: [{ id: 6 }] });
  await pending;
  assert.equal(Array.from(h.list.list.value, x => x.id).join(','), '4,5,6');
  assert.equal(h.writes[0][0].id, 6);
});

test('断网首屏保留本地消息，不误标历史结束', async () => {
  const h = setup({ local: [{ id: 4 }], latest: async () => { throw new Error('offline'); } });
  const result = await h.list.fetchLatest();
  assert.equal(result.items[0].id, 4);
  assert.equal(h.list.isBof.value, false);
  assert.equal(h.marks.length, 0);
});

test('历史页优先读取本地 30 条，本地满页不请求网络', async () => {
  let calls = 0;
  const older = Array.from({ length: 30 }, (_, n) => ({ id: n + 1 }));
  const h = setup({ local: [{ id: 40 }], older, latest: async () => ({ items: [] }), history: async () => { calls++; return { items: [] }; } });
  await h.list.fetchLatest();
  await h.list.fetchHistorical();
  assert.equal(h.reads[1].limit, 30);
  assert.equal(h.reads[1].before.score, 40);
  assert.equal(calls, 0);
  assert.equal(h.list.list.value.length, 31);
});

test('本地历史不足时只补齐剩余数量并在网络到头后标记', async () => {
  const queries = [];
  const h = setup({ local: [{ id: 40 }], older: [{ id: 38 }, { id: 39 }], latest: async () => ({ items: [] }),
    history: async query => { queries.push(query); return { items: [{ id: 37 }] }; } });
  await h.list.fetchLatest();
  await h.list.fetchHistorical();
  assert.equal(queries[0].maxResultCount, 28);
  assert.equal(queries[0].maxMessageId, 38);
  assert.equal(h.list.isBof.value, true);
  assert.equal(h.marks.length, 1);
});

test('账号切换清空本地消息，迟到的旧网络结果不能写回', async () => {
  let finish;
  const h = setup({ local: [{ id: 1 }], latest: () => new Promise(resolve => { finish = resolve; }) });
  const pending = h.list.fetchLatest();
  await flush();
  h.switchAccount();
  assert.equal(h.list.list.value.length, 0);
  finish({ items: [{ id: 2 }] });
  await assert.rejects(pending, /登录状态已变化/);
  assert.equal(h.list.list.value.length, 0);
  assert.equal(h.writes.length, 0);
});

test('无法安全表示的服务器消息 ID 不写入本地或推进游标', async () => {
  const h = setup({ local: [{ id: 1 }], latest: async () => ({ items: [{ id: '9007199254740993' }] }) });
  // 本地数据仍可展示；错误响应不能写入或改变已加载的消息。
  await h.list.fetchLatest();
  assert.equal(h.list.maxMessageId.value, 1);
  assert.equal(h.list.list.value.length, 1);
  assert.equal(h.writes.length, 0);
});
