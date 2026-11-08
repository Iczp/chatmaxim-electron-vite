import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function loadQueue() {
  const timers = new Map();
  let serial = 0;
  const source = fs.readFileSync(new URL('../src/realtime/sessionRefreshQueue.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, Map, Promise, setTimeout: fn => { const id = ++serial; timers.set(id, fn); return id; }, clearTimeout: id => timers.delete(id) });
  return { Queue: exports.SessionRefreshQueue, runTimers: () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); }, timers };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('相同会话的通知合并，并丢弃请求期间已过时的结果', async () => {
  const h = loadQueue();
  const requests = [];
  const applied = [];
  const queue = new h.Queue(async (id, current) => {
    const value = await new Promise(resolve => requests.push(resolve));
    if (current()) applied.push(`${id}:${value}`);
  }, error => { throw error; });
  queue.schedule('a'); queue.schedule('a');
  assert.equal(h.timers.size, 1);
  h.runTimers();
  assert.equal(requests.length, 1);
  queue.schedule('a');
  requests[0]('old');
  await flush();
  assert.equal(requests.length, 2);
  requests[1]('new');
  await flush();
  assert.equal(applied.join(','), 'a:new');
});

test('停止后迟到的会话响应不得更新状态，后续新会话仍可刷新', async () => {
  const h = loadQueue();
  const requests = [];
  const applied = [];
  const queue = new h.Queue(async (id, current) => {
    const value = await new Promise(resolve => requests.push(resolve));
    if (current()) applied.push(`${id}:${value}`);
  }, error => { throw error; });
  queue.schedule('a'); h.runTimers();
  queue.cancelAll();
  queue.schedule('a'); h.runTimers();
  requests[0]('old'); requests[1]('new');
  await flush();
  assert.equal(applied.join(','), 'a:new');
});

test('失败后允许后续事件再次触发刷新', async () => {
  const h = loadQueue();
  let attempts = 0;
  const errors = [];
  const queue = new h.Queue(async () => { attempts++; if (attempts === 1) throw new Error('offline'); }, error => errors.push(error));
  queue.schedule('a'); h.runTimers(); await flush();
  queue.schedule('a'); h.runTimers(); await flush();
  assert.equal(attempts, 2);
  assert.equal(errors.length, 1);
});
