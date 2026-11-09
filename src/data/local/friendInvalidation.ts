/** 广播好友缓存键，不广播好友资料；接收方需校验认证会话后读取数据库。 */
export type FriendInvalidation = { ownerId: number; sessionVersion: number; ids: string[] };
type Listener = (event: FriendInvalidation) => void;
const listeners = new Set<Listener>();
let channel: BroadcastChannel | null = null;

function key(value: unknown): FriendInvalidation | null {
  if (!value || typeof value !== 'object') return null;
  const event = value as FriendInvalidation;
  if (!Number.isSafeInteger(event.ownerId) || event.ownerId <= 0 ||
      !Number.isSafeInteger(event.sessionVersion) || event.sessionVersion < 0 ||
      !Array.isArray(event.ids) || !event.ids.length || event.ids.length > 200 ||
      event.ids.some(id => typeof id !== 'string' || !id || id.length > 200)) return null;
  return { ownerId: event.ownerId, sessionVersion: event.sessionVersion, ids: [...new Set(event.ids)] };
}
function dispatch(event: FriendInvalidation): void {
  listeners.forEach(listener => { try { listener(event); } catch { /* 监听错误不能影响写入 */ } });
}
function getChannel(): BroadcastChannel | null {
  if (!channel && typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel('gotoim-friend-cache-v1');
      channel.onmessage = ({ data }: MessageEvent) => { const event = key(data); if (event) dispatch(event); };
    } catch { return null; }
  }
  return channel;
}
export function notifyFriendsChanged(event: FriendInvalidation): void {
  const clean = key(event);
  if (!clean) return;
  try { getChannel()?.postMessage(clean); } catch { /* 数据已提交，通知失败不回滚 */ }
  dispatch(clean);
}
export function onFriendsChanged(listener: Listener): () => void {
  getChannel();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
