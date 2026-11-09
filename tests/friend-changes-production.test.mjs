import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/realtime/friendChangesSync.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exports = {};
vm.runInNewContext(code, { exports, require: () => ({}), Number, Math, Set, JSON, Error, Promise });
const sync = exports.syncFriendChanges;

test('边界重放、分页落库后更新界面，游标失败不推进', async () => {
  const calls = [];
  const actions = [];
  let fail = true;
  const store = { readTicks: async () => 100, apply: async (items, ticks) => {
    actions.push(`save:${ticks}`);
    if (ticks === 102 && fail) throw new Error('transaction');
    return items;
  } };
  const fetch = async query => {
    calls.push(query);
    return query.minTicks === 99
      ? { items: [{ id: 'a', ownerId: 1, ticks: 101 }], extra: { hasMore: true, nextCursor: { cursorScore: 101, cursorId: 'a' } } }
      : { items: [{ id: 'b', ownerId: 1, ticks: 102 }], extra: { hasMore: false, nextCursorTicks: 102 } };
  };
  await assert.rejects(sync(1, store, fetch, items => actions.push(`ui:${items[0].id}`), async () => true), /transaction/);
  assert.equal(actions.join(','), 'save:101,ui:a,save:102');
  fail = false;
  await sync(1, store, fetch, items => actions.push(`ui:${items[0].id}`), async () => true);
  assert.equal(calls[0].minTicks, 99);
  assert.equal(calls[1].cursorId, 'a');
  assert.equal(calls[2].minTicks, 99);
  assert.equal(actions.slice(-2).join(','), 'save:102,ui:b');
});

test('分页不推进、错误身份或空页仍有后续时禁止提交', async () => {
  for (const page of [
    { items: [{ id: 'a', ticks: 101 }], extra: { hasMore: true } },
    { items: [{ id: 'a', ownerId: 2, ticks: 101 }], extra: { hasMore: false } },
    { items: [], extra: { hasMore: true } },
  ]) {
    let writes = 0;
    await assert.rejects(sync(1, { readTicks: async () => 100, apply: async () => writes++ }, async () => page, () => {}, async () => true));
    assert.equal(writes, 0);
  }
});

test('没有本地基线时不猜增量起点', async () => {
  let requests = 0;
  const result = await sync(1, { readTicks: async () => null, apply: async () => {} }, async () => { requests++; }, () => {}, async () => true);
  assert.equal(result, false);
  assert.equal(requests, 0);
});
