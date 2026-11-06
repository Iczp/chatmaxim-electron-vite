const readEnv = (key: string, fallback = ''): string => {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value === undefined || value === null || value === '' ? fallback : value;
};

const readBool = (key: string, fallback: boolean): boolean => {
  const value = readEnv(key);
  if (value === '') return fallback;
  return value === 'true' || value === '1';
};

const readNumber = (key: string, fallback: number): number => {
  const value = Number(readEnv(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const readNumberList = (key: string, fallback: number[]): number[] => {
  const value = readEnv(key);
  if (!value) return fallback;
  const numbers = value
    .split(',')
    .map(x => Number(x.trim()))
    .filter(x => Number.isFinite(x) && x >= 0);
  return numbers.length > 0 ? numbers : fallback;
};

const trimEndSlash = (url: string): string => url.replace(/\/+$/, '');

const signalRBaseUrl = readEnv('VITE_APP_SIGNALR_BASEURL');
const signalRHubPath = readEnv('VITE_APP_SIGNALR_HUB_PATH', '/signalr-hubs/chat');
const legacyChatHubUrl = readEnv('VITE_APP_SIGNALR_CHAT_HU_URL');

const chatHubUrl =
  signalRBaseUrl !== ''
    ? `${trimEndSlash(signalRBaseUrl)}/${signalRHubPath.replace(/^\/+/, '')}`
    : legacyChatHubUrl;

export type EnvType = {
  /** 是否开发环境 */
  isDev: boolean;
  app_id: string;
  app_name: string;
  url_scheme: string;
  token_key: string;
  /** OAuth 客户端 Id（桌面端公共客户端：IM_Mobile） */
  client_id: string;
  /** OAuth 客户端密钥（公共客户端可为空） */
  client_secret?: string;
  /** OAuth scope，空格分隔 */
  auth_scope: string;
  base_url: string;
  /** 设备管理/注册服务地址（空则复用 base_url） */
  app_device_baseurl: string;
  /** 设备类型：desktop / windows / web */
  device_type: string;
  /** SignalR 聊天 Hub 完整地址 */
  chat_hub_url: string;
  signalr_base_url: string;
  signalr_hub_path: string;
  signalr_skip_negotiation: boolean;
  signalr_reconnect_delays: number[];
  /** 在线状态心跳间隔（秒） */
  presence_heartbeat_seconds: number;
  /** 扫码登录 Hub 地址 */
  scan_login_hub_url: string;
  scan_login_template: string;
  scan_login_qr_expires_seconds: number;
  scan_login_client_id: string;
  scan_login_client_secret?: string;
  scan_login_scope: string;
  auth_host: string;
  author: string;
  websize: string;
  copyright: string;
  /** 默认主题：auto | system | light | dark | green | blue */
  defaultColorScheme: string;
  /** 默认语言：zh-CN | en-US */
  defaultLanguage: string;
  defaultfetchMessageShortcuts: string;
  defaultScreenshotsShortcuts: string;
};

export const env: EnvType = {
  isDev: !import.meta.env.PROD,

  app_id: readEnv('VITE_APP_ID'),

  app_name: readEnv('VITE_APP_NAME'),

  url_scheme: readEnv('VITE_APP_URL_SCHEME'),

  token_key: readEnv('VITE_APP_TOKEN_KEY', 'TOKEN_V2024'),

  client_id: readEnv('VITE_APP_CLIENT_ID', 'IM_Mobile'),

  client_secret: readEnv('VITE_APP_CLIENT_SECRET'),

  auth_scope: readEnv(
    'VITE_APP_AUTH_SCOPE',
    'IM Chat Cms Social AppStatistic AppDevice offline_access roles profile phone email address',
  ),

  base_url: trimEndSlash(readEnv('VITE_APP_BASEURL')),

  app_device_baseurl: trimEndSlash(
    readEnv('VITE_APP_APP_DEVICE_BASEURL', readEnv('VITE_APP_BASEURL')),
  ),

  device_type: readEnv('VITE_APP_DEVICE_TYPE', 'desktop'),

  chat_hub_url: chatHubUrl,

  signalr_base_url: trimEndSlash(signalRBaseUrl),

  signalr_hub_path: signalRHubPath,

  signalr_skip_negotiation: readBool('VITE_APP_SIGNALR_SKIP_NEGOTIATION', true),

  signalr_reconnect_delays: readNumberList('VITE_APP_SIGNALR_RECONNECT_DELAYS', [
    0, 2000, 10000, 30000,
  ]),

  presence_heartbeat_seconds: readNumber('VITE_APP_PRESENCE_HEARTBEAT_SECONDS', 10),

  scan_login_hub_url: readEnv('VITE_APP_SCAN_LOGIN_SIGNALR_HUB_URL'),

  scan_login_template: readEnv('VITE_APP_SCAN_LOGIN_TEMPLATE', 'gotoim://scan-login?code={code}'),

  scan_login_qr_expires_seconds: readNumber('VITE_APP_SCAN_LOGIN_QR_EXPIRES_SECONDS', 90),

  scan_login_client_id: readEnv(
    'VITE_APP_SCAN_LOGIN_AUTH_CLIENT_ID',
    readEnv('VITE_APP_CLIENT_ID', 'IM_Mobile'),
  ),

  scan_login_client_secret: readEnv(
    'VITE_APP_SCAN_LOGIN_AUTH_CLIENT_SECRET',
    readEnv('VITE_APP_CLIENT_SECRET'),
  ),

  scan_login_scope: readEnv('VITE_APP_SCAN_LOGIN_AUTH_SCOPE', 'IM'),

  auth_host: trimEndSlash(readEnv('VITE_APP_AUTH_HOST')),

  author: readEnv('VITE_APP_AUTHOR'),

  websize: readEnv('VITE_APP_WEBSIZE'),

  copyright: readEnv('VITE_APP_COPYRIGHT'),

  defaultColorScheme: readEnv('VITE_APP_DEFAULT_COLOR_SCHEME', 'auto'),

  defaultLanguage: readEnv('VITE_APP_DEFAULT_LANGUAGE', 'zh-CN'),

  defaultfetchMessageShortcuts: readEnv(
    'VITE_APP_DEFAULT_FETCH_MESSAGE_SHORTCUTS',
    'Alt+D',
  ),

  defaultScreenshotsShortcuts: readEnv(
    'VITE_APP_DEFAULT_SCREENSHOTS_SHORTCUTS',
    'CTRL+ALT+E',
  ),
};
