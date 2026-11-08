import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function compile(path, dependencies) {
  const source = fs.readFileSync(new URL(path, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => dependencies[name], console, setTimeout: () => 1, clearTimeout() {}, Date, Promise });
  return exports;
}
test('撤回和删除 SignalR 事件通知活跃聊天执行变更同步', async () => {
  const commands = compile('../src/realtime/commands.ts', {});
  const events = [];
  const store = { getSessionUnit: () => undefined, setMaxMessageId() {}, incrementBadge() {}, getBadgeByCurrentUser() {} };
  const deps = {
    vue: {}, '../apis/v2': {}, '../apis/auth/TokenController': {},
    '../commons/eventBus': { eventBus: { emit: (...args) => events.push(args) } },
    '../stores/imStore': { useImStore: () => store }, '../stores/realtimeStore': {}, '../stores/windowStore': {},
    '../ipc/appEvent': {}, './signalrClient': {}, './commands': commands, './sessionRefreshQueue': { SessionRefreshQueue: class { schedule() {} cancelAll() {} } },
  };
  const bridge = compile('../src/realtime/realtimeHub.ts', deps);
  await bridge.dispatchEnvelope({ command: 'rollbacked@message', scopes: [{ sessionUnitId: 'unit' }], payload: { id: 1 } }, false);
  await bridge.dispatchEnvelope({ command: 'deleted@message', scopes: [{ sessionUnitId: 'unit' }], payload: { id: 1 } }, false);
  assert.equal(events.filter(event => event[0] === 'messageMutation').length, 2);
});

test('重复或无消息体的通知只安排权威会话刷新，不直接累加角标', async () => {
  const commands = compile('../src/realtime/commands.ts', {});
  const events = [];
  const scheduled = [];
  let increments = 0;
  const store = { getSessionUnit: () => undefined, incrementBadge: () => { increments++; }, getBadgeByCurrentUser() {} };
  const deps = {
    vue: {}, '../apis/v2': {}, '../apis/auth/TokenController': {},
    '../commons/eventBus': { eventBus: { emit: (...args) => events.push(args) } },
    '../stores/imStore': { useImStore: () => store }, '../stores/realtimeStore': {}, '../stores/windowStore': {},
    '../ipc/appEvent': {}, './signalrClient': {}, './commands': commands,
    './sessionRefreshQueue': { SessionRefreshQueue: class { schedule(id) { scheduled.push(id); } cancelAll() {} } },
  };
  const bridge = compile('../src/realtime/realtimeHub.ts', deps);
  const event = { command: 'created@message', scopes: [{ sessionUnitId: 'unit', chatObjectId: 7 }], payload: { id: 1 } };
  await bridge.dispatchEnvelope(event, false);
  await bridge.dispatchEnvelope(event, false);
  await bridge.dispatchEnvelope({ ...event, payload: null }, false);
  assert.equal(increments, 0);
  assert.equal(scheduled.join(','), 'unit,unit,unit');
  assert.equal(events.filter(x => x[0] === 'chat').length, 3);
});
