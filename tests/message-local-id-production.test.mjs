import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function createStore() {
  const deps = {
    pinia: { defineStore: (_id, options) => options },
    '../apis': {}, '../apis/v2': {}, '../commons/utils': {}, '../commons/setTray': {}, vue: {},
  };
  const source = fs.readFileSync(new URL('../src/stores/imStore.ts', import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: name => deps[name], Map, Number, Math, console });
  const options = exports.useImStore;
  return Object.assign(options.state(), options.actions);
}

test('无消息的会话不能污染最大 ID，刷新不能重置本地临时 ID', () => {
  const store = createStore();
  store.setMaxMessageId(NaN);
  assert.equal(store.maxMessageId, undefined);
  assert.equal(store.generateMessageId(), -1);
  store.setMaxMessageId(123);
  assert.equal(store.generateMessageId(), -2);
  store.setMaxMessageId(123);
  assert.equal(store.generateMessageId(), -3);
  assert.equal(store.maxMessageId, 123);
});

test('大服务器 ID 和本地待发送消息的 ID 不冲突', () => {
  const store = createStore();
  store.setMaxMessageId(9000000000000000);
  const ids = Array.from({ length: 100 }, () => store.generateMessageId());
  assert.equal(new Set(ids).size, 100);
  assert.equal(ids.every(id => id < 0 && Number.isSafeInteger(id)), true);
});
