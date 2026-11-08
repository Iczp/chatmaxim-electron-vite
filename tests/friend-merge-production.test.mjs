import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/data/local/friendMerge.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exports = {};
vm.runInNewContext(js, { exports, Number, Array });
const { mergeFriendRaw } = exports;

test('网络详情省略预览和部分头像资料时保留本地数据', () => {
  const result = mergeFriendRaw({ score: 10, destination: { name: 'name', avatar: 'image' }, lastMessage: { id: 5, content: 'text' } },
    { score: 8, destination: { name: 'new' } });
  assert.equal(result.score, 8);
  assert.equal(result.destination.name, 'new');
  assert.equal(result.destination.avatar, 'image');
  assert.equal(result.lastMessage.id, 5);
});

test('旧网络预览不得覆盖较新的本地消息，新预览可以更新', () => {
  const old = { lastMessage: { id: 5 }, lastMessageTime: 'newer' };
  assert.equal(mergeFriendRaw(old, { lastMessage: { id: 4 } }).lastMessage.id, 5);
  assert.equal(mergeFriendRaw(old, { lastMessage: { id: 6 } }).lastMessage.id, 6);
});
