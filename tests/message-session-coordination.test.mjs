import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ulid } from 'ulid';

describe('客户端消息与会话列表协调契约', () => {
  it('clientMessageId 严格为 26 个字符，且符合 ULID 规范', () => {
    const id1 = ulid();
    const id2 = ulid();
    assert.equal(id1.length, 26, 'clientMessageId 长度必须严格为 26 字符');
    assert.equal(id2.length, 26, 'clientMessageId 长度必须严格为 26 字符');
    assert.match(id1, /^[0-9A-HJKMNP-TV-Z]{26}$/, '必须符合 Crockford Base32 编码');
    assert.notEqual(id1, id2, '多次生成必须唯一');
  });

  it('会话排序优先按 score 倒序，其次按 sorting 与 lastMessageId', () => {
    const sortSessionItemDto = (a, b) => {
      if (a.score != null && b.score != null && a.score !== b.score) {
        return b.score - a.score;
      }
      if (a.sorting !== b.sorting) {
        return (b.sorting || 0) - (a.sorting || 0);
      }
      if (a.lastMessageId !== b.lastMessageId) {
        return Number(b.lastMessageId || 0) - Number(a.lastMessageId || 0);
      }
      return 0;
    };

    const items = [
      { id: '1', score: 100, sorting: 0, lastMessageId: 10 },
      { id: '2', score: 500, sorting: 0, lastMessageId: 50 },
      { id: '3', score: 300, sorting: 1, lastMessageId: 5 },
      { id: '4', score: 300, sorting: 0, lastMessageId: 99 },
    ];

    const sorted = [...items].sort(sortSessionItemDto);
    assert.deepEqual(
      sorted.map(x => x.id),
      ['2', '3', '4', '1'],
      '排序必须符合 score 倒序以及 sorting 优先规则',
    );
  });

  it('消息去重能有效防止反复追加导致的消息翻倍', () => {
    const deduplicateMessages = (existing, incoming, position) => {
      const seenIds = new Set();
      const result = [];
      const add = msg => {
        const key =
          msg.id != null
            ? `id-${msg.id}`
            : msg.clientMessageId
              ? `c-${msg.clientMessageId}`
              : msg.autoId
                ? `a-${msg.autoId}`
                : null;
        if (key && seenIds.has(key)) return;
        if (key) seenIds.add(key);
        result.push(msg);
      };
      if (position === 'prepend') {
        incoming.forEach(add);
        existing.forEach(add);
      } else {
        existing.forEach(add);
        incoming.forEach(add);
      }
      return result;
    };

    const current = [
      { id: 10, clientMessageId: '01ABC', text: 'hello' },
      { id: 11, clientMessageId: '01DEF', text: 'world' },
    ];
    const incomingAppend = [
      { id: 11, clientMessageId: '01DEF', text: 'world' },
      { id: 12, clientMessageId: '01GHI', text: 'new message' },
    ];

    const appended = deduplicateMessages(current, incomingAppend, 'append');
    assert.equal(appended.length, 3);
    assert.deepEqual(
      appended.map(x => x.id),
      [10, 11, 12],
    );

    const incomingPrepend = [
      { id: 9, clientMessageId: '01HIST', text: 'old message' },
      { id: 10, clientMessageId: '01ABC', text: 'hello' },
    ];
    const prepended = deduplicateMessages(appended, incomingPrepend, 'prepend');
    assert.equal(prepended.length, 4);
    assert.deepEqual(
      prepended.map(x => x.id),
      [9, 10, 11, 12],
    );
  });
});
