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

    // 5s keep-alive / 15s server timeout，与后端及新客户端一致
    connection.keepAliveIntervalInMilliseconds = 5000;
    connection.serverTimeoutInMilliseconds = 15000;

    connection.on('ReceivedMessage', (...args: any[]) => {
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
      this.state.value = 'reconnecting';
      this.stopHeartbeat();
      this.lastError.value = error?.message || String(error ?? '');
      console.warn('[realtime] reconnecting', error);
    });

    connection.onreconnected(connectionId => {
      this.connectionId.value = connectionId ?? null;
      this.state.value = 'connected';
      this.lastError.value = null;
      this.startHeartbeat();
      console.log('[realtime] reconnected', connectionId);
    });

    connection.onclose(error => {
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
    this.startPromise = (async () => {
      this.explicitlyStopped = false;
      this.clearRestartTimer();
      this.state.value = 'connecting';
      this.connection = this.buildConnection();
      try {
        await this.connection.start();
        this.connectionId.value = this.connection.connectionId ?? null;
        this.state.value = 'connected';
        this.lastError.value = null;
        this.startHeartbeat();
        console.log('[realtime] connected', this.connectionId.value, this.hubUrl);
      } catch (error: any) {
        this.state.value = 'disconnected';
        this.lastError.value = error?.message || String(error);
        console.error('[realtime] connect failed', error);
        // 首次连接失败不会触发 withAutomaticReconnect，这里自行退避重试
        this.scheduleRestart();
        throw error;
      } finally {
        this.startPromise = null;
      }
    })();
    return this.startPromise;
  }

  async stop(): Promise<void> {
    this.explicitlyStopped = true;
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
        this.start().catch(() => this.scheduleRestart());
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
      const ticks = Date.now();
      try {
        await this.connection.invoke('Heartbeat', ticks);
        this.netDelay.value = Date.now() - ticks;
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
