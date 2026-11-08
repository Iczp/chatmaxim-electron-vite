import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/commons/mergeMessages.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(js, { exports });
const { mergeMessages } = exports;

test('服务器回执按客户端消息 ID 合并并保留虚拟列表键', () => {
  const rows = mergeMessages([{ clientMessageId: 'c1', scrollerKey: 'a-1', autoId: 1, state: 2 }],
    [{ id: 42, clientMessageId: 'c1', scrollerKey: 'm-42', state: 1 }], 'append');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, 42);
  assert.equal(rows[0].scrollerKey, 'a-1');
  assert.equal(rows[0].state, 1);
});

test('推送先到并缺少客户端 ID 时，回执关联并消除两个已有条目', () => {
  const rows = mergeMessages([{ clientMessageId: 'c1', scrollerKey: 'a-1' }, { id: 42, scrollerKey: 'm-42' }],
    [{ id: 42, clientMessageId: 'c1', state: 1 }], 'append');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].scrollerKey, 'a-1');
  assert.equal(rows[0].id, 42);
});

test('历史分页保持顺序且重叠条目更新而不重复', () => {
  const rows = mergeMessages([{ id: 2, scrollerKey: 'm-2' }, { id: 3, scrollerKey: 'm-3' }],
    [{ id: 1, scrollerKey: 'm-1' }, { id: 2, scrollerKey: 'new', isReaded: true }], 'prepend');
  assert.equal(Array.from(rows, r => r.id).join(','), '1,2,3');
  assert.equal(rows[1].scrollerKey, 'm-2');
  assert.equal(rows[1].isReaded, true);
});

test('重复增量和失败消息不因首屏加载丢失', () => {
  const failed = { clientMessageId: 'failed', scrollerKey: 'a-1', state: 4 };
  const server = { id: 12, scrollerKey: 'm-12' };
  const rows = mergeMessages([failed], [server, server], 'append');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].state, 4);
  assert.equal(rows[1].id, 12);
});
