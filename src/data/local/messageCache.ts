import type { MessageDto } from '../../apis/dtos';
import { MessageStateEnums } from '../../apis/enums';
import { ImDatabase, type LocalPageCursor } from './imDatabase';
import { isFriendScopeCurrent, readFriendScope, type FriendCacheScope } from './friendCache';
import type { MessageChangeState } from '../../apis/v2';
import type { LocalMessage } from './imDatabase';
import { deletePendingAttachment, readPendingAttachment } from './attachmentStore';

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
const previews = new Map<string, { url: string; file: File; sessionVersion: number }>();
const previewKey = (scope: FriendCacheScope, unit: string, clientId: string) => JSON.stringify([scope.accountId, scope.ownerId, unit, clientId]);
export function releaseAttachmentPreview(scope: FriendCacheScope, unit: string, clientId: string): void {
  const key = previewKey(scope, unit, clientId);
  const preview = previews.get(key);
  if (preview) { URL.revokeObjectURL(preview.url); previews.delete(key); }
}
export function clearAttachmentPreviews(currentVersion?: number): void {
  for (const [key, preview] of previews) {
    if (currentVersion == null || preview.sessionVersion !== currentVersion) {
      URL.revokeObjectURL(preview.url);
      previews.delete(key);
    }
  }
}

function toMessage(row: LocalMessage): MessageDto {
  const raw = row.raw as MessageDto;
  return { ...raw, id: row.serverId, clientMessageId: row.clientMessageId,
    scrollerKey: row.localId, isRollbacked: row.syncVersion ? !!row.isRollbacked : !!raw.isRollbacked,
    rollbackTime: row.syncVersion && !row.isRollbacked ? null : raw.rollbackTime };
}

async function hydratePending(scope: FriendCacheScope, unit: string, row: LocalMessage): Promise<MessageDto> {
  const item = toMessage(row);
  if (!item.localAttachment || !item.clientMessageId) return item;
  try {
    const key = previewKey(scope, unit, item.clientMessageId);
    let preview = previews.get(key);
    if (!preview) {
      const file = await readPendingAttachment(scope, unit, item.clientMessageId, item.localAttachment);
      if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
      preview = previews.get(key);
      if (!preview) { preview = { file, url: URL.createObjectURL(file), sessionVersion: scope.sessionVersion }; previews.set(key, preview); }
    }
    return { ...item, file: preview.file, content: { ...(item.content as object), path: preview.url } };
  } catch {
    return { ...item, state: MessageStateEnums.Error, error: '本地附件不可用，请重新选择文件' };
  }
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
  const items = await Promise.all(rows.map(row => hydratePending(scope, unit, row)));
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return items.map(item => ({ ...item, state: MessageStateEnums.Error,
    error: item.error || '发送状态未确认，请检查后重试' }));
}

export async function readCachedMessageByClientId(scope: FriendCacheScope, unit: string, clientMessageId: string): Promise<MessageDto | null> {
  const db = await getDatabase();
  const row = await db.readMessageByClientId(scope, unit, clientMessageId);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  if (!row) return null;
  if (row.serverId != null) { releaseAttachmentPreview(scope, unit, clientMessageId); return toMessage(row); }
  const item = await hydratePending(scope, unit, row);
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  return item;
}

export async function savePendingMessage(scope: FriendCacheScope, unit: string, item: MessageDto): Promise<void> {
  if (!item.clientMessageId || (item.file && !item.localAttachment)) throw new Error('消息不能保存为本地待发送消息');
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  const db = await getDatabase();
  const raw = JSON.parse(JSON.stringify(item)) as Record<string, unknown>;
  delete raw.file;
  if (raw.content && typeof raw.content === 'object' && String((raw.content as any).path || '').startsWith('blob:')) delete (raw.content as any).path;
  const saved = await db.upsertMessage({ accountId: scope.accountId, ownerId: scope.ownerId, sessionUnitId: unit,
    localId: `client-${item.clientMessageId}`, clientMessageId: item.clientMessageId,
    score: Number.MAX_SAFE_INTEGER, state: item.state === MessageStateEnums.Sending ? 'sending' : 'failed', raw });
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
  if (!saved) throw new Error('消息已确认，请刷新聊天后查看');
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
    const previous = item.clientMessageId ? await db.readMessageByClientId(scope, unit, item.clientMessageId) : null;
    const raw = JSON.parse(JSON.stringify(item)) as Record<string, unknown>;
    delete raw.file;
    delete raw.localAttachment;
    if (raw.content && typeof raw.content === 'object' && String((raw.content as any).path || '').startsWith('blob:')) delete (raw.content as any).path;
    await db.upsertMessage({
      accountId: scope.accountId, ownerId: scope.ownerId, sessionUnitId: unit,
      localId: `server-${serverId}`, serverId, clientMessageId: item.clientMessageId,
      score: serverId, state: 'sent', raw: { ...raw, state: MessageStateEnums.Ok },
    });
    if (previous?.raw.localAttachment && item.clientMessageId && await isFriendScopeCurrent(scope)) {
      try { await deletePendingAttachment(scope, unit, item.clientMessageId); }
      catch { console.warn('[chat] 清理已确认附件失败'); }
    }
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
