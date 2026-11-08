import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/realtime/messageMutationSync.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exports = {};
vm.runInNewContext(js, { exports, BigInt, Set, Map, Number, Error, Promise });
const { MessageMutationSync } = exports;
const page = (next, items = [], extra = {}) => ({ sessionUnitId: 'unit', nextCursor: next, items, ...extra });
const deleted = (id, version = '1') => ({ messageId: id, syncVersion: version, changeType: 2, isDeleted: true });
const rollback = (id, version = '1') => ({ messageId: id, syncVersion: version, changeType: 1, isRollbacked: true });
function setup(api, initial = [{ id: 1 }, { id: 2 }]) {
  let rows = initial;
  const sync = new MessageMutationSync('unit', api, () => rows, value => { rows = value; });
  return { sync, rows: () => rows };
}

test('分页同步撤回与删除，并在稍后历史页应用已知变更', async () => {
  const calls = [];
  const h = setup({ changes: async input => {
    calls.push(input.sessions[0]);
    return calls.length === 1
      ? [page('c1', [rollback(1)], { hasMore: true, snapshotCursor: 'snap' })]
      : [page('c2', [deleted(2)])];
  }});
  await h.sync.sync();
  assert.equal(calls[1].cursor, 'c1');
  assert.equal(calls[1].snapshotCursor, 'snap');
  assert.equal(h.rows().length, 1);
  assert.equal(h.rows()[0].isRollbacked, true);
  assert.equal(h.sync.applyKnown([{ id: 2 }]).length, 0);
});

test('未知变更不推进游标，修复响应后可以重试', async () => {
  const cursors = [];
  let invalid = true;
  const h = setup({ changes: async input => {
    cursors.push(input.sessions[0].cursor);
    return [page('next', invalid ? [{ ...deleted(1), changeType: 9 }] : [deleted(1)])];
  }});
  await assert.rejects(h.sync.sync(), /不支持/);
  invalid = false;
  await h.sync.sync();
  assert.equal(cursors[0], null);
  assert.equal(cursors[1], null);
  assert.equal(h.rows().length, 1);
});

test('重置先校准现有消息后从新游标继续，并拒绝非请求消息', async () => {
  let calls = 0;
  let bad = true;
  const seen = [];
  const h = setup({ changes: async input => {
    seen.push(input.sessions[0].cursor);
    calls++;
    return calls <= 2 ? [page('reset', [], { resetRequired: true })] : [page('done')];
  }, syncItems: async () => bad ? [deleted(999)] : [deleted(1)] });
  await assert.rejects(h.sync.sync(), /未请求/);
  bad = false;
  await h.sync.sync();
  assert.equal(seen[1], null);
  assert.equal(seen[2], 'reset');
  assert.equal(h.rows().length, 1);
  assert.equal(h.rows()[0].id, 2);
});

test('重叠同步请求会在首轮完成后再次同步', async () => {
  let finish;
  const calls = [];
  const h = setup({ changes: input => {
    calls.push(input.sessions[0].cursor);
    if (calls.length === 1) return new Promise(resolve => { finish = resolve; });
    return Promise.resolve([page('c2', [deleted(2)])]);
  }});
  const first = h.sync.sync();
  const second = h.sync.sync();
  finish([page('c1', [rollback(1)])]);
  await Promise.all([first, second]);
  assert.equal(calls.length, 2);
  assert.equal(calls[1], 'c1');
  assert.equal(h.rows().length, 1);
  assert.equal(h.rows()[0].isRollbacked, true);
});
