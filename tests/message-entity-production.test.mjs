import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as vue from 'vue';

const source = fs.readFileSync(new URL('../src/composables/useMessageEntity.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exports = {};
vm.runInNewContext(js, { exports, require: name => name === 'vue' ? { ...vue, onUnmounted() {} } : {
  formatMessageTime: value => value.toISOString(), getSenderNameForMessage: value => value?.senderName,
}, setInterval: () => 1, clearInterval() {}, Date });

test('虚拟列表复用消息行时，替换对象后撤回和发送状态跟随新对象', () => {
  const entity = vue.ref({ senderName: 'first', isRollbacked: false, state: 2 });
  const view = exports.useMessageEntity(entity);
  assert.equal(view.isRollbacked.value, false);
  entity.value = { senderName: 'second', isRollbacked: true, state: 1 };
  assert.equal(view.isRollbacked.value, true);
  assert.equal(view.senderName.value, 'second');
  assert.equal(view.state.value, 1);
});
