import { mergeFriendRaw } from './friendMerge';

/** IndexedDB 是 Electron 渲染会话共享的事务存储；调用方不得写入 token 或附件二进制。 */
export type LocalScope = { accountId: string; ownerId: number };
export type LocalOwner = LocalScope & { raw: Record<string, unknown> };
export type LocalFriend = LocalScope & { id: string; score: number; raw: Record<string, unknown> };
export type LocalMessage = LocalScope & {
  sessionUnitId: string;
  localId: string;
  serverId?: number;
  clientMessageId?: string;
  score: number;
  state: string;
  isDeleted?: boolean;
  isRollbacked?: boolean;
  syncVersion?: string;
  raw: Record<string, unknown>;
};
export type MessageMutation = {
  messageId: number;
  syncVersion: string;
  isDeleted?: boolean;
  isRollbacked?: boolean;
  rollbackTime?: string | null;
};
export type LocalPageCursor = { score: number; id: string };

const request = <T>(value: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result);
  value.onerror = () => reject(value.error ?? new Error('本地数据库请求失败'));
});
const complete = (tx: IDBTransaction): Promise<void> => new Promise((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onabort = () => reject(tx.error ?? new Error('本地数据库事务已取消'));
  tx.onerror = () => {};
});
const validateScope = (scope: LocalScope) => {
  if (!scope.accountId?.trim() || !Number.isSafeInteger(scope.ownerId) || scope.ownerId <= 0) {
    throw new Error('本地数据库需要有效的账号和聊天身份');
  }
};
const validateUnit = (unit: string) => { if (!unit?.trim()) throw new Error('本地数据库需要会话 ID'); };
const validateScore = (score: number) => { if (!Number.isSafeInteger(score)) throw new Error('本地数据库排序值无效'); };

export class ImDatabase {
  private constructor(private readonly db: IDBDatabase) {}

  static async open(factory: IDBFactory = indexedDB, name = 'gotoim-local-v1'): Promise<ImDatabase> {
    const open = factory.open(name, 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      db.createObjectStore('owners', { keyPath: ['accountId', 'ownerId'] });
      db.createObjectStore('settings', { keyPath: 'accountId' });
      const friends = db.createObjectStore('friends', { keyPath: ['accountId', 'ownerId', 'id'] });
      friends.createIndex('page', ['accountId', 'ownerId', 'score', 'id']);
      const messages = db.createObjectStore('messages', { keyPath: ['accountId', 'ownerId', 'sessionUnitId', 'localId'] });
      messages.createIndex('page', ['accountId', 'ownerId', 'sessionUnitId', 'score', 'localId']);
      messages.createIndex('server', ['accountId', 'ownerId', 'sessionUnitId', 'serverId'], { unique: true });
      messages.createIndex('client', ['accountId', 'ownerId', 'sessionUnitId', 'clientMessageId'], { unique: true });
      db.createObjectStore('cursors', { keyPath: ['accountId', 'ownerId', 'sessionUnitId'] });
      db.createObjectStore('mutations', { keyPath: ['accountId', 'ownerId', 'sessionUnitId', 'messageId'] });
    };
    const db = await request(open);
    db.onversionchange = () => db.close();
    return new ImDatabase(db);
  }

  close(): void { this.db.close(); }

