import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  HttpTransportType,
  IRetryPolicy,
  LogLevel,
  RetryContext,
} from '@microsoft/signalr';
import { ref, Ref } from 'vue';
import { env } from '../env';
import { getToken } from '../apis/auth/TokenController';
import { useWindowStore } from '../stores/windowStore';
import { version } from '../../package.json';

export type RealtimeState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export type RealtimeEnvelope = {
  command: string;
  scopes?: Array<{ chatObjectId?: number; sessionUnitId?: string }>;
  payload?: any;
  [key: string]: any;
};

type MessageHandler = (envelope: RealtimeEnvelope) => void;

class RetryPolicy implements IRetryPolicy {
  constructor(private readonly delays: number[]) {}

  nextRetryDelayInMilliseconds(context: RetryContext): number {
    const index = Math.min(context.previousRetryCount, this.delays.length - 1);
    return this.delays[index] ?? 30000;
  }
}

const trimEndSlash = (value: string): string => value.replace(/\/+$/, '');

/**
 * SignalR 客户端（单例）。
 *
 * 仅主窗口调用 start()；子窗口只监听 app-event 广播。
 */
class SignalRClient {
  public readonly state: Ref<RealtimeState> = ref('disconnected');
  public readonly connectionId = ref<string | null>(null);
  public readonly netDelay = ref<number | null>(null);
  public readonly lastError = ref<string | null>(null);
  public readonly lastReceivedAt = ref<number | null>(null);

  private connection: HubConnection | null = null;
  private handlers = new Set<MessageHandler>();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  private startPromise: Promise<void> | null = null;
  private explicitlyStopped = true;

  get hubUrl(): string {
    const explicit = env.chat_hub_url;
    if (explicit) return explicit;
    return `${trimEndSlash(env.signalr_base_url)}/${env.signalr_hub_path.replace(/^\/+/, '')}`;
  }

  private buildUrl(): string {
    const windowStore = useWindowStore();
    const url = new URL(this.hubUrl);
    const params: Record<string, string> = {
      appId: env.app_id,
      appName: env.app_name,
      deviceId: windowStore.machineId || '',
      deviceType: env.device_type,
      pushClientId: '',
      brand: '',
      model: '',
      deviceBrand: '',
      deviceModel: '',
      platform: process.platform,
      browser: `Electron/${version}`,
    };
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private emit(envelope: RealtimeEnvelope) {
    this.lastReceivedAt.value = Date.now();
    this.handlers.forEach(handler => {
      try {
        handler(envelope);
      } catch (error) {
        console.error('[realtime] handler error', error);
      }
    });
  }

  private buildConnection(): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(this.buildUrl(), {
        accessTokenFactory: async () => {
          const token = await getToken();
          return token?.access_token || '';
        },
        skipNegotiation: env.signalr_skip_negotiation,
        transport: env.signalr_skip_negotiation ? HttpTransportType.WebSockets : undefined,
      })
      .withAutomaticReconnect(new RetryPolicy(env.signalr_reconnect_delays))
      .configureLogging(LogLevel.Warning)
      .build();

    // 保持高频 ping 保活（默认 10s），放宽服务端超时容忍窗口（默认 60s），防止偶发抖动误触发 Server timeout 强拆连接
    connection.keepAliveIntervalInMilliseconds = env.signalr_keep_alive_ms;
    connection.serverTimeoutInMilliseconds = env.signalr_server_timeout_ms;

    connection.on('ReceivedMessage', (...args: any[]) => {
      if (this.connection !== connection || this.explicitlyStopped) return;
      const value = args.length === 1 ? args[0] : args;
      const envelope: RealtimeEnvelope =
        typeof value === 'string'
          ? (() => {
              try {
                return JSON.parse(value);
              } catch {
                return { command: '', payload: value };
              }
            })()
          : (value as RealtimeEnvelope);
      if (!envelope || !envelope.command) {
        return;
      }
      this.emit(envelope);
    });

    connection.onreconnecting(error => {
      if (this.connection !== connection || this.explicitlyStopped) return;
      this.state.value = 'reconnecting';
      this.stopHeartbeat();
      this.lastError.value = error?.message || String(error ?? '');
      console.warn('[realtime] reconnecting', error);
    });

    connection.onreconnected(connectionId => {
      if (this.connection !== connection || this.explicitlyStopped) return;
      this.connectionId.value = connectionId ?? null;
      this.state.value = 'connected';
      this.lastError.value = null;
      this.startHeartbeat();
      console.log('[realtime] reconnected', connectionId);
    });

    connection.onclose(error => {
      if (this.connection !== connection || this.explicitlyStopped) return;
      this.state.value = 'disconnected';
      this.connectionId.value = null;
      this.stopHeartbeat();
      if (error) {
        this.lastError.value = error.message || String(error);
        console.warn('[realtime] closed', error);
      }
      if (!this.explicitlyStopped) {
        this.scheduleRestart();
      }
    });

    return connection;
  }

