import type { SessionUnitOwnerDto } from '../../apis/dtos';
import { ImDatabase, type LocalPageCursor, type LocalScope } from './imDatabase';
import { isLocalAccountCurrent, readLocalAccountSnapshot, resolveLocalAccountId, type LocalAccountSnapshot } from './localAccount';

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

export async function readCachedFriends(scope: FriendCacheScope, limit: number, before?: LocalPageCursor): Promise<SessionUnitOwnerDto[]> {
  const db = await getDatabase();
  const rows = await db.readFriends(scope, limit, before);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return rows.map(row => ({ ...(row.raw as SessionUnitOwnerDto), id: row.id, ownerId: scope.ownerId, score: row.score }));
}

export async function saveCachedFriends(scope: FriendCacheScope, items: SessionUnitOwnerDto[]): Promise<void> {
  if (!await isFriendScopeCurrent(scope)) return;
  const rows = items.flatMap(item => {
    const rawScore = item.score ?? (item as any).Score;
    const score = Number(rawScore);
    // 没有服务端排序游标时不缓存，避免本地分页使用猜测的 maxScore。
    if (!item.id || rawScore == null || !Number.isSafeInteger(score) ||
        (item.ownerId != null && item.ownerId !== scope.ownerId)) return [];
    // IndexedDB 不能存 Vue Proxy；只存 API DTO，不写入令牌或文件。
    const raw = JSON.parse(JSON.stringify(item)) as Record<string, unknown>;
    return [{ accountId: scope.accountId, ownerId: scope.ownerId, id: item.id, score, raw }];
  });
  if (!rows.length) return;
  const db = await getDatabase();
  if (await isFriendScopeCurrent(scope)) await db.upsertFriends(scope as LocalScope, rows);
}
