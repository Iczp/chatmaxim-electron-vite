/** 合并同一会话的实时通知，旧请求返回时若有新通知则丢弃旧结果并补跑。 */
export class SessionRefreshQueue {
  private readonly entries = new Map<string, {
    version: number;
    timer?: ReturnType<typeof setTimeout>;
    running: boolean;
    dirty: boolean;
    cancelled: boolean;
  }>();

  constructor(
    private readonly refresh: (id: string, isCurrent: () => boolean) => Promise<void>,
    private readonly onError: (error: unknown) => void,
    private readonly delayMs = 400,
  ) {}

  schedule(id: string): void {
    if (!id) return;
    let entry = this.entries.get(id);
    if (!entry) {
      entry = { version: 0, running: false, dirty: false, cancelled: false };
      this.entries.set(id, entry);
    }
    entry.version++;
    entry.dirty = true;
    if (entry.running) return;
    if (entry.timer) clearTimeout(entry.timer);
    const current = entry;
    current.timer = setTimeout(() => {
      current.timer = undefined;
      void this.run(id, current);
    }, this.delayMs);
  }

  cancelAll(): void {
    for (const entry of this.entries.values()) {
      entry.cancelled = true;
      if (entry.timer) clearTimeout(entry.timer);
    }
    this.entries.clear();
  }

  private async run(id: string, entry: NonNullable<ReturnType<typeof this.entries.get>>): Promise<void> {
    if (entry.cancelled || entry.running) return;
    entry.running = true;
    try {
      while (entry.dirty && !entry.cancelled) {
        entry.dirty = false;
        const version = entry.version;
        try {
          await this.refresh(id, () => !entry.cancelled && entry.version === version);
        } catch (error) {
          if (!entry.cancelled) this.onError(error);
        }
      }
    } finally {
      entry.running = false;
      if (this.entries.get(id) === entry) this.entries.delete(id);
    }
  }
}