  async start(): Promise<void> {
    if (this.startPromise) return this.startPromise;
    if (
      this.connection &&
      (this.connection.state === HubConnectionState.Connected ||
        this.connection.state === HubConnectionState.Connecting ||
        this.connection.state === HubConnectionState.Reconnecting)
    ) {
      return;
    }
    this.explicitlyStopped = false;
    this.clearRestartTimer();
    this.state.value = 'connecting';
    const connection = this.buildConnection();
    this.connection = connection;
    const task = (async () => {
      try {
        await connection.start();
        if (this.connection !== connection || this.explicitlyStopped) {
          // 停止期间迟到的 start 不能复活旧连接。
          await connection.stop();
          throw new Error('signalr_start_cancelled');
        }
        this.connectionId.value = connection.connectionId ?? null;
        this.state.value = 'connected';
        this.lastError.value = null;
        this.startHeartbeat();
        console.log('[realtime] connected', this.connectionId.value, this.hubUrl);
      } catch (error: any) {
        if (this.connection === connection && !this.explicitlyStopped) {
          this.state.value = 'disconnected';
          this.lastError.value = error?.message || String(error);
          console.error('[realtime] connect failed', error);
          // 首次连接失败不会触发自动重连。
          this.scheduleRestart();
        }
        throw error;
      }
    })();
    this.startPromise = task;
    void task.finally(() => {
      if (this.startPromise === task) this.startPromise = null;
    }).catch(() => {});
    return task;
  }

  async stop(): Promise<void> {
    this.explicitlyStopped = true;
    this.startPromise = null;
    this.clearRestartTimer();
    this.stopHeartbeat();
    const connection = this.connection;
    this.connection = null;
    this.state.value = 'disconnected';
    this.connectionId.value = null;
    if (connection) {
      try {
        await connection.stop();
      } catch (error) {
        console.warn('[realtime] stop failed', error);
      }
    }
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  async invoke<T = any>(method: string, ...args: any[]): Promise<T | null> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      return null;
    }
    try {
      return (await this.connection.invoke(method, ...args)) as T;
    } catch (error) {
      console.warn(`[realtime] invoke ${method} failed`, error);
      return null;
    }
  }

  private scheduleRestart() {
    this.clearRestartTimer();
    this.restartTimer = setTimeout(() => {
      if (!this.explicitlyStopped) {
        // start 内部负责调度重试，过期任务不能为新连接额外创建重试。
        this.start().catch(() => {});
      }
    }, 5000);
  }

  private clearRestartTimer() {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    const interval = Math.max(5, env.presence_heartbeat_seconds) * 1000;
    const tick = async () => {
      if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
        return;
      }
      const connection = this.connection;
      const ticks = Date.now();
      try {
        await connection.invoke('Heartbeat', ticks);
        if (this.connection === connection && !this.explicitlyStopped) {
          this.netDelay.value = Date.now() - ticks;
        }
      } catch (error) {
        console.warn('[realtime] heartbeat failed', error);
      }
    };
    void tick();
    this.heartbeatTimer = setInterval(tick, interval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this.netDelay.value = null;
  }
}

export const signalRClient = new SignalRClient();
