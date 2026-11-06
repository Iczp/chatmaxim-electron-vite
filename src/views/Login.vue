<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { login } from '../apis/auth/TokenController';
import { registerDevice } from '../apis/v2/deviceRegistration';
import { loginWithScanToken } from '../apis/auth/TokenController';
import { TokenDto } from '../apis/auth/dto';
import { router } from '../routes';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, SettingOutlined, QrcodeOutlined } from '@ant-design/icons-vue';
import { setAuthorize } from '../ipc/setAuthorize';
import { useAppInfo } from '../composables/useAppInfo';
import { useI18n } from 'vue-i18n';
import { openAppSettings } from '../ipc/openAppSettings';
import { env } from '../env';
import LoginQrCode from '../components/LoginQrCode.vue';
import { scanLoginHub, ScanLoginEvent } from '../scanlogin/ScanLoginHub';

const { t } = useI18n();
const key = 'updatable';

const REMEMBER_KEY = 'chatmaxim.login.username';

const activeTab = ref<'account' | 'qr'>('account');

onMounted(() => {
  void registerDevice();
});

interface FormState {
  username: string;
  password: string;
  isAutoLogin: boolean;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: localStorage.getItem(REMEMBER_KEY) || 'admin',
  password: '',
  isAutoLogin: true,
  remember: !!localStorage.getItem(REMEMBER_KEY),
});

const isSubmitting = ref(false);

const finishLogin = async (token: TokenDto) => {
  stopCountdown();
  offScanEvent?.();
  offScanEvent = null;
  // 登录成功后释放扫码通道，避免隐藏窗口保留第二条 SignalR 连接
  void scanLoginHub.stop();
  message.success({ content: `${t('Welcome back')}!`, key, duration: 2 });
  await setAuthorize(token);
};

const onFinish = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  message.loading({ content: t('Logging in'), key });
  try {
    await registerDevice();
    const res = await login({
      username: formState.username,
      password: formState.password,
    });
    if (formState.remember) {
      localStorage.setItem(REMEMBER_KEY, formState.username);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
    await finishLogin(res.detail as TokenDto);
  } catch (err: any) {
    message.error({ content: err?.message || String(err), key, duration: 3 });
  } finally {
    isSubmitting.value = false;
  }
};

/* ------------------------------- 扫码登录 ------------------------------- */

type QrStatus = 'idle' | 'loading' | 'ready' | 'scanned' | 'granted' | 'rejected' | 'cancelled' | 'expired' | 'failed';

const qr = reactive({
  connected: false,
  loading: false,
  scanText: '',
  stateCode: '',
  status: 'idle' as QrStatus,
  error: '',
  userName: '',
  remaining: 0,
});

let expiryTimer: ReturnType<typeof setInterval> | null = null;
let offScanEvent: (() => void) | null = null;
let generating = false;
let loggingIn = false;

const statusText = computed(() => {
  switch (qr.status) {
    case 'scanned':
      return qr.userName
        ? t('Scanned by', [qr.userName])
        : t('Scanned');
    case 'granted':
      return t('Login confirmed');
    case 'rejected':
      return t('Login rejected');
    case 'cancelled':
      return t('Login cancelled');
    case 'expired':
      return t('QR code expired');
    default:
      return '';
  }
});

