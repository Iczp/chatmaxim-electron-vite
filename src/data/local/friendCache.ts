import type { SessionUnitOwnerDto } from '../../apis/dtos';
import { ImDatabase, type LocalPageCursor, type LocalScope } from './imDatabase';
import { isLocalAccountCurrent, readLocalAccountSnapshot, resolveLocalAccountId, type LocalAccountSnapshot } from './localAccount';
import { notifyFriendsChanged } from './friendInvalidation';

let database: Promise<ImDatabase> | null = null;
const getDatabase = (): Promise<ImDatabase> => {
  if (!database) {
    const opened = ImDatabase.open();
    database = opened;
    void opened.catch(() => { if (database === opened) database = null; });
  }
  return database;
};

export type FriendCacheScope = LocalAccountSnapshot & { ownerId: number };
export async function readFriendScope(ownerId: number, bindIfNeeded = false): Promise<FriendCacheScope | null> {
  if (!Number.isSafeInteger(ownerId) || ownerId <= 0) return null;
  let snapshot = await readLocalAccountSnapshot();
  if (!snapshot && bindIfNeeded) {
    await resolveLocalAccountId();
    snapshot = await readLocalAccountSnapshot();
  }
  return snapshot ? { ...snapshot, ownerId } : null;
}

export const isFriendScopeCurrent = (scope: FriendCacheScope): Promise<boolean> => isLocalAccountCurrent(scope);

export async function readCachedFriend(scope: FriendCacheScope, sessionUnitId: string): Promise<SessionUnitOwnerDto | null> {
  const db = await getDatabase();
  const row = await db.readFriend(scope, sessionUnitId);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return row ? { ...(row.raw as SessionUnitOwnerDto), id: row.id, ownerId: scope.ownerId, score: row.score } : null;
}

export async function readCachedFriends(scope: FriendCacheScope, limit: number, before?: LocalPageCursor): Promise<SessionUnitOwnerDto[]> {
  const db = await getDatabase();
  const rows = await db.readFriends(scope, limit, before);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return rows.map(row => ({ ...(row.raw as SessionUnitOwnerDto), id: row.id, ownerId: scope.ownerId, score: row.score }));
}

export async function saveCachedFriends(scope: FriendCacheScope, items: SessionUnitOwnerDto[]): Promise<void> {
  if (!await isFriendScopeCurrent(scope)) return;
  const rows = toFriendRows(scope, items);
  if (!rows.length) return;
  const db = await getDatabase();
  if (await isFriendScopeCurrent(scope)) {
    const saved = await db.upsertFriends(scope as LocalScope, rows);
    if (await isFriendScopeCurrent(scope)) notifySaved(scope, saved.map(row => row.id));
  }
}

function notifySaved(scope: FriendCacheScope, ids: string[]): void {
  for (let offset = 0; offset < ids.length; offset += 200) {
    notifyFriendsChanged({ ownerId: scope.ownerId, sessionVersion: scope.sessionVersion, ids: ids.slice(offset, offset + 200) });
  }
}

function toFriendRows(scope: FriendCacheScope, items: SessionUnitOwnerDto[]) {
  return items.flatMap(item => {
    const rawScore = item.score ?? (item as any).Score;
    const score = rawScore == null ? undefined : Number(rawScore);
    // 无 score 的局部更新只合并已有记录，不为新好友猜测分页游标。
    if (!item.id || (score != null && !Number.isSafeInteger(score)) ||
        (item.ownerId != null && item.ownerId !== scope.ownerId)) return [];
    // IndexedDB 不能存 Vue Proxy；只存 API DTO，不写入令牌或文件。
    const raw = JSON.parse(JSON.stringify(item)) as Record<string, unknown>;
    return [{ accountId: scope.accountId, ownerId: scope.ownerId, id: item.id, score, raw }];
  });
}

export async function openFriendChangesStore(scope: FriendCacheScope) {
  const db = await getDatabase();
  const ensure = async () => { if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化'); };
  await ensure();
  return {
    async readTicks() { const ticks = await db.readFriendChangesTicks(scope); await ensure(); return ticks; },
    async apply(items: SessionUnitOwnerDto[], ticks: number) {
      const rows = toFriendRows(scope, items);
      if (rows.length !== items.length) throw new Error('好友变更包含无效记录');
      await ensure();
      const saved = await db.applyFriendChanges(scope, rows, ticks);
      await ensure();
      notifySaved(scope, saved.map(row => row.id));
      return saved.map(row => ({ ...(row.raw as SessionUnitOwnerDto), id: row.id, ownerId: scope.ownerId, score: row.score }));
    },
  };
}
