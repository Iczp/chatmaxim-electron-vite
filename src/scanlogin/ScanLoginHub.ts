import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  HttpTransportType,
  LogLevel,
} from '@microsoft/signalr';
import { env } from '../env';
import { getClientCredentialsToken } from '../apis/auth/TokenController';
import { useWindowStore } from '../stores/windowStore';

export type ScanLoginChallenge = {
  scanText: string;
  expiredTime?: number;
};

export type ScanLoginEvent = {
  command: 'scanned' | 'granted' | 'rejected' | 'cancelled' | string;
  payload: any;
  scanToken?: string;
  scanUserName?: string;
};

type Listener = (event: ScanLoginEvent) => void;

/**
 * PC 端扫码登录 Hub。
 *
 * 协议（与 GotoIM 新客户端一致）：
 * 1. client_credentials(scope=IM) 连接 /scan-login/hub；
 * 2. invoke('Generate', state) 生成二维码内容；
 * 3. 监听 ReceivedMessage: scanned / granted / rejected / cancelled；
 * 4. granted.payload.scanToken 交给 /connect/token 换正式 Token。
 */
class ScanLoginHub {
  private connection: HubConnection | null = null;
  private listeners = new Set<Listener>();
  private connectPromise: Promise<void> | null = null;

  private buildUrl(): string {
    const windowStore = useWindowStore();
    const url = new URL(env.scan_login_hub_url);
    const params: Record<string, string> = {
      appId: env.app_id,
      appName: env.app_name,
      deviceId: windowStore.machineId || '',
      deviceType: env.device_type,
      pushClientId: '',
      brand: '',
      model: '',
      platform: process.platform,
      browser: 'Electron',
    };
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  }

  onEvent(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  get isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;
    if (this.connectPromise) return this.connectPromise;
    this.connectPromise = (async () => {
      const token = await getClientCredentialsToken({
        cacheKey: 'scan-login',
        clientId: env.scan_login_client_id,
        clientSecret: env.scan_login_client_secret,
        scope: env.scan_login_scope,
      });
      await this.stop();
      const connection = new HubConnectionBuilder()
        .withUrl(this.buildUrl(), {
          accessTokenFactory: async () => token,
          skipNegotiation: env.signalr_skip_negotiation,
          transport: env.signalr_skip_negotiation ? HttpTransportType.WebSockets : undefined,
        })
        .configureLogging(LogLevel.Warning)
        .build();
      connection.on('ReceivedMessage', (...args: any[]) => {
        const value = args.length === 1 ? args[0] : args;
        const envelope = typeof value === 'string' ? JSON.parse(value) : value;
        if (!envelope?.command) return;
        const payload = envelope.payload || {};
        const event: ScanLoginEvent = {
          command: envelope.command,
          payload,
          scanToken: payload.scanToken ?? payload.ScanToken,
          scanUserName:
            payload.scanUserName ??
            payload.ScanUserName ??
            payload.userName ??
            payload.UserName,
        };
        this.listeners.forEach(listener => {
          try {
            listener(event);
          } catch (error) {
            console.error('[scan-login] listener error', error);
          }
        });
      });
      this.connection = connection;
      await connection.start();
      console.log('[scan-login] connected', env.scan_login_hub_url);
    })().finally(() => {
      this.connectPromise = null;
    });
    return this.connectPromise;
  }

  async generate(state: string): Promise<ScanLoginChallenge> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      await this.connect();
    }
    const result = await this.connection!.invoke<any>('Generate', state);
    const scanText = result?.scanText ?? result?.ScanText ?? '';
    const expired = result?.expiredTime ?? result?.ExpiredTime;
    return {
      scanText,
      expiredTime: expired ? new Date(expired).getTime() : undefined,
    };
  }

  async stop(): Promise<void> {
    const connection = this.connection;
    this.connection = null;
    if (connection) {
      try {
        await connection.stop();
      } catch (error) {
        console.warn('[scan-login] stop failed', error);
      }
    }
  }
}

export const scanLoginHub = new ScanLoginHub();
