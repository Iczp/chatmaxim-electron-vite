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
    '../ipc/appEvent': {}, './signalrClient': {}, './commands': commands,
  };
  const bridge = compile('../src/realtime/realtimeHub.ts', deps);
  await bridge.dispatchEnvelope({ command: 'rollbacked@message', scopes: [{ sessionUnitId: 'unit' }], payload: { id: 1 } }, false);
  await bridge.dispatchEnvelope({ command: 'deleted@message', scopes: [{ sessionUnitId: 'unit' }], payload: { id: 1 } }, false);
  assert.equal(events.filter(event => event[0] === 'messageMutation').length, 2);
});
