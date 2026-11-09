import type { SessionUnitOwnerDto } from '../apis/dtos';
import { apiV2 } from '../apis/v2';

type FriendChangeStore = {
  readTicks(): Promise<number | null>;
  apply(items: SessionUnitOwnerDto[], ticks: number): Promise<SessionUnitOwnerDto[]>;
};
type FetchChanges = typeof apiV2.sessions.changes;
const PAGE_SIZE = 99;

/** 基于本地高水位重放边界 tick；每页先原子落库，再更新界面。 */
export async function syncFriendChanges(
  ownerId: number, store: FriendChangeStore, fetch: FetchChanges,
  onItems: (items: SessionUnitOwnerDto[]) => void, isCurrent: () => Promise<boolean>,
): Promise<boolean> {
  const initial = await store.readTicks();
  if (!initial) return false;
  if (!await isCurrent()) throw new Error('登录状态已变化');
  let ticks = initial - 1;
  let cursorId: string | undefined;
  const seen = new Set<string>();
  for (let pageNumber = 0; pageNumber < 1000; pageNumber++) {
    const page = await fetch({ ownerId, minTicks: ticks, cursorId, maxResultCount: PAGE_SIZE });
    if (!await isCurrent()) throw new Error('登录状态已变化');
    if (!Array.isArray(page.items)) throw new Error('好友变更响应缺少列表');
    const items = page.items;
    if (items.some(item => !item.id || (item.ownerId != null && Number(item.ownerId) !== ownerId))) {
      throw new Error('好友变更包含错误身份或会话');
    }
    const extra = page.extra;
    if (extra?.hasMore != null && typeof extra.hasMore !== 'boolean') throw new Error('好友变更分页状态无效');
    const hasMore = extra?.hasMore ?? items.length >= PAGE_SIZE;
    if (!items.length) {
      if (hasMore) throw new Error('好友变更分页为空但仍有后续');
      return true;
    }
    const explicitTicks = extra?.nextCursor?.cursorScore ?? extra?.nextCursorTicks;
    const itemTicks = items.map(item => Number(item.ticks ?? (item as any).Ticks));
    const nextTicks = explicitTicks == null ? Math.max(ticks, ...itemTicks) : Number(explicitTicks);
    const nextId = extra?.nextCursor?.cursorId ?? extra?.nextCursorId;
    if (!Number.isSafeInteger(nextTicks) || nextTicks < ticks ||
        (hasMore && (typeof nextId !== 'string' || !nextId))) throw new Error('好友变更分页游标无效');
    const nextKey = JSON.stringify([nextTicks, nextId ?? null]);
    if (hasMore && (seen.has(nextKey) || (nextTicks === ticks && nextId === cursorId))) {
      throw new Error('好友变更分页游标未推进');
    }
    seen.add(nextKey);
    const saved = await store.apply(items, nextTicks);
    if (!await isCurrent()) throw new Error('登录状态已变化');
    onItems(saved);
    if (!hasMore) return true;
    ticks = nextTicks;
    cursorId = nextId;
  }
  throw new Error('好友变更页数超过上限');
}
