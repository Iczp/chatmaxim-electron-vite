import { watch } from 'vue';
import { apiV2 } from '../apis/v2';
import { clearSession } from '../apis/auth/TokenController';
import { eventBus } from '../commons/eventBus';
import { useImStore } from '../stores/imStore';
import { useRealtimeStore } from '../stores/realtimeStore';
import { useWindowStore } from '../stores/windowStore';
import { appEvent, AppEvents } from '../ipc/appEvent';
import { signalRClient, RealtimeEnvelope } from './signalrClient';
import { SessionRefreshQueue } from './sessionRefreshQueue';
import {
  isAiCommand,
  isMessageCommand,
  isSignalRCommand,
  SignalRCommand,
} from './commands';

let started = false;
let clientHandlerRegistered = false;
let statusWatchInstalled = false;
const isMainWindow = (): boolean => {
  const windowStore = useWindowStore();
  return windowStore.name === 'main';
};

const sessionOwnerHints = new Map<string, number>();
const sessionRefreshQueue = new SessionRefreshQueue(async (sessionUnitId, isCurrent) => {
  const detail = await apiV2.sessions.friend(sessionUnitId);
  if (!isCurrent() || !detail) return;
  const store = useImStore();
  const ownerId = detail.ownerId ?? store.getSessionUnit(sessionUnitId)?.ownerId ?? sessionOwnerHints.get(sessionUnitId);
  sessionOwnerHints.delete(sessionUnitId);
  if (ownerId != null) store.setMany([{ ...detail, id: detail.id || sessionUnitId, ownerId }]);
  // 汇总角标同样来自服务端，不能按可能重复或乱序的通知自行累加。
  store.getBadgeByCurrentUser();
}, error => console.warn('[realtime] refresh session failed', error));

const debouncedRefreshSession = (sessionUnitId: string, ownerId?: number) => {
  if (ownerId != null && ownerId > 0) sessionOwnerHints.set(sessionUnitId, ownerId);
  sessionRefreshQueue.schedule(sessionUnitId);
};

const refreshPresence = async () => {
  const store = useRealtimeStore();
  try {
    const [friends, devices] = await Promise.all([
      apiV2.presence.onlineFriends(),
      apiV2.presence.myDevices(),
    ]);
    store.setPresenceFromApi(friends?.items || []);
    store.setMyDevices(devices?.items || []);
    eventBus.emit('presence' as any, null as any);
  } catch (error) {
    console.warn('[realtime] refresh presence failed', error);
  }
};

const handleKicked = async (payload: any) => {
  const reason =
    (payload && (payload.reason ?? payload.Reason)) || '账号已在其它设备退出登录';
  eventBus.emit('session:kicked' as any, { reason } as any);
  await clearSession(`kicked:${reason}`);
  await signalRClient.stop();
};

const handleMessageCommand = (envelope: RealtimeEnvelope) => {
  const message = envelope.payload;
  const scopes = envelope.scopes || [];
  scopes.forEach(scope => {
    if (scope.sessionUnitId) debouncedRefreshSession(scope.sessionUnitId, scope.chatObjectId);
  });
  // 保持旧事件契约：Chat.vue 监听 'chat' 后按需 fetchLatest
  eventBus.emit('chat' as any, [envelope, message] as any);
};

/**
 * 处理一帧 SignalR 推送。
 * @param broadcast 仅主窗口为 true：处理完再广播给其它窗口
 */
export const dispatchEnvelope = async (
  envelope: RealtimeEnvelope,
  broadcast: boolean,
): Promise<void> => {
  if (!envelope?.command || !isSignalRCommand(envelope.command)) {
    if (envelope?.command) {
      console.debug('[realtime] unknown command', envelope.command);
    }
    return;
  }
  const command = envelope.command as SignalRCommand;
  const store = useImStore();
  try {
    if (isMessageCommand(command)) {
      if (command === SignalRCommand.MessageRollbacked) eventBus.emit('messageMutation', envelope);
      handleMessageCommand(envelope);
    } else if (isAiCommand(command)) {
      eventBus.emit('ai' as any, [command, envelope.payload] as any);
    } else {
      switch (command) {
        case SignalRCommand.MessageBadgeUpdated:
          (envelope.scopes || []).forEach(scope => {
            if (scope.sessionUnitId) debouncedRefreshSession(scope.sessionUnitId, scope.chatObjectId);
          });
          store.getBadgeByCurrentUser();
          eventBus.emit('session:updated' as any, envelope.scopes as any);
          break;
        case SignalRCommand.MessageDeleted:
          eventBus.emit('messageMutation', envelope);
          // 同时刷新对应会话详情和角标。
        case SignalRCommand.SessionUnitChanged: {
          const scopes = envelope.scopes || [];
          scopes.forEach(scope => {
            if (scope.sessionUnitId) debouncedRefreshSession(scope.sessionUnitId, scope.chatObjectId);
          });
          const payloadUnit = (envelope.payload as any)?.sessionUnitId;
          if (payloadUnit) debouncedRefreshSession(payloadUnit);
          store.getBadgeByCurrentUser();
          eventBus.emit('session:updated' as any, envelope.scopes as any);
          break;
        }
        case SignalRCommand.OnlineFriend:
          useRealtimeStore().setFriendPresence(envelope.payload, true);
          eventBus.emit('presence' as any, envelope.payload as any);
          break;
        case SignalRCommand.OfflineFriend:
          useRealtimeStore().setFriendPresence(envelope.payload, false);
          eventBus.emit('presence' as any, envelope.payload as any);
          break;
        case SignalRCommand.OnlineMe:
        case SignalRCommand.OfflineMe:
          void refreshPresence();
          break;
        case SignalRCommand.Kicked:
          void handleKicked(envelope.payload);
          break;
        case SignalRCommand.Welcome:
        default:
          break;
      }
    }
  } catch (error) {
    console.error('[realtime] dispatch failed', command, error);
  }

  if (broadcast) {
    void appEvent.broadcast(AppEvents.realtimeEvent, envelope);
  }
};

