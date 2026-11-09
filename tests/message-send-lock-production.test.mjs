import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/data/local/messageSendLock.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function setup(navigator) {
  const exports = {};
  vm.runInNewContext(code, { exports, navigator, Number, Error, Promise, JSON });
  return exports.acquireMessageSendLock;
}

test('缺少浏览器锁时禁止发送而不是静默失去跨窗口保护', async () => {
  await assert.rejects(setup({})(1, 1, 's', 'c'), /不支持/);
});

test('锁不可用时拒绝，认证代次变化不改变同一消息的锁键', async () => {
  const keys = [];
  const acquire = setup({ locks: { request: async (name, options, callback) => { keys.push([name, options.ifAvailable]); await callback(null); } } });
  await assert.rejects(acquire(1, 2, 's', 'c'), /其他窗口/);
  await assert.rejects(acquire(2, 2, 's', 'c'), /其他窗口/);
  assert.equal(keys[0][0], keys[1][0]);
  assert.equal(keys[0][1], true);
});