  async saveOwners(accountId: string, owners: LocalOwner[], currentOwnerId?: number): Promise<void> {
    if (!accountId?.trim()) throw new Error('本地数据库需要有效账号');
    for (const owner of owners) {
      validateScope(owner);
      if (owner.accountId !== accountId) throw new Error('聊天身份账号不匹配');
    }
    if (currentOwnerId != null && (!Number.isSafeInteger(currentOwnerId) || currentOwnerId <= 0)) throw new Error('聊天身份无效');
    const tx = this.db.transaction(['owners', 'settings'], 'readwrite');
    const done = complete(tx);
    try {
      for (const owner of owners) tx.objectStore('owners').put(owner);
      if (currentOwnerId != null) tx.objectStore('settings').put({ accountId, currentOwnerId });
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* 事务可能已经结束 */ }
      await done.catch(() => {});
      throw error;
    }
  }

  async readOwners(accountId: string): Promise<{ owners: LocalOwner[]; currentOwnerId: number | null }> {
    if (!accountId?.trim()) throw new Error('本地数据库需要有效账号');
    const tx = this.db.transaction(['owners', 'settings'], 'readonly');
    const done = complete(tx);
    try {
      const range = IDBKeyRange.bound([accountId, 0], [accountId, Number.MAX_SAFE_INTEGER]);
      const owners: LocalOwner[] = await request(tx.objectStore('owners').getAll(range));
      const setting = await request(tx.objectStore('settings').get(accountId));
      await done;
      return { owners, currentOwnerId: setting?.currentOwnerId ?? null };
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async readFriend(scope: LocalScope, id: string): Promise<LocalFriend | null> {
    validateScope(scope); validateUnit(id);
    const tx = this.db.transaction('friends', 'readonly');
    const done = complete(tx);
    try {
      const row = await request(tx.objectStore('friends').get([scope.accountId, scope.ownerId, id]));
      await done;
      return row ?? null;
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async upsertFriends(scope: LocalScope, items: LocalFriend[]): Promise<void> {
    validateScope(scope);
    for (const row of items) {
      if (row.accountId !== scope.accountId || row.ownerId !== scope.ownerId || !row.id?.trim()) throw new Error('好友作用域无效');
      validateScore(row.score);
    }
    const tx = this.db.transaction('friends', 'readwrite');
    const done = complete(tx);
    try {
      const store = tx.objectStore('friends');
      for (const row of items) {
        const previous: LocalFriend | undefined = await request(store.get([scope.accountId, scope.ownerId, row.id]));
        store.put({ ...row, raw: mergeFriendRaw(previous?.raw, row.raw) });
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* 事务可能已经结束 */ }
      await done.catch(() => {});
      throw error;
    }
  }

  async readFriends(scope: LocalScope, limit: number, before?: LocalPageCursor): Promise<LocalFriend[]> {
    validateScope(scope);
    if (!Number.isSafeInteger(limit) || limit <= 0) throw new Error('分页大小无效');
    if (before) { validateScore(before.score); if (!before.id) throw new Error('分页游标无效'); }
    const lower = [scope.accountId, scope.ownerId, Number.MIN_SAFE_INTEGER, ''];
    const upper = before ? [scope.accountId, scope.ownerId, before.score, before.id] : [scope.accountId, scope.ownerId, Number.MAX_SAFE_INTEGER, '\uffff'];
    const tx = this.db.transaction('friends', 'readonly');
    const done = complete(tx);
    try {
      const rows = await this.readCursor<LocalFriend>(tx.objectStore('friends').index('page'), IDBKeyRange.bound(lower, upper, false, !!before), limit);
      await done;
      return rows;
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async upsertMessage(row: LocalMessage): Promise<boolean> {
    validateScope(row); validateUnit(row.sessionUnitId); validateScore(row.score);
    if (!row.localId?.trim()) throw new Error('本地消息 ID 无效');
    if (row.clientMessageId != null && !row.clientMessageId.trim()) throw new Error('客户端消息 ID 无效');
    if (row.serverId != null && (!Number.isSafeInteger(row.serverId) || row.serverId <= 0)) throw new Error('服务器消息 ID 无效');
    const tx = this.db.transaction(['messages', 'mutations'], 'readwrite');
    const done = complete(tx);
    const store = tx.objectStore('messages');
    try {
      const prefix = [row.accountId, row.ownerId, row.sessionUnitId];
      const byLocal: LocalMessage | undefined = await request(store.get([...prefix, row.localId]));
      const byServer = row.serverId == null ? undefined : await request(store.index('server').get([...prefix, row.serverId]));
      const byClient = !row.clientMessageId ? undefined : await request(store.index('client').get([...prefix, row.clientMessageId]));
      const previous: LocalMessage | undefined = byClient ?? byServer ?? byLocal;
      // 迟到的失败或重试状态不能覆盖已经收到服务端确认的消息。
      if (previous?.serverId != null && row.serverId == null) { await done; return false; }
      if (byLocal && previous && byLocal.localId !== previous.localId && byLocal.localId !== byServer?.localId) {
        throw new Error('本地消息 ID 与已有消息冲突');
      }
      if (byServer && byClient && byServer.localId !== byClient.localId) {
        store.delete([...prefix, byServer.localId]);
      }
      const merged: LocalMessage = { ...previous, ...row, localId: previous?.localId ?? row.localId,
        serverId: row.serverId ?? previous?.serverId, clientMessageId: row.clientMessageId ?? previous?.clientMessageId };
      const serverId = merged.serverId;
      const mutation = serverId == null ? undefined : await request(tx.objectStore('mutations').get([...prefix, serverId]));
      if (mutation) {
        merged.syncVersion = mutation.syncVersion;
        merged.isDeleted = mutation.isDeleted;
        merged.isRollbacked = !!mutation.isRollbacked || !!mutation.rollbackTime;
        merged.raw = { ...merged.raw, isRollbacked: merged.isRollbacked, rollbackTime: mutation.rollbackTime ?? null };
      } else if (previous?.syncVersion) {
        merged.syncVersion = previous.syncVersion;
        merged.isDeleted = previous.isDeleted;
        merged.isRollbacked = previous.isRollbacked;
      }
      store.put(merged);
      await done;
      return true;
    } catch (error) {
      try { tx.abort(); } catch { /* 事务可能已经结束 */ }
      await done.catch(() => {});
      throw error;
    }
  }

  async readMessages(scope: LocalScope, unit: string, limit: number, before?: LocalPageCursor, serverOnly = false): Promise<LocalMessage[]> {
    validateScope(scope); validateUnit(unit);
    if (!Number.isSafeInteger(limit) || limit <= 0) throw new Error('分页大小无效');
    if (before) { validateScore(before.score); if (!before.id) throw new Error('分页游标无效'); }
    const prefix = [scope.accountId, scope.ownerId, unit];
    const lower = [...prefix, Number.MIN_SAFE_INTEGER, ''];
    const upper = before ? [...prefix, before.score, before.id] : [...prefix, Number.MAX_SAFE_INTEGER, '\uffff'];
    const tx = this.db.transaction('messages', 'readonly');
    const done = complete(tx);
    try {
      const rows = await this.readCursor<LocalMessage>(tx.objectStore('messages').index('page'), IDBKeyRange.bound(lower, upper, false, !!before), limit, row => !row.isDeleted && (!serverOnly || row.serverId != null));
      await done;
      return rows;
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async readPendingMessages(scope: LocalScope, unit: string): Promise<LocalMessage[]> {
    validateScope(scope); validateUnit(unit);
    const prefix = [scope.accountId, scope.ownerId, unit, Number.MAX_SAFE_INTEGER];
    const tx = this.db.transaction('messages', 'readonly');
    const done = complete(tx);
    try {
      const rows: LocalMessage[] = await request(tx.objectStore('messages').index('page').getAll(
        IDBKeyRange.bound([...prefix, ''], [...prefix, '\uffff'])));
      await done;
      return rows.filter(row => row.serverId == null && !row.isDeleted);
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async readMessageByClientId(scope: LocalScope, unit: string, clientMessageId: string): Promise<LocalMessage | null> {
    validateScope(scope); validateUnit(unit);
    if (!clientMessageId?.trim()) throw new Error('客户端消息 ID 无效');
    const tx = this.db.transaction('messages', 'readonly');
    const done = complete(tx);
    try {
      const row: LocalMessage | undefined = await request(tx.objectStore('messages').index('client').get(
        [scope.accountId, scope.ownerId, unit, clientMessageId]));
      await done;
      return row && !row.isDeleted ? row : null;
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async deletePendingMessage(scope: LocalScope, unit: string, clientMessageId: string): Promise<void> {
    validateScope(scope); validateUnit(unit);
    if (!clientMessageId?.trim()) throw new Error('客户端消息 ID 无效');
    const tx = this.db.transaction('messages', 'readwrite');
    const done = complete(tx);
    try {
      const store = tx.objectStore('messages');
      const row: LocalMessage | undefined = await request(store.index('client').get([scope.accountId, scope.ownerId, unit, clientMessageId]));
      if (row && row.serverId == null) store.delete([scope.accountId, scope.ownerId, unit, row.localId]);
      await done;
    } catch (error) { try { tx.abort(); } catch {} await done.catch(() => {}); throw error; }
  }

  async applyMessageMutations(scope: LocalScope, unit: string, changes: MessageMutation[], cursor: string | null, calibration = false): Promise<void> {
    validateScope(scope); validateUnit(unit);
    if (cursor !== null && !cursor) throw new Error('同步游标无效');
    for (const item of changes) {
      if (!Number.isSafeInteger(item.messageId) || item.messageId <= 0 || !/^\d+$/.test(item.syncVersion) || (!calibration && !(item.isDeleted || item.isRollbacked || item.rollbackTime))) {
        throw new Error('消息变更无效');
      }
    }
    const tx = this.db.transaction(['messages', 'cursors', 'mutations'], 'readwrite');
    const done = complete(tx);
    const store = tx.objectStore('messages');
    try {
      const mutations = tx.objectStore('mutations');
      for (const item of changes) {
        const key = [scope.accountId, scope.ownerId, unit, item.messageId];
        const old = await request(mutations.get(key));
        if (old && BigInt(item.syncVersion) <= BigInt(old.syncVersion)) continue;
        mutations.put({ ...scope, sessionUnitId: unit, ...item });
        const row: LocalMessage | undefined = await request(store.index('server').get(key));
        if (row) store.put({ ...row, syncVersion: item.syncVersion, isDeleted: !!item.isDeleted,
          isRollbacked: !!item.isRollbacked || !!item.rollbackTime,
          raw: { ...row.raw, isRollbacked: !!item.isRollbacked || !!item.rollbackTime, rollbackTime: item.rollbackTime ?? null } });
      }
      if (cursor !== null) {
        const cursorStore = tx.objectStore('cursors');
        const current = await request(cursorStore.get([scope.accountId, scope.ownerId, unit]));
        cursorStore.put({ ...current, ...scope, sessionUnitId: unit, cursor });
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* 事务可能已经结束 */ }
      await done.catch(() => {});
      throw error;
    }
  }

  async readMessageServerIds(scope: LocalScope, unit: string, after: number, limit: number): Promise<number[]> {
    validateScope(scope); validateUnit(unit);
    if (!Number.isSafeInteger(after) || after < 0 || !Number.isSafeInteger(limit) || limit <= 0) throw new Error('消息校准分页无效');
    if (after === Number.MAX_SAFE_INTEGER) return [];
    const tx = this.db.transaction('messages', 'readonly');
    const done = complete(tx);
    const prefix = [scope.accountId, scope.ownerId, unit];
    try {
      const ids = await new Promise<number[]>((resolve, reject) => {
        const values: number[] = [];
        const range = IDBKeyRange.bound([...prefix, after], [...prefix, Number.MAX_SAFE_INTEGER], true, false);
        const cursor = tx.objectStore('messages').index('server').openCursor(range, 'next');
        cursor.onerror = () => reject(cursor.error ?? new Error('读取消息校准范围失败'));
        cursor.onsuccess = () => {
          const row = cursor.result;
          if (!row) { resolve(values); return; }
          values.push((row.value as LocalMessage).serverId!);
          if (values.length >= limit) resolve(values); else row.continue();
        };
      });
      await done;
      return ids;
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async readMessagesByServerIds(scope: LocalScope, unit: string, ids: number[]): Promise<LocalMessage[]> {
    validateScope(scope); validateUnit(unit);
    if (ids.some(id => !Number.isSafeInteger(id) || id <= 0)) throw new Error('消息标识无效');
    const tx = this.db.transaction('messages', 'readonly');
    const done = complete(tx);
    try {
      const rows: LocalMessage[] = [];
      for (const id of ids) {
        const row: LocalMessage | undefined = await request(tx.objectStore('messages').index('server').get([scope.accountId, scope.ownerId, unit, id]));
        if (row && !row.isDeleted) rows.push(row);
      }
      await done;
      return rows;
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async setHistoryComplete(scope: LocalScope, unit: string, loadedAll: boolean): Promise<void> {
    validateScope(scope); validateUnit(unit);
    const tx = this.db.transaction('cursors', 'readwrite');
    const done = complete(tx);
    try {
      const store = tx.objectStore('cursors');
      const row = await request(store.get([scope.accountId, scope.ownerId, unit]));
      store.put({ ...row, ...scope, sessionUnitId: unit, loadedAll });
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* 事务可能已经结束 */ }
      await done.catch(() => {});
      throw error;
    }
  }

  async isHistoryComplete(scope: LocalScope, unit: string): Promise<boolean> {
    validateScope(scope); validateUnit(unit);
    const tx = this.db.transaction('cursors', 'readonly');
    const done = complete(tx);
    try {
      const row = await request(tx.objectStore('cursors').get([scope.accountId, scope.ownerId, unit]));
      await done;
      return row?.loadedAll === true;
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  async readMessageCursor(scope: LocalScope, unit: string): Promise<string | null> {
    validateScope(scope); validateUnit(unit);
    const tx = this.db.transaction('cursors', 'readonly');
    const done = complete(tx);
    try {
      const row = await request(tx.objectStore('cursors').get([scope.accountId, scope.ownerId, unit]));
      await done;
      return row?.cursor ?? null;
    } catch (error) { await done.catch(() => {}); throw error; }
  }

  private readCursor<T>(index: IDBIndex, range: IDBKeyRange, limit: number, accept: (row: T) => boolean = () => true): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const rows: T[] = [];
      const cursor = index.openCursor(range, 'prev');
      cursor.onerror = () => reject(cursor.error ?? new Error('本地数据库分页失败'));
      cursor.onsuccess = () => {
        const item = cursor.result;
        if (!item || rows.length >= limit) { resolve(rows); return; }
        const value = item.value as T;
        if (accept(value)) rows.push(value);
        if (rows.length >= limit) resolve(rows);
        else item.continue();
      };
    });
  }
}
