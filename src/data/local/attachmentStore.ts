import type { FriendCacheScope } from './friendCache';
import { isFriendScopeCurrent } from './friendCache';

export type LocalAttachment = { name: string; type: string; size: number; lastModified: number };
const DIRECTORY = 'gotoim-pending-attachments-v1';

function validate(scope: FriendCacheScope, unit: string, clientId: string): void {
  if (!scope.accountId || !Number.isSafeInteger(scope.ownerId) || scope.ownerId <= 0 || !unit || !clientId) {
    throw new Error('附件作用域无效');
  }
}
async function fileKey(scope: FriendCacheScope, unit: string, clientId: string): Promise<string> {
  validate(scope, unit, clientId);
  const input = new TextEncoder().encode(JSON.stringify([scope.accountId, scope.ownerId, unit, clientId]));
  const digest = await crypto.subtle.digest('SHA-256', input);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
async function directory(create: boolean): Promise<FileSystemDirectoryHandle> {
  if (!navigator.storage?.getDirectory) throw new Error('当前环境不支持本地附件存储');
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle(DIRECTORY, { create });
}
async function ensure(scope: FriendCacheScope): Promise<void> {
  if (!await isFriendScopeCurrent(scope)) throw new Error('登录状态已变化');
}

/** 将 File 的数据流写入浏览器私有磁盘目录，不在数据库存储附件二进制。 */
export async function savePendingAttachment(scope: FriendCacheScope, unit: string, clientId: string, file: File): Promise<LocalAttachment> {
  if (!file || typeof file.name !== 'string' || !file.name || file.name.length > 1024 ||
      !Number.isSafeInteger(file.size) || file.size < 0 || !Number.isSafeInteger(file.lastModified)) throw new Error('附件信息无效');
  await ensure(scope);
  const key = await fileKey(scope, unit, clientId);
  const dir = await directory(true);
  const handle = await dir.getFileHandle(key, { create: true });
  const writable = await handle.createWritable();
  try {
    await file.stream().pipeTo(writable);
    await ensure(scope);
  } catch (error) {
    try { await writable.abort(); } catch {}
    try { await dir.removeEntry(key); } catch {}
    throw error;
  }
  return { name: file.name, type: file.type, size: file.size, lastModified: file.lastModified };
}

export async function readPendingAttachment(scope: FriendCacheScope, unit: string, clientId: string, meta: LocalAttachment): Promise<File> {
  await ensure(scope);
  const key = await fileKey(scope, unit, clientId);
  const dir = await directory(false);
  const blob = await (await dir.getFileHandle(key)).getFile();
  if (!meta || typeof meta.name !== 'string' || !meta.name || typeof meta.type !== 'string' ||
      !Number.isSafeInteger(meta.size) || meta.size !== blob.size || !Number.isSafeInteger(meta.lastModified)) throw new Error('本地附件信息不匹配');
  await ensure(scope);
  return new File([blob], meta.name, { type: meta.type, lastModified: meta.lastModified });
}

export async function deletePendingAttachment(scope: FriendCacheScope, unit: string, clientId: string): Promise<void> {
  await ensure(scope);
  const key = await fileKey(scope, unit, clientId);
  try { await (await directory(false)).removeEntry(key); }
  catch (error) { if (!(error instanceof DOMException && error.name === 'NotFoundError')) throw error; }
}
