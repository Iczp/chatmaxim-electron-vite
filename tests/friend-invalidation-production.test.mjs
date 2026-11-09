import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('好友通知只传缓存键，验证输入并支持取消监听', () => {
  const channels = [];
  class Channel { constructor() { channels.push(this); } postMessage(value) { this.sent = value; } }
  const source = fs.readFileSync(new URL('../src/data/local/friendInvalidation.ts', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, BroadcastChannel: Channel, Number, Array, Set });
  const seen = [];
  exports.onFriendsChanged(() => { throw new Error('listener'); });
  const unsubscribe = exports.onFriendsChanged(event => seen.push(event.ids.join(',')));
  exports.notifyFriendsChanged({ ownerId: 1, sessionVersion: 2, ids: ['a', 'a'], secret: 'never broadcast' });
  channels[0].onmessage({ data: { ownerId: 1, sessionVersion: 2, ids: ['b'], text: 'private' } });
  channels[0].onmessage({ data: { ownerId: -1, sessionVersion: 2, ids: ['invalid'] } });
  unsubscribe();
  exports.notifyFriendsChanged({ ownerId: 1, sessionVersion: 2, ids: ['c'] });
  assert.equal(seen.join(';'), 'a;b');
  assert.equal(Object.keys(channels[0].sent).sort().join(','), 'ids,ownerId,sessionVersion');
});
