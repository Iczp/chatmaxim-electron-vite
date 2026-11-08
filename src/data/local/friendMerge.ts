/** 合并好友详情时保留网络响应省略的资料和较新的消息预览。 */
export function mergeFriendRaw<T extends Record<string, any>>(local: T | undefined, remote: T): T {
  if (!local) return { ...remote };
  const merged: Record<string, any> = { ...local, ...remote };
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
  const oldId = Number(oldMessage?.id ?? oldMessage?.Id ?? local.lastMessageId ?? 0);
  const newId = Number(newMessage?.id ?? newMessage?.Id ?? remote.lastMessageId ?? 0);
  if (oldMessage && typeof oldMessage === 'object' &&
      (!newMessage || typeof newMessage !== 'object' || oldId > newId)) {
    merged.lastMessage = oldMessage;
    if (local.lastMessageTime != null) merged.lastMessageTime = local.lastMessageTime;
  }
  return merged as T;
}
