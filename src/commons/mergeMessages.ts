import type { MessageDto } from '../apis/dtos';

/** 合并同一会话的消息；客户端和服务器标识都可匹配，保留已有列表键。 */
export function mergeMessages(
  existing: MessageDto[],
  incoming: MessageDto[],
  position: 'prepend' | 'append',
): MessageDto[] {
  const rows = existing.slice();
  const byServer = new Map<number, number>();
  const byClient = new Map<string, number>();
  const removed = new Set<number>();
  const newRows: MessageDto[] = [];
  const indexRow = (row: MessageDto, index: number) => {
    if (row.id != null) byServer.set(row.id, index);
    if (row.clientMessageId) byClient.set(row.clientMessageId, index);
  };
  rows.forEach(indexRow);
  for (const row of incoming) {
    const serverIndex = row.id != null ? byServer.get(row.id) : undefined;
    const clientIndex = row.clientMessageId ? byClient.get(row.clientMessageId) : undefined;
    const index = clientIndex ?? serverIndex;
    if (index === undefined) {
      const newIndex = rows.length;
      rows.push(row);
      newRows.push(row);
      indexRow(row, newIndex);
      continue;
    }
    const previous = rows[index];
    const duplicateIndex = serverIndex !== undefined && serverIndex !== index ? serverIndex : undefined;
    const duplicate = duplicateIndex === undefined ? undefined : rows[duplicateIndex];
    const merged = {
      ...previous,
      ...duplicate,
      ...row,
      scrollerKey: previous.scrollerKey || duplicate?.scrollerKey || row.scrollerKey,
      autoId: previous.autoId ?? duplicate?.autoId ?? row.autoId,
      clientMessageId: row.clientMessageId || previous.clientMessageId || duplicate?.clientMessageId,
    };
    rows[index] = merged;
    if (duplicateIndex !== undefined) removed.add(duplicateIndex);
    indexRow(merged, index);
    if (duplicate) indexRow(duplicate, index);
    const newPosition = newRows.indexOf(previous);
    if (newPosition !== -1) newRows[newPosition] = merged;
  }
  if (position === 'append') return rows.filter((_, index) => !removed.has(index));
  const existingCount = existing.length;
  return [...newRows.filter(row => !removed.has(rows.indexOf(row))),
    ...rows.slice(0, existingCount).filter((_, index) => !removed.has(index))];
}