const broadcastStatus = () => {
  const realtimeStore = useRealtimeStore();
  realtimeStore.setStatus({
    state: signalRClient.state.value,
    connectionId: signalRClient.connectionId.value,
    netDelay: signalRClient.netDelay.value,
    lastError: signalRClient.lastError.value,
  });
  if (isMainWindow()) {
    void appEvent.broadcast(AppEvents.realtimeStatus, {
      state: realtimeStore.state,
      connectionId: realtimeStore.connectionId,
      netDelay: realtimeStore.netDelay,
      lastError: realtimeStore.lastError,
    });
  }
};

/**
 * 每个窗口都安装：子窗口消费主窗口广播的实时事件。
 */
export const installRealtimeBridge = (): void => {
  if (!started) {
    started = true;
    appEvent.on(AppEvents.realtimeEvent, payload => {
      const envelope = payload.args?.[0] as RealtimeEnvelope;
      if (envelope && !isMainWindow()) {
        void dispatchEnvelope(envelope, false);
      }
    });
    appEvent.on(AppEvents.realtimeStatus, payload => {
      if (!isMainWindow()) {
        const realtime = useRealtimeStore();
        const wasConnected = realtime.state === 'connected';
        realtime.setStatus(payload.args?.[0] || {});
        if (!wasConnected && realtime.state === 'connected') eventBus.emit('connected', undefined);
      }
    });
    appEvent.on(AppEvents.sessionUpdated, () => {
      if (!isMainWindow()) {
        useImStore().getBadgeByCurrentUser();
      }
    });
    started = true;
  }
  if (!statusWatchInstalled) {
    statusWatchInstalled = true;
    watch(
      [signalRClient.state, signalRClient.connectionId, signalRClient.netDelay, signalRClient.lastError],
      broadcastStatus,
      { immediate: true },
    );
    watch(signalRClient.state, (state, previous) => {
      if (state !== 'connected' || previous === 'connected' || !isMainWindow()) return;
      eventBus.emit('connected', undefined);
      void refreshPresence();
      useImStore().getBadgeByCurrentUser();
    }, { flush: 'sync' });
  }
};

const waitForWindowInit = async (timeoutMs = 4000): Promise<void> => {
  const windowStore = useWindowStore();
  const startedAt = Date.now();
  while (!windowStore.name && Date.now() - startedAt < timeoutMs) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

/**
 * 仅主窗口调用：建立唯一 SignalR 连接。
 */
export const startRealtime = async (): Promise<void> => {
  installRealtimeBridge();
  // Home 挂载可能早于主进程的 window init 事件，先等 name/machineId 就绪
  await waitForWindowInit();
  const realtimeStore = useRealtimeStore();
  realtimeStore.isOwner = isMainWindow();
  if (!isMainWindow()) {
    return;
  }
  if (!clientHandlerRegistered) {
    clientHandlerRegistered = true;
    signalRClient.onMessage(envelope => {
      void dispatchEnvelope(envelope, true);
    });
  }
  try {
    await signalRClient.start();
  } catch (error) {
    console.error('[realtime] start failed', error);
  }
};

export const stopRealtime = async (): Promise<void> => {
  sessionRefreshQueue.cancelAll();
  sessionOwnerHints.clear();
  if (isMainWindow()) {
    await signalRClient.stop();
  }
  useRealtimeStore().clearPresence();
};

export const useRealtime = () => ({
  state: signalRClient.state,
  connectionId: signalRClient.connectionId,
  netDelay: signalRClient.netDelay,
  lastError: signalRClient.lastError,
  start: startRealtime,
  stop: stopRealtime,
  refreshPresence,
});
