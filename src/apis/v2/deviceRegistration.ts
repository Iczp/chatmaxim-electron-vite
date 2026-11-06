import { version } from '../../../package.json';
import { env } from '../../env';
import { useWindowStore } from '../../stores/windowStore';
import { getClientCredentialsToken } from '../auth/TokenController';
import { deviceV2 } from './index';

let registrationInFlight: Promise<any> | null = null;

const safe = (value: any): string => (value === undefined || value === null ? '' : String(value));

/**
 * 组装设备注册 profile（字段对齐新客户端 DeviceRegistrationApi）。
 * 注意：根据后端 ABP DTO 契约，profile 内不得包含 appId、deviceId 或 isEnabled。
 */
export const buildDeviceProfile = (deviceId: string): Record<string, any> => {
  const screenWidth = typeof window !== 'undefined' ? window.screen?.width ?? 0 : 0;
  const screenHeight = typeof window !== 'undefined' ? window.screen?.height ?? 0 : 0;
  const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const language = typeof navigator !== 'undefined' ? navigator.language || env.defaultLanguage : env.defaultLanguage;
  const platform = env.device_type || process.platform;
  const osVersion = typeof navigator !== 'undefined' ? navigator.userAgent.match(/Windows NT [\d.]+/)?.[0] ?? '' : '';
  const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 360;
  const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 620;

  const profile: Record<string, any> = {
    name: env.app_name,
    sdkVersion: '',
    app: env.app_name,
    appLanguage: language,
    appName: env.app_name,
    appVersion: version,
    appVersionCode: Number(version.split('.')[0]) || 0,
    appWgtVersion: '',
    brand: '',
    browserName: 'Electron',
    browserVersion: process.versions?.electron ?? '',
    deviceBrand: '',
    deviceModel: '',
    deviceType: platform,
    devicePixelRatio: ratio,
    deviceOrientation: screenWidth >= screenHeight ? 'landscape' : 'portrait',
    fontSizeSetting: 0,
    host: '',
    hostFontSizeSetting: '',
    hostSDKVersion: '',
    hostName: '',
    hostVersion: '',
    hostLanguage: language,
    hostTheme: 'light',
    hostPackageName: '',
    language,
    model: '',
    osName: process.platform,
    osVersion: safe(osVersion).slice(0, 64),
    osLanguage: language,
    osTheme: 'light',
    pixelRatio: ratio,
    screenWidth: Math.round(screenWidth),
    screenHeight: Math.round(screenHeight),
    statusBarHeight: 0,
    storage: '',
    swanNativeVersion: '',
    system: `${process.platform} ${osVersion}`.trim().slice(0, 64),
    safeArea: JSON.stringify({ top: 0, right: 0, bottom: 0, left: 0 }),
    safeAreaInsets: JSON.stringify({ top: 0, right: 0, bottom: 0, left: 0 }),
    ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'Electron',
    uniCompileVersion: '',
    uniPlatform: platform,
    uniRuntimeVersion: '',
    version,
    romName: '',
    romVersion: '',
    windowWidth: Math.round(innerWidth),
    windowHeight: Math.round(innerHeight),
    navigationBarHeight: 0,
    titleBarHeight: 0,
    appPlatform: platform,
    windowTop: 0,
    windowBottom: 0,
    bluetoothEnabled: false,
    locationEnabled: false,
    wifiEnabled: false,
    cacheLocation: '',
    theme: 'light',
    remarks: '',
  };

  return {
    appId: env.app_id,
    deviceId,
    profile,
  };
};

/**
 * 获取当前窗口或主进程的稳定设备 ID
 */
export const getDeviceId = async (): Promise<string> => {
  const windowStore = useWindowStore();
  if (windowStore.machineId) {
    return windowStore.machineId;
  }

  // 1. 通过 IPC 直接从主进程获取
  try {
    const { ipcRenderer } = await import('electron');
    if (ipcRenderer?.invoke) {
      const id = await ipcRenderer.invoke('machine-id');
      if (id) {
        windowStore.machineId = String(id);
        return String(id);
      }
    }
  } catch {}

  // 2. 轮询等待 windowStore 初始化完成
  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (windowStore.machineId) return windowStore.machineId;
  }
  return '';
};

/**
 * 设备注册：使用独立的 client_credentials(AppDevice) Token，绝不复用用户 Token。
 * 失败只记录日志，不阻塞离线使用。
 */
export const registerDevice = async (): Promise<any> => {
  if (registrationInFlight) {
    return registrationInFlight;
  }
  registrationInFlight = (async () => {
    try {
      const deviceId = await getDeviceId();
      if (!deviceId) {
        console.warn('[device] deviceId is empty, skip registration');
        return null;
      }

      const accessToken = await getClientCredentialsToken({
        cacheKey: 'device-register-app-device',
        clientId: env.client_id,
        clientSecret: env.client_secret,
        scope: 'AppDevice',
      });

      const body = buildDeviceProfile(deviceId);
      const result = await deviceV2.register(body, accessToken);
      console.log('[device] registered successfully:', deviceId);
      return result;
    } catch (error) {
      console.warn('[device] registration failed (non-blocking)', error);
      return null;
    } finally {
      registrationInFlight = null;
    }
  })();
  return registrationInFlight;
};
