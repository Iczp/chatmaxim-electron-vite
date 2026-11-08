import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function createBridge(windowName) {
  const watchers = [];
  const subscriptions = new Map();
  const emitted = [];
  const refs = { state: { value: 'disconnected' }, connectionId: { value: null }, netDelay: { value: null }, lastError: { value: null } };
  const realtime = { state: 'disconnected', setStatus(value) { Object.assign(this, value); }, setPresenceFromApi() {}, setMyDevices() {} };
  let badgeRefreshes = 0;
  const dependencies = {
    vue: { watch: (sources, callback, options) => { watchers.push({ sources, callback, options }); } },
    '../apis/v2': { apiV2: { presence: { onlineFriends: async () => ({ items: [] }), myDevices: async () => ({ items: [] }) } } },
    '../apis/auth/TokenController': { clearSession: async () => {} },
    '../commons/eventBus': { eventBus: { emit: (...args) => emitted.push(args) } },
    '../stores/imStore': { useImStore: () => ({ getBadgeByCurrentUser: () => badgeRefreshes++ }) },
    '../stores/realtimeStore': { useRealtimeStore: () => realtime },
    '../stores/windowStore': { useWindowStore: () => ({ name: windowName }) },
    '../ipc/appEvent': { appEvent: { on: (name, fn) => subscriptions.set(name, fn), broadcast: async () => {} },
      AppEvents: { realtimeEvent: 'event', realtimeStatus: 'status', sessionUpdated: 'session' } },
    './signalrClient': { signalRClient: refs },
    './commands': {},
  };
  const source = fs.readFileSync(new URL('../src/realtime/realtimeHub.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => dependencies[name], console, setTimeout, clearTimeout, Date, Promise });
  return { exports, watchers, subscriptions, emitted, realtime, get badges() { return badgeRefreshes; } };
}

test('主窗口重复安装不增加状态监听，连接恢复触发页面和角标刷新', () => {
  const h = createBridge('main');
  h.exports.installRealtimeBridge();
  h.exports.installRealtimeBridge();
  assert.equal(h.watchers.length, 2);
  h.watchers[1].callback('connected', 'reconnecting');
  assert.equal(h.emitted.filter(e => e[0] === 'connected').length, 1);
  assert.equal(h.badges, 1);
  h.watchers[1].callback('connected', 'connected');
  assert.equal(h.badges, 1);
});

test('子窗口只在跨到连接成功状态时触发同步', () => {
  const h = createBridge('chat-1');
  h.exports.installRealtimeBridge();
  const status = h.subscriptions.get('status');
  status({ args: [{ state: 'connected' }] });
  status({ args: [{ state: 'connected', netDelay: 4 }] });
  status({ args: [{ state: 'reconnecting' }] });
  status({ args: [{ state: 'connected' }] });
  assert.equal(h.emitted.filter(e => e[0] === 'connected').length, 2);
});
