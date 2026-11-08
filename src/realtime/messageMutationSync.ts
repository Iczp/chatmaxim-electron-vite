import type { MessageDto } from '../apis/dtos';
import type { MessageChangePage, MessageChangeState, MessageChangesInput } from '../apis/v2';

type MessageChangesApi = {
  changes(input: MessageChangesInput): PromiseLike<MessageChangePage[]>;
  syncItems(input: { sessionUnitId: string; messageIds: number[] }): PromiseLike<MessageChangeState[]>;
};

/** 当前聊天已加载消息的变更同步。游标与状态仅保留在内存；持久化接入后须事务提交。 */
export class MessageMutationSync {
  private cursor: string | null = null;
  private states = new Map<number, MessageChangeState>();
  private inFlight: Promise<void> | null = null;
  private requested = false;

  constructor(
    private readonly sessionUnitId: string,
    private readonly api: MessageChangesApi,
    private readonly getMessages: () => MessageDto[],
    private readonly setMessages: (messages: MessageDto[]) => void,
  ) {}

  applyKnown(messages: MessageDto[]): MessageDto[] {
    return messages.flatMap(message => {
      if (message.id == null) return [message];
      const state = this.states.get(message.id);
      if (!state) return [message];
      if (state.isDeleted) return [];
      if (state.isRollbacked || state.rollbackTime) {
        return [{ ...message, isRollbacked: true, rollbackTime: state.rollbackTime ?? message.rollbackTime }];
      }
      return [message];
    });
  }

  sync(): Promise<void> {
    this.requested = true;
    if (this.inFlight) return this.inFlight;
    const task = (async () => {
      do {
        this.requested = false;
        await this.syncOnce();
      } while (this.requested);
    })();
    this.inFlight = task;
    void task.finally(() => { if (this.inFlight === task) this.inFlight = null; }).catch(() => {});
    return task;
  }

  private apply(states: MessageChangeState[]): void {
    for (const state of states) {
      const id = Number(state.messageId);
      if (!Number.isSafeInteger(id) || id <= 0 || !/^\d+$/.test(String(state.syncVersion))) {
        throw new Error('消息变更缺少有效标识或版本');
      }
    }
    for (const state of states) {
      const id = Number(state.messageId);
      const versionText = String(state.syncVersion);
      const previous = this.states.get(id);
      if (!previous || BigInt(versionText) > BigInt(String(previous.syncVersion))) {
        this.states.set(id, state);
      }
    }
    this.setMessages(this.applyKnown(this.getMessages()));
  }

  private async syncOnce(): Promise<void> {
    let snapshotCursor: string | null = null;
    let resets = 0;
    for (let pageNumber = 0; pageNumber < 1000; pageNumber++) {
      const pages = await this.api.changes({
        sessions: [{ sessionUnitId: this.sessionUnitId, cursor: this.cursor, snapshotCursor }],
      });
      if (pages.length !== 1 || pages[0].sessionUnitId !== this.sessionUnitId || pages[0].errorCode) {
        throw new Error('消息变更同步响应的会话不匹配或不可同步');
      }
      const page = pages[0];
      const next = page.nextCursor?.toString();
      if (!next) throw new Error('消息变更同步缺少游标');
      if (page.resetRequired) {
        if (++resets > 2) throw new Error('消息变更同步基线反复重置');
        const ids = [...new Set(this.getMessages().map(x => x.id).filter((id): id is number =>
          id != null && Number.isSafeInteger(id) && id > 0))];
        for (let offset = 0; offset < ids.length; offset += 200) {
          const batch = ids.slice(offset, offset + 200);
          const states = await this.api.syncItems({ sessionUnitId: this.sessionUnitId, messageIds: batch });
          if (states.some(row => !batch.includes(Number(row.messageId)))) {
            throw new Error('消息校准包含未请求的消息');
          }
          this.apply(states);
        }
        this.cursor = next;
        snapshotCursor = null;
        continue;
      }
      const changes = page.items || [];
      if (changes.some(row => ![1, 2, 'Rollback', 'Delete'].includes(row.changeType as number | string))) {
        throw new Error('不支持的消息变更类型');
      }
      if (changes.some(row => [2, 'Delete'].includes(row.changeType as number | string)
        ? row.isDeleted !== true : !(row.isRollbacked || row.rollbackTime))) {
        throw new Error('消息变更缺少有效状态');
      }
      if (page.hasMore && (!page.snapshotCursor || next === this.cursor)) {
        throw new Error('消息变更分页边界无效');
      }
      this.apply(changes);
      this.cursor = next;
      if (!page.hasMore) return;
      snapshotCursor = page.snapshotCursor ?? null;
    }
    throw new Error('消息变更页数超过上限');
  }
}
