import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function setup() {
  const channels = [];
  class Channel {
    constructor() { channels.push(this); }
    postMessage(value) { this.sent = value; }
  }
  const source = fs.readFileSync(new URL('../src/data/local/messageInvalidation.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, BroadcastChannel: Channel, Set, Number });
  return { ...exports, channels };
}

test('只分发有效缓存键并释放监听，单个监听异常不影响其他监听', () => {
  const h = setup();
  const seen = [];
  h.onMessageChanged(() => { throw new Error('listener'); });
  const unsubscribe = h.onMessageChanged(value => seen.push(value.clientMessageId));
  const event = { ownerId: 1, sessionUnitId: 's', sessionVersion: 2, clientMessageId: 'c' };
  h.notifyMessageChanged(event);
  h.channels[0].onmessage({ data: { ...event, ownerId: -1 } });
  h.channels[0].onmessage({ data: { ...event, clientMessageId: 'd' } });
  unsubscribe();
  h.notifyMessageChanged(event);
  assert.equal(seen.join(','), 'c,d');
  assert.equal(h.channels[0].sent.clientMessageId, 'c');
  assert.equal(Object.keys(h.channels[0].sent).sort().join(','), 'clientMessageId,ownerId,sessionUnitId,sessionVersion');
});
