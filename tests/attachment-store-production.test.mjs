import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { webcrypto } from 'node:crypto';
import { TextEncoder } from 'node:util';

function setup({ current = true, storage = {} } = {}) {
  const source = fs.readFileSync(new URL('../src/data/local/attachmentStore.ts', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: () => ({ isFriendScopeCurrent: async () => current }),
    navigator: { storage }, crypto: webcrypto, TextEncoder, Uint8Array, Number, Error, DOMException });
  return exports;
}
const scope = { accountId: 'account', ownerId: 1, sessionVersion: 1 };

test('私有文件系统不可用时明确失败，不假装附件已持久化', async () => {
  const store = setup();
  await assert.rejects(store.savePendingAttachment(scope, 'unit', 'message', {
    name: 'a.txt', type: 'text/plain', size: 1, lastModified: 1, stream() {},
  }), /不支持/);
});

test('认证会话变化时不读取或删除旧附件', async () => {
  let calls = 0;
  const store = setup({ current: false, storage: { getDirectory: async () => { calls++; } } });
  await assert.rejects(store.readPendingAttachment(scope, 'unit', 'message', {}), /登录状态已变化/);
  await assert.rejects(store.deletePendingAttachment(scope, 'unit', 'message'), /登录状态已变化/);
  assert.equal(calls, 0);
});
