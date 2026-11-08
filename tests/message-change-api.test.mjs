import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const calls = [];
const dependencies = {
  '../core/OpenAPI': { OpenAPI: {} },
  '../core/request': { request: (_config, options) => { calls.push(options); return options; } },
  '../../env': { env: {} },
};
const source = fs.readFileSync(new URL('../src/apis/v2/index.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(js, { exports, require: name => dependencies[name], URLSearchParams });

test('消息变更发送参考客户端使用的会话游标和快照游标', () => {
  exports.messagesV2.changes({ sessions: [{ sessionUnitId: 'unit', cursor: 'cursor', snapshotCursor: 'snapshot' }] });
  const call = calls.at(-1);
  assert.equal(call.method, 'POST');
  assert.equal(call.url, '/api/chat/message/changes/query');
  assert.equal(call.body.maxResultCount, 200);
  assert.equal(call.body.sessions[0].cursor, 'cursor');
  assert.equal(call.body.sessions[0].snapshotCursor, 'snapshot');
});

test('消息状态校准使用会话 ID 和消息 ID 列表', () => {
  exports.messagesV2.syncItems({ sessionUnitId: 'unit', messageIds: [1, 2] });
  const call = calls.at(-1);
  assert.equal(call.method, 'POST');
  assert.equal(call.url, '/api/chat/message/sync-items');
  assert.equal(call.body.sessionUnitId, 'unit');
  assert.deepEqual(Array.from(call.body.messageIds), [1, 2]);
});

