import { BrowserWindow, WebContents } from 'electron';
import { windowManager } from './windowManager';

/**
 * 统一的多窗口消息总线。
 *
 * 设计原则（对齐新客户端 WindowMessenger 的“单连接 + 统一分发”）：
 * 1. 只有主窗口持有 SignalR 长连接；
 * 2. 主窗口收到推送后通过本总线广播给其它窗口；
 * 3. 子窗口的写操作通过 `to-main` 交给主窗口代理；
 * 4. 所有消息都带 callerId / callerName / ticks，便于去重与排查。
 */

export const APP_EVENT_CHANNEL = 'app-event';

export type AppEventMessage = {
  event: string;
  args?: any[];
  callerId?: number;
  callerName?: string;
  ticks: number;
};

export type WindowInfo = {
  id: number;
  name?: string;
  focused: boolean;
  visible: boolean;
  destroyed: boolean;
};

const toInfo = (win: BrowserWindow): WindowInfo => ({
  id: win.id,
  name: windowManager.getNameById(win.id),
  focused: win.isFocused(),
  visible: win.isVisible(),
  destroyed: win.isDestroyed(),
});

const send = (win: BrowserWindow | undefined, payload: AppEventMessage) => {
  if (!win || win.isDestroyed()) {
    return false;
  }
  win.webContents.send(APP_EVENT_CHANNEL, payload);
  return true;
};

const resolveWindow = (target?: string | number): BrowserWindow | undefined => {
  if (target === undefined || target === null || target === '') {
    return undefined;
  }
  if (typeof target === 'number') {
    return BrowserWindow.getAllWindows().find(x => x.id === target);
  }
  if (target === 'main' || target === '$main') {
    return windowManager.getMain();
  }
  if (target === 'login') {
    return windowManager.getLogin();
  }
  return windowManager.get(target);
};

export const messageHub = {
  /**
   * 广播给除 sender 外的所有窗口。
   */
  broadcast(event: string, args: any[] = [], sender?: WebContents | number): number {
    const senderId = typeof sender === 'number' ? sender : sender?.id;
    const payload: AppEventMessage = {
      event,
      args,
      callerId: senderId,
      callerName: senderId ? windowManager.getNameById(senderId) : undefined,
      ticks: Date.now(),
    };
    let count = 0;
    for (const [, win] of windowManager.getAllWindows()) {
      if (senderId && win.id === senderId) {
        continue;
      }
      if (!win.isDestroyed()) {
        if (send(win, payload)) count++;
      }
    }
    return count;
  },

  /**
   * 广播给所有活动窗口（包括主窗口、所有子窗口与托盘），不排除任何窗口。
   */
  broadcastAll(event: string, args: any[] = []): number {
    const payload: AppEventMessage = {
      event,
      args,
      callerName: 'main',
      ticks: Date.now(),
    };
    let count = 0;
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) {
        if (send(win, payload)) count++;
      }
    }
    return count;
  },

  /**
   * 子窗口 -> 主窗口。
   */
  toMain(event: string, args: any[] = [], sender?: WebContents | number): boolean {
    const senderId = typeof sender === 'number' ? sender : sender?.id;
    return send(windowManager.getMain(), {
      event,
      args,
      callerId: senderId,
      callerName: senderId ? windowManager.getNameById(senderId) : undefined,
      ticks: Date.now(),
    });
  },

  /**
   * 定向发送到某个窗口（名称或 id）。
   */
  toWindow(target: string | number, event: string, args: any[] = [], sender?: WebContents | number): boolean {
    const senderId = typeof sender === 'number' ? sender : sender?.id;
    return send(resolveWindow(target), {
      event,
      args,
      callerId: senderId,
      callerName: senderId ? windowManager.getNameById(senderId) : undefined,
      ticks: Date.now(),
    });
  },

  /**
   * 当前窗口注册表，用于子窗口初始化时申请状态同步。
   */
  windows(): WindowInfo[] {
    return BrowserWindow.getAllWindows()
      .filter(x => !x.isDestroyed())
      .map(toInfo);
  },

  focus(target: string | number): boolean {
    const win = resolveWindow(target);
    if (!win || win.isDestroyed()) return false;
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
    return true;
  },

  /**
   * 通知所有窗口某个窗口已就绪（新窗口可据此拉取缺失状态）。
   */
  windowReady(name?: string): void {
    messageHub.broadcast('window:ready', [{ name, windows: messageHub.windows() }]);
  },
};
