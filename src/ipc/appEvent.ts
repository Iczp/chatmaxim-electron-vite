import { ipcRenderer } from 'electron';

/**
 * 渲染进程侧的多窗口消息总线封装。
 * 与 `electron/main/commons/messageHub.ts` 一一对应。
 */

export const APP_EVENT_CHANNEL = 'app-event';

export type AppEventPayload = {
  event: string;
  args?: any[];
  callerId?: number;
  callerName?: string;
  ticks: number;
};

type Handler = (payload: AppEventPayload) => void;

const handlers = new Map<string, Set<Handler>>();
const anyHandlers = new Set<Handler>();

const dispatch = (_: Electron.IpcRendererEvent, payload: AppEventPayload) => {
  if (!payload || !payload.event) return;
  // 忽略自己发出的消息，避免回环（主进程已按 sender 过滤，此处兜底）
  handlers.get(payload.event)?.forEach(handler => {
    try {
      handler(payload);
    } catch (error) {
      console.error(`[app-event] handler error:${payload.event}`, error);
    }
  });
  anyHandlers.forEach(handler => {
    try {
      handler(payload);
    } catch (error) {
      console.error(`[app-event] any handler error:${payload.event}`, error);
    }
  });
};

let installed = false;

export const install = (): void => {
  if (installed) return;
  installed = true;
  ipcRenderer.on(APP_EVENT_CHANNEL, dispatch);
};

export const uninstall = (): void => {
  if (!installed) return;
  installed = false;
  ipcRenderer.off(APP_EVENT_CHANNEL, dispatch);
  handlers.clear();
  anyHandlers.clear();
};

export const on = (event: string, handler: Handler): (() => void) => {
  install();
  if (!handlers.has(event)) {
    handlers.set(event, new Set());
  }
  handlers.get(event)!.add(handler);
  return () => off(event, handler);
};

export const onAny = (handler: Handler): (() => void) => {
  install();
  anyHandlers.add(handler);
  return () => anyHandlers.delete(handler);
};

export const off = (event: string, handler?: Handler): void => {
  if (!handler) {
    handlers.delete(event);
    return;
  }
  handlers.get(event)?.delete(handler);
};

const invoke = (request: Record<string, any>): Promise<any> =>
  ipcRenderer.invoke(APP_EVENT_CHANNEL, request);

export const broadcast = (event: string, ...args: any[]): Promise<any> =>
  invoke({ action: 'broadcast', event, args });

export const sendToMain = (event: string, ...args: any[]): Promise<any> =>
  invoke({ action: 'to-main', event, args });

export const sendToWindow = (target: string | number, event: string, ...args: any[]): Promise<any> =>
  invoke({ action: 'to-window', target, event, args });

export const getWindows = (): Promise<Array<{ id: number; name?: string; focused: boolean }>> =>
  invoke({ action: 'windows' });

export const focusWindow = (target: string | number): Promise<any> =>
  invoke({ action: 'focus', target });

export const ready = (name: string): Promise<any> => invoke({ action: 'window-ready', args: [name] });

export const appEvent = {
  install,
  uninstall,
  on,
  onAny,
  off,
  broadcast,
  sendToMain,
  sendToWindow,
  getWindows,
  focusWindow,
  ready,
};

/** 常用事件名，避免拼写漂移 */
export const AppEvents = {
  realtimeEvent: 'realtime:event',
  realtimeStatus: 'realtime:status',
  sessionUpdated: 'session:updated',
  messageUpdated: 'message:updated',
  presenceUpdated: 'presence:updated',
  ownerSwitched: 'owner:switched',
  themeChanged: 'theme:changed',
  languageChanged: 'language:changed',
  windowReady: 'window:ready',
  windowFocus: 'window:focus',
  requestSendMessage: 'chat:request_send',
  authChanged: 'auth:changed',
} as const;
