/** 持有浏览器跨窗口锁直到请求处理结束；渲染进程销毁时由 Chromium 释放。 */
export async function acquireMessageSendLock(
  sessionVersion: number, ownerId: number, sessionUnitId: string, clientMessageId: string,
): Promise<() => void> {
  if (!Number.isSafeInteger(sessionVersion) || sessionVersion < 0 || !Number.isSafeInteger(ownerId) || ownerId <= 0 ||
      !sessionUnitId || !clientMessageId) throw new Error('消息发送锁参数无效');
  if (typeof navigator === 'undefined' || !navigator.locks) throw new Error('当前环境不支持跨窗口发送协调');
  // 不使用认证代次作为锁键：同一账号重新登录后旧请求可能仍在飞行中。
  const name = `gotoim-send:${JSON.stringify([ownerId, sessionUnitId, clientMessageId])}`;
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  let resolveReady!: (release: () => void) => void;
  let rejectReady!: (error: Error) => void;
  const ready = new Promise<() => void>((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  void navigator.locks.request(name, { mode: 'exclusive', ifAvailable: true }, async lock => {
    if (!lock) { rejectReady(new Error('该消息正在其他窗口发送')); return; }
    resolveReady(release);
    await held;
  }).catch(error => rejectReady(error instanceof Error ? error : new Error('无法获取消息发送锁')));
  return ready;
}
