import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function createClient() {
  const connections = [];
  const timers = [];
  class Connection {
    constructor() { this.state = 'Disconnected'; this.handlers = {}; this.stopCount = 0; this.connectionId = `c${connections.length + 1}`; }
    on(name, cb) { this.handlers[name] = cb; }
    onreconnecting(cb) { this.reconnecting = cb; }
    onreconnected(cb) { this.reconnected = cb; }
    onclose(cb) { this.close = cb; }
    start() { this.state = 'Connecting'; return new Promise((resolve, reject) => {
      this.succeed = () => { this.state = 'Connected'; resolve(); };
      this.fail = error => { this.state = 'Disconnected'; reject(error); };
    }); }
    stop() { this.stopCount++; this.state = 'Disconnected'; return Promise.resolve(); }
    invoke() { return Promise.resolve(); }
  }
  class Builder {
    withUrl() { return this; }
    withAutomaticReconnect() { return this; }
    configureLogging() { return this; }
    build() { const connection = new Connection(); connections.push(connection); return connection; }
  }
  const deps = {
    '@microsoft/signalr': { HubConnectionBuilder: Builder, HubConnectionState: { Connected: 'Connected', Connecting: 'Connecting', Reconnecting: 'Reconnecting' }, HttpTransportType: { WebSockets: 1 }, LogLevel: { Warning: 1 } },
    vue: { ref: value => ({ value }) },
    '../env': { env: { chat_hub_url: 'https://example.test/hub', app_id: 'app', app_name: 'app', device_type: 'desktop', signalr_reconnect_delays: [0], presence_heartbeat_seconds: 10 } },
    '../apis/auth/TokenController': { getToken: async () => ({ access_token: 'token' }) },
    '../stores/windowStore': { useWindowStore: () => ({ machineId: 'device' }) }, '../../package.json': { version: '1' },
  };
  const source = fs.readFileSync(new URL('../src/realtime/signalrClient.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], console, URL, process: { platform: 'win32' }, Date, Promise,
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {}, setInterval: () => 1, clearInterval() {} });
  return { client: exports.signalRClient, connections, timers };
}

test('停止时迟到的连接成功不会复活旧连接', async () => {
  const h = createClient();
  const pending = h.client.start();
  await h.client.stop();
  h.connections[0].succeed();
  await assert.rejects(pending, /signalr_start_cancelled/);
  assert.equal(h.client.state.value, 'disconnected');
  assert.equal(h.client.connectionId.value, null);
  assert.equal(h.connections[0].stopCount, 2);
});

test('旧连接迟到失败和回调不能破坏新连接', async () => {
  const h = createClient();
  const old = h.client.start();
  await h.client.stop();
  const next = h.client.start();
  h.connections[1].succeed();
  await next;
  h.connections[0].fail(new Error('old failure'));
  await assert.rejects(old, /old failure/);
  h.connections[0].reconnected('old');
  h.connections[0].close(new Error('old close'));
  assert.equal(h.client.state.value, 'connected');
  assert.equal(h.client.connectionId.value, 'c2');
  assert.equal(h.timers.length, 0);
});

test('过期连接事件不得转发，当前连接仍正常分发', async () => {
  const h = createClient();
  const seen = [];
  h.client.onMessage(value => seen.push(value.command));
  const first = h.client.start();
  h.connections[0].succeed();
  await first;
  await h.client.stop();
  const next = h.client.start();
  h.connections[1].succeed();
  await next;
  h.connections[0].handlers.ReceivedMessage({ command: 'old' });
  h.connections[1].handlers.ReceivedMessage({ command: 'new' });
  assert.equal(seen.join(','), 'new');
});

test('旧启动任务结束不能清除新任务的单飞锁', async () => {
  const h = createClient();
  const old = h.client.start();
  await h.client.stop();
  const next = h.client.start();
  h.connections[0].fail(new Error('old failure'));
  await assert.rejects(old, /old failure/);
  const concurrent = h.client.start();
  assert.equal(h.connections.length, 2);
  h.connections[1].succeed();
  await Promise.all([next, concurrent]);
  assert.equal(h.client.connectionId.value, 'c2');
});
