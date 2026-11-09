import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/views/chat/historyAnchor.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exports = {};
vm.runInNewContext(code, { exports, Array, Promise, getComputedStyle: () => ({ visibility: 'visible' }) });
const preserve = exports.preserveHistoryAnchor;

test('用户在渲染期间滚动后，不再执行旧锚点恢复', async () => {
  let finish;
  let interrupted = false;
  let scrolled = 0;
  const item = { dataset: { messageKey: 'm-1' }, getBoundingClientRect: () => ({ top: 10, bottom: 60, height: 50 }) };
  const element = { isConnected: true, scrollTop: 20, scrollHeight: 1000,
    getBoundingClientRect: () => ({ top: 0, bottom: 300 }), querySelectorAll: () => [item] };
  const task = preserve({ element, scrollToItem: () => { scrolled++; } }, () => [{ scrollerKey: 'm-1' }], () => {},
    () => new Promise(resolve => { finish = resolve; }), () => interrupted);
  interrupted = true;
  element.scrollTop = 120;
  finish();
  await task;
  assert.equal(element.scrollTop, 120);
  assert.equal(scrolled, 0);
});

test('没有活动窗口时仍执行数据更新', async () => {
  let applied = false;
  await preserve(null, () => [], () => { applied = true; }, async () => {}, () => false);
  assert.equal(applied, true);
});
