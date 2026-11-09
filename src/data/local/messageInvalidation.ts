/** 仅广播缓存键，消息内容仍从账号隔离的数据库读取。 */
export type MessageInvalidation = {
  ownerId: number;
  sessionUnitId: string;
  sessionVersion: number;
  clientMessageId: string;
};

type Listener = (event: MessageInvalidation) => void;
const listeners = new Set<Listener>();
let channel: BroadcastChannel | null = null;

function valid(value: unknown): value is MessageInvalidation {
  if (!value || typeof value !== 'object') return false;
  const event = value as MessageInvalidation;
  return Number.isSafeInteger(event.ownerId) && event.ownerId > 0 &&
    Number.isSafeInteger(event.sessionVersion) && event.sessionVersion >= 0 &&
    typeof event.sessionUnitId === 'string' && event.sessionUnitId.length > 0 && event.sessionUnitId.length <= 200 &&
    typeof event.clientMessageId === 'string' && event.clientMessageId.length > 0 && event.clientMessageId.length <= 200;
}

function getChannel(): BroadcastChannel | null {
  if (!channel && typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel('gotoim-message-cache-v1');
      channel.onmessage = ({ data }: MessageEvent) => { if (valid(data)) dispatch(onlyKey(data)); };
    } catch { return null; }
  }
  return channel;
}

function onlyKey(event: MessageInvalidation): MessageInvalidation {
  return { ownerId: event.ownerId, sessionUnitId: event.sessionUnitId,
    sessionVersion: event.sessionVersion, clientMessageId: event.clientMessageId };
}

function dispatch(event: MessageInvalidation): void {
  listeners.forEach(listener => { try { listener(event); } catch { /* 一个监听器不应影响其他窗口 */ } });
}

export function notifyMessageChanged(event: MessageInvalidation): void {
  if (!valid(event)) return;
  const key = onlyKey(event);
  try { getChannel()?.postMessage(key); } catch { /* 通知失败不影响数据库事务 */ }
  // BroadcastChannel 不会向发送端自身回传；同窗口的其他聊天视图也要收到。
  dispatch(key);
}

export function onMessageChanged(listener: Listener): () => void {
  getChannel();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
