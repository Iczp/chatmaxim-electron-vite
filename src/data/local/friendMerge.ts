const SCORE_FACTOR = 10_000_000_000_000;
const fields = ['score', 'sorting', 'ticks'] as const;
const fieldValue = (value: Record<string, any>, field: typeof fields[number]) =>
  value[field] ?? value[field[0].toUpperCase() + field.slice(1)];
const safeInteger = (value: unknown): number | null => {
  if (value == null || value === '' || typeof value === 'boolean') return null;
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
};

/** 以服务器 score 为排序依据；兼容服务端 ticks 落后但 score 可解码的响应。 */
function scoreTuple(value: Record<string, any>): { score: number; sorting: number; ticks: number } | null {
  const score = safeInteger(fieldValue(value, 'score'));
  const sorting = safeInteger(fieldValue(value, 'sorting'));
  const ticks = safeInteger(fieldValue(value, 'ticks'));
  if (score == null || sorting == null || ticks == null || score < 0 || sorting < 0 || ticks < 0) return null;
  const base = sorting * SCORE_FACTOR;
  const normalizedTicks = score - base;
  if (!Number.isSafeInteger(base) || !Number.isSafeInteger(normalizedTicks) || normalizedTicks < 0) return null;
  return { score, sorting, ticks: normalizedTicks };
}

function messageId(value: unknown): bigint | null {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return BigInt(value);
  if (typeof value === 'string' && /^\d+$/.test(value)) return BigInt(value);
  return null;
}

/** 合并好友详情时保留网络响应省略的资料和较新的消息预览。 */
export function mergeFriendRaw<T extends Record<string, any>>(local: T | undefined, remote: T): T {
  const tuple = scoreTuple(remote);
  if (!local) return { ...remote, ...(tuple ?? {}) };
  const merged: Record<string, any> = { ...local, ...remote };
  if (tuple) {
    Object.assign(merged, tuple);
  } else if (fieldValue(local, 'score') != null) {
    for (const field of fields) {
      const value = fieldValue(local, field);
      if (value == null) delete merged[field];
      else merged[field] = value;
    }
  }
  if (tuple || fieldValue(local, 'score') != null) {
    for (const field of fields) delete merged[field[0].toUpperCase() + field.slice(1)];
  }
  for (const field of ['destination', 'owner']) {
    const oldValue = local[field];
    const newValue = remote[field];
    if (oldValue && typeof oldValue === 'object' && !Array.isArray(oldValue)) {
      merged[field] = newValue && typeof newValue === 'object' && !Array.isArray(newValue)
        ? { ...oldValue, ...newValue } : oldValue;
    }
  }
  const oldMessage = local.lastMessage ?? local.LastMessage;
  const newMessage = remote.lastMessage ?? remote.LastMessage;
  const oldId = messageId(oldMessage?.id ?? oldMessage?.Id ?? local.lastMessageId ?? local.LastMessageId ?? 0);
  const newId = messageId(newMessage?.id ?? newMessage?.Id ?? remote.lastMessageId ?? remote.LastMessageId ?? 0);
  if (oldMessage && typeof oldMessage === 'object' &&
      (!newMessage || typeof newMessage !== 'object' || (oldId != null && newId != null && oldId > newId))) {
    merged.lastMessage = oldMessage;
    if (local.lastMessageTime != null) merged.lastMessageTime = local.lastMessageTime;
    if (oldId != null && newId != null && oldId > newId && local.lastMessageId != null) merged.lastMessageId = local.lastMessageId;
  }
  const localUnread = safeInteger(local.publicBadge ?? local.PublicBadge);
  const readId = messageId(local.readMessageId ?? local.ReadMessageId);
  const latestId = messageId(merged.lastMessageId ?? merged.LastMessageId ?? merged.lastMessage?.id ?? merged.lastMessage?.Id);
  if (localUnread === 0 && readId != null && latestId != null && latestId > 0n && readId >= latestId) {
    merged.publicBadge = 0;
    delete merged.PublicBadge;
  }
  return merged as T;
}
