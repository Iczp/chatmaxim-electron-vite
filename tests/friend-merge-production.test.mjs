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
  const result = mergeFriendRaw({ score: 10, sorting: 0, ticks: 10, destination: { name: 'name', avatar: 'image' }, lastMessage: { id: 5, content: 'text' } },
    { score: 8, sorting: 0, ticks: 8, destination: { name: 'new' } });
  assert.equal(result.score, 8);
  assert.equal(result.destination.name, 'new');
  assert.equal(result.destination.avatar, 'image');
  assert.equal(result.lastMessage.id, 5);
});

test('部分或不可解码的排序字段保留本地三元组，完整较低分数可以取消置顶', () => {
  const local = { score: 10000000000500, sorting: 1, ticks: 500 };
  const partial = mergeFriendRaw(local, { score: 600, sorting: 0 });
  assert.equal(partial.score, local.score);
  assert.equal(partial.sorting, 1);
  assert.equal(partial.ticks, 500);
  const invalid = mergeFriendRaw(local, { score: 600, sorting: 1, ticks: 600 });
  assert.equal(invalid.score, local.score);
  const unpinned = mergeFriendRaw(local, { score: 600, sorting: 0, ticks: 600 });
  assert.equal(unpinned.score, 600);
  assert.equal(unpinned.sorting, 0);
});

test('根据 score 修正落后的 ticks，兼容 PascalCase 并保持原始数据不变', () => {
  const incoming = { Score: 1800, Sorting: 0, Ticks: 1000 };
  const result = mergeFriendRaw({ score: 1900, sorting: 0, ticks: 1900 }, incoming);
  assert.equal(result.score, 1800);
  assert.equal(result.ticks, 1800);
  assert.equal(result.Score, undefined);
  assert.equal(incoming.Ticks, 1000);
});

test('比较字符串形式的大消息 ID 时不丢失精度', () => {
  const result = mergeFriendRaw({ lastMessage: { id: '9007199254740993' }, lastMessageId: '9007199254740993' },
    { lastMessage: { id: '9007199254740992' }, lastMessageId: '9007199254740992' });
  assert.equal(result.lastMessage.id, '9007199254740993');
  assert.equal(result.lastMessageId, '9007199254740993');
});

test('已读到最新消息时不恢复过时未读数，新消息仍保留未读数', () => {
  const local = { publicBadge: 0, readMessageId: '9007199254740993', lastMessage: { id: '9007199254740993' } };
  assert.equal(mergeFriendRaw(local, { lastMessageId: '9007199254740993', publicBadge: 5 }).publicBadge, 0);
  assert.equal(mergeFriendRaw(local, { lastMessageId: '9007199254740994', publicBadge: 1 }).publicBadge, 1);
});

test('旧网络预览不得覆盖较新的本地消息，新预览可以更新', () => {
  const old = { lastMessage: { id: 5 }, lastMessageTime: 'newer' };
  assert.equal(mergeFriendRaw(old, { lastMessage: { id: 4 } }).lastMessage.id, 5);
  assert.equal(mergeFriendRaw(old, { lastMessage: { id: 6 } }).lastMessage.id, 6);
});