const statusTone = computed(() => {
  switch (qr.status) {
    case 'scanned':
      return 'scanned';
    case 'granted':
      return 'granted';
    case 'rejected':
    case 'cancelled':
    case 'expired':
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
});

const countdownText = computed(() => {
  const remaining = Math.max(0, qr.remaining);
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return `${mm}:${ss}`;
});

const stopCountdown = () => {
  if (expiryTimer) {
    clearInterval(expiryTimer);
    expiryTimer = null;
  }
};

const startCountdown = (expiresAt: number) => {
  stopCountdown();
  const tick = () => {
    qr.remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    if (qr.remaining <= 0) {
      stopCountdown();
      if (qr.status === 'ready' || qr.status === 'scanned') {
        qr.status = 'expired';
      }
    }
  };
  tick();
  expiryTimer = setInterval(tick, 1000);
};

const handleScanEvent = async (event: ScanLoginEvent) => {
  console.log('[scan-login] event', event);
  switch (event.command) {
    case 'scanned':
      qr.status = 'scanned';
      qr.userName = event.scanUserName || '';
      break;
    case 'granted': {
      stopCountdown();
      qr.status = 'granted';
      if (!event.scanToken) {
        qr.status = 'failed';
        qr.error = '授权已确认，但未收到登录票据，请刷新二维码重试。';
        return;
      }
      if (loggingIn) return;
      loggingIn = true;
      try {
        await registerDevice();
        const res = await loginWithScanToken(event.scanToken);
        await finishLogin(res.detail as TokenDto);
      } catch (err: any) {
        qr.status = 'failed';
        qr.error = err?.message || String(err);
        loggingIn = false;
      }
      break;
    }
    case 'rejected':
      stopCountdown();
      qr.status = 'rejected';
      break;
    case 'cancelled':
      stopCountdown();
      qr.status = 'cancelled';
      break;
    default:
      break;
  }
};

const generateQr = async () => {
  if (generating) return;
  generating = true;
  qr.loading = true;
  qr.error = '';
  try {
    const state = String(Math.floor(1000 + Math.random() * 9000));
    const challenge = await scanLoginHub.generate(state);
    if (!challenge.scanText) {
      throw new Error('扫码登录服务未返回二维码');
    }
    qr.scanText = challenge.scanText;
    qr.stateCode = state;
    qr.status = 'ready';
    qr.userName = '';
    const expiresAt =
      challenge.expiredTime || Date.now() + env.scan_login_qr_expires_seconds * 1000;
    startCountdown(expiresAt);
  } catch (error: any) {
    console.error('[scan-login] generate failed', error);
    qr.connected = false;
    qr.status = 'failed';
    qr.error = error?.message || String(error);
  } finally {
    qr.loading = false;
    generating = false;
  }
};

const connectScanLogin = async () => {
  if (qr.connected && scanLoginHub.isConnected) {
    await generateQr();
    return;
  }
  qr.loading = true;
  qr.error = '';
  try {
    await scanLoginHub.connect();
    qr.connected = true;
    offScanEvent?.();
    offScanEvent = scanLoginHub.onEvent(handleScanEvent);
    await generateQr();
  } catch (error: any) {
    console.error('[scan-login] connect failed', error);
    qr.connected = false;
    qr.status = 'failed';
    qr.error = `连接扫码登录服务失败：${error?.message || error}`;
  } finally {
    qr.loading = false;
  }
};

const refreshQr = () => {
  if (loggingIn) return;
  void (qr.connected ? generateQr() : connectScanLogin());
};

watch(activeTab, tab => {
  if (tab === 'qr' && qr.status === 'idle') {
    void connectScanLogin();
  }
});

onBeforeUnmount(() => {
  stopCountdown();
  offScanEvent?.();
  offScanEvent = null;
  void scanLoginHub.stop();
});

const { appId, appName, author, websize, version, copyright } = useAppInfo();
</script>

<template>
  <page class="login-page">
    <page-title class="header" :title="appName"></page-title>
    <page-content>
      <div class="page drag">
        <div class="login-body no-drag">
          <a-tabs v-model:activeKey="activeTab" size="small" centered class="login-tabs">
            <a-tab-pane key="account">
              <template #tab>
                <span><UserOutlined /> {{ t('Account login') }}</span>
              </template>
              <a-form
                :model="formState"
                name="basic"
                layout="vertical"
                autocomplete="off"
                class="login-form"
                @finish="onFinish"
              >
                <a-form-item :label="t('Account')" name="username">
                  <a-input v-model:value="formState.username" allow-clear>
                    <template #prefix><UserOutlined class="prefix" /></template>
                  </a-input>
                </a-form-item>

                <a-form-item :label="t('Password')" name="password">
                  <a-input-password v-model:value="formState.password">
                    <template #prefix><LockOutlined class="prefix" /></template>
                  </a-input-password>
                </a-form-item>

                <div class="login-options">
                  <a-checkbox v-model:checked="formState.remember">
                    {{ t('Remember account') }}
                  </a-checkbox>
                </div>

                <a-button type="primary" html-type="submit" block :loading="isSubmitting">
                  {{ t('Login') }}
                </a-button>
              </a-form>
            </a-tab-pane>

            <a-tab-pane key="qr">
              <template #tab>
                <span><QrcodeOutlined /> {{ t('Scan login') }}</span>
              </template>

              <div class="qr-panel">
                <div class="qr-hint">{{ t('Scan with Goto IM') }}</div>

                <div class="qr-box" @click="refreshQr">
                  <LoginQrCode
                    :value="qr.scanText"
                    :size="190"
                    :status-text="qr.status === 'ready' ? '' : statusText"
                    :tone="statusTone"
                    :loading="qr.loading && !qr.scanText"
                  />
                </div>

                <div v-if="qr.stateCode" class="qr-code">
                  <span class="qr-code-label">{{ t('Four digit code') }}</span>
                  <span class="qr-code-value">{{ qr.stateCode }}</span>
                </div>

                <div class="qr-meta">
                  <span v-if="qr.status === 'ready'" class="qr-countdown">
                    {{ t('QR code expires in', [countdownText]) }}
                  </span>
                  <span v-else-if="qr.error" class="qr-error">{{ qr.error }}</span>
                  <span v-else-if="!qr.connected" class="qr-muted">{{ t('Connecting') }}</span>
                  <span v-else class="qr-muted">{{ statusText }}</span>
                </div>

                <a-button size="small" :loading="qr.loading" @click="refreshQr">
                  {{ qr.connected ? t('Refresh QR code') : t('Reconnect') }}
                </a-button>

                <div v-if="qr.status === 'ready'" class="qr-tip">
                  {{ t('Click QR code to refresh') }}
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </page-content>
    <page-footer class="footer">
      <div class="version">v{{ version }}</div>
      <a @click="openAppSettings({ path: '/app-settings/network' })"><SettingOutlined /></a>
    </page-footer>
  </page>
</template>

<style scoped>
.header {
  background-color: unset;
  border: none;
}
.footer {
  background-color: unset;
  border: none;
  font-size: 12px;
  align-items: center;
  justify-content: center;
}
.page {
  width: 100%;
  height: 100%;
}
.prefix {
  font-weight: normal;
}
.login-body {
  padding: 4px 14px 10px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}
.login-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 10px;
}
.login-form {
  margin: 0 auto;
  max-width: 260px;
}
.login-form :deep(.ant-form-item) {
  margin-bottom: 12px;
}
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  font-size: 12px;
}
.qr-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
}
.qr-hint {
  font-size: 12px;
  opacity: 0.75;
  text-align: center;
}
.qr-box {
  width: 190px;
  height: 190px;
  padding: 6px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  border-radius: 12px;
  cursor: pointer;
  background: #fff;
}
.qr-code {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.qr-code-value {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #1890ff;
}
.qr-meta {
  min-height: 18px;
  font-size: 12px;
  text-align: center;
  padding: 0 8px;
}
.qr-countdown {
  opacity: 0.8;
}
.qr-error {
  color: #ff4d4f;
}
.qr-muted {
  opacity: 0.65;
  white-space: pre-line;
}
.qr-tip {
  font-size: 11px;
  opacity: 0.45;
}
</style>
