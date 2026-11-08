import type { MessageDto } from '../apis/dtos';
import type { MessageChangePage, MessageChangeState, MessageChangesInput } from '../apis/v2';

type MessageChangesApi = {
  changes(input: MessageChangesInput): PromiseLike<MessageChangePage[]>;
  syncItems(input: { sessionUnitId: string; messageIds: number[] }): PromiseLike<MessageChangeState[]>;
};

export type MutationStore = {
  readCursor(): Promise<string | null>;
  readIds(after: number, limit: number): Promise<number[]>;
  apply(states: MessageChangeState[], cursor: string | null, calibration: boolean): Promise<void>;
  readMessages(ids: number[]): Promise<MessageDto[]>;
};

/** 当前聊天消息的变更同步；有本地账号时将变更和游标原子持久化。 */
export class MessageMutationSync {
  private cursor: string | null = null;
  private states = new Map<number, MessageChangeState>();
  private inFlight: Promise<void> | null = null;
  private requested = false;
  private store: MutationStore | null = null;

  constructor(
    private readonly sessionUnitId: string,
    private readonly api: MessageChangesApi,
    private readonly getMessages: () => MessageDto[],
    private readonly setMessages: (messages: MessageDto[]) => void,
    private readonly openStore?: () => Promise<MutationStore | null>,
    private readonly restoreMessages?: (messages: MessageDto[]) => void,
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
      return [{ ...message, isRollbacked: false, rollbackTime: null }];
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
    if (!this.store && this.openStore) {
      const store = await this.openStore();
      if (store) {
        this.cursor = await store.readCursor();
        this.store = store;
      }
    }
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
        const visibleIds = this.getMessages().map(x => x.id).filter((id): id is number =>
          id != null && Number.isSafeInteger(id) && id > 0);
        const seen = new Set<number>();
        const calibrate = async (batch: number[]) => {
          if (!batch.length) return;
          const states = await this.api.syncItems({ sessionUnitId: this.sessionUnitId, messageIds: batch });
          if (states.some(row => !batch.includes(Number(row.messageId)))) throw new Error('消息校准包含未请求的消息');
          if (this.store) await this.store.apply(states, null, true);
          this.apply(states);
          if (this.store && this.restoreMessages) {
            const restored = await this.store.readMessages(states.filter(row => !row.isDeleted).map(row => Number(row.messageId)));
            this.restoreMessages(restored);
          }
        };
        if (this.store) {
          let after = 0;
          while (true) {
            const ids = await this.store.readIds(after, 200);
            if (!ids.length) break;
            ids.forEach(id => seen.add(id));
            await calibrate(ids);
            after = ids[ids.length - 1];
            if (ids.length < 200) break;
          }
        }
        const remaining = [...new Set(visibleIds.filter(id => !seen.has(id)))];
        for (let offset = 0; offset < remaining.length; offset += 200) await calibrate(remaining.slice(offset, offset + 200));
        if (this.store) await this.store.apply([], next, false);
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
      if (this.store) await this.store.apply(changes, next, false);
      this.apply(changes);
      this.cursor = next;
      if (!page.hasMore) return;
      snapshotCursor = page.snapshotCursor ?? null;
    }
    throw new Error('消息变更页数超过上限');
  }
}
