import type { ChatObjectDto } from '../../apis/dtos';
import { ImDatabase } from './imDatabase';
import { isLocalAccountCurrent, readLocalAccountSnapshot, resolveLocalAccountId, type LocalAccountSnapshot } from './localAccount';

let database: Promise<ImDatabase> | null = null;
function getDatabase(): Promise<ImDatabase> {
  if (!database) {
    const opened = ImDatabase.open();
    database = opened;
    void opened.catch(() => { if (database === opened) database = null; });
  }
  return database;
}

export async function readOwnerScope(bindIfNeeded = false): Promise<LocalAccountSnapshot | null> {
  let scope = await readLocalAccountSnapshot();
  if (!scope && bindIfNeeded) {
    await resolveLocalAccountId();
    scope = await readLocalAccountSnapshot();
  }
  return scope;
}

export async function readCachedOwners(scope: LocalAccountSnapshot): Promise<{ owners: ChatObjectDto[]; currentOwnerId: number | null }> {
  const db = await getDatabase();
  const result = await db.readOwners(scope.accountId);
  if (!await isLocalAccountCurrent(scope)) throw new Error('登录状态已变化');
  return { owners: result.owners.map(row => ({ ...row.raw, id: row.ownerId })), currentOwnerId: result.currentOwnerId };
}

export async function saveCachedOwners(scope: LocalAccountSnapshot, owners: ChatObjectDto[]): Promise<void> {
  if (!await isLocalAccountCurrent(scope)) throw new Error('登录状态已变化');
  const rows = owners.flatMap(owner => {
    const id = Number(owner.id);
    if (!Number.isSafeInteger(id) || id <= 0) return [];
    return [{ accountId: scope.accountId, ownerId: id, raw: JSON.parse(JSON.stringify(owner)) as Record<string, unknown> }];
  });
  const db = await getDatabase();
  if (!await isLocalAccountCurrent(scope)) throw new Error('登录状态已变化');
  await db.saveOwners(scope.accountId, rows);
  if (!await isLocalAccountCurrent(scope)) throw new Error('登录状态已变化');
}

export async function saveCurrentOwner(scope: LocalAccountSnapshot, ownerId: number): Promise<void> {
  if (!await isLocalAccountCurrent(scope)) throw new Error('登录状态已变化');
  const db = await getDatabase();
  await db.saveOwners(scope.accountId, [], ownerId);
  if (!await isLocalAccountCurrent(scope)) throw new Error('登录状态已变化');
}
