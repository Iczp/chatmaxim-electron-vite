import type { MessageDto } from '../../apis/dtos';
import { MessageStateEnums } from '../../apis/enums';
import { ImDatabase, type LocalPageCursor } from './imDatabase';
import { isFriendScopeCurrent, readFriendScope, type FriendCacheScope } from './friendCache';
import type { MessageChangeState } from '../../apis/v2';
import type { LocalMessage } from './imDatabase';

let database: Promise<ImDatabase> | null = null;
function getDatabase(): Promise<ImDatabase> {
  if (!database) {
    const opened = ImDatabase.open();
    database = opened;
    void opened.catch(() => { if (database === opened) database = null; });
  }
  return database;
}
export { readFriendScope as readMessageScope, isFriendScopeCurrent as isMessageScopeCurrent };

function toMessage(row: LocalMessage): MessageDto {
  const raw = row.raw as MessageDto;
  return { ...raw, id: row.serverId, clientMessageId: row.clientMessageId,
    scrollerKey: row.localId, isRollbacked: row.syncVersion ? !!row.isRollbacked : !!raw.isRollbacked,
    rollbackTime: row.syncVersion && !row.isRollbacked ? null : raw.rollbackTime };
}

export async function readCachedMessages(scope: FriendCacheScope, unit: string, limit: number, before?: LocalPageCursor): Promise<MessageDto[]> {
  const db = await getDatabase();
  const rows = await db.readMessages(scope, unit, limit, before, true);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return rows.reverse().map(toMessage);
}

/** 恢复未确认消息；不自动重发，避免进程中断时重复发送。 */
export async function readPendingMessages(scope: FriendCacheScope, unit: string): Promise<MessageDto[]> {
  const db = await getDatabase();
  const rows = await db.readPendingMessages(scope, unit);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return rows.map(row => ({ ...toMessage(row), state: MessageStateEnums.Error,
    error: (row.raw.error as string) || '发送状态未确认，请检查后重试' }));
}

export async function savePendingMessage(scope: FriendCacheScope, unit: string, item: MessageDto): Promise<void> {
  if (!item.clientMessageId || item.file) throw new Error('消息不能保存为本地待发送消息');
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  const db = await getDatabase();
  const raw = JSON.parse(JSON.stringify(item)) as Record<string, unknown>;
  delete raw.file;
  await db.upsertMessage({ accountId: scope.accountId, ownerId: scope.ownerId, sessionUnitId: unit,
    localId: `client-${item.clientMessageId}`, clientMessageId: item.clientMessageId,
    score: Number.MAX_SAFE_INTEGER, state: item.state === MessageStateEnums.Sending ? 'sending' : 'failed', raw });
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
}

export async function deletePendingMessage(scope: FriendCacheScope, unit: string, clientMessageId: string): Promise<void> {
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  const db = await getDatabase();
  await db.deletePendingMessage(scope, unit, clientMessageId);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
}

export async function readCachedMessagesByIds(scope: FriendCacheScope, unit: string, ids: number[]): Promise<MessageDto[]> {
  const db = await getDatabase();
  const rows = await db.readMessagesByServerIds(scope, unit, ids);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return rows.map(toMessage).sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
}

/** 仅保存服务器消息；本地待发送附件必须使用独立文件持久化，不能序列化 Blob。 */
export async function saveCachedMessages(scope: FriendCacheScope, unit: string, items: MessageDto[]): Promise<void> {
  if (!await isFriendScopeCurrent(scope)) return;
  const db = await getDatabase();
  for (const item of items) {
    const serverId = Number(item.id);
    if (!Number.isSafeInteger(serverId) || serverId <= 0) continue;
    if (!await isFriendScopeCurrent(scope)) return;
    const raw = JSON.parse(JSON.stringify(item)) as Record<string, unknown>;
    delete raw.file;
    await db.upsertMessage({
      accountId: scope.accountId, ownerId: scope.ownerId, sessionUnitId: unit,
      localId: `server-${serverId}`, serverId, clientMessageId: item.clientMessageId,
      score: serverId, state: 'sent', raw: { ...raw, state: MessageStateEnums.Ok },
    });
  }
}

export async function readHistoryComplete(scope: FriendCacheScope, unit: string): Promise<boolean> {
  const db = await getDatabase();
  const value = await db.isHistoryComplete(scope, unit);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return value;
}

export async function markHistoryComplete(scope: FriendCacheScope, unit: string): Promise<void> {
  const db = await getDatabase();
  if (await isFriendScopeCurrent(scope)) await db.setHistoryComplete(scope, unit, true);
}

/** 为单一账号和会话创建同步存储；游标和变更状态在数据库中原子提交。 */
export async function openMutationStore(ownerId: number, unit: string, version: number | null) {
  const scope = await readFriendScope(ownerId, true);
  if (!scope || scope.sessionVersion !== version) return null;
  const db = await getDatabase();
  const ensure = async () => { if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化'); };
  await ensure();
  return {
    async readCursor() { const value = await db.readMessageCursor(scope, unit); await ensure(); return value; },
    async readIds(after: number, limit: number) { const ids = await db.readMessageServerIds(scope, unit, after, limit); await ensure(); return ids; },
    async apply(states: MessageChangeState[], cursor: string | null, calibration: boolean) {
      await ensure();
      await db.applyMessageMutations(scope, unit, states.map(row => ({
        messageId: Number(row.messageId), syncVersion: String(row.syncVersion),
        isDeleted: row.isDeleted, isRollbacked: row.isRollbacked, rollbackTime: row.rollbackTime,
      })), cursor, calibration);
      await ensure();
    },
    async readMessages(ids: number[]) { await ensure(); return readCachedMessagesByIds(scope, unit, ids); },
  };
}
