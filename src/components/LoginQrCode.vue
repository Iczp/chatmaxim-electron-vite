<script setup lang="ts">
import QRCode from 'qrcode';
import { onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: string;
    size?: number;
    /** 覆盖在二维码上的文案（如“已扫码，请在手机确认”） */
    statusText?: string;
    /** expired / scanned / granted / rejected / cancelled */
    tone?: 'default' | 'scanned' | 'granted' | 'error' | 'muted';
    loading?: boolean;
  }>(),
  {
    value: '',
    size: 220,
    statusText: '',
    tone: 'default',
    loading: false,
  },
);

const canvas = ref<HTMLCanvasElement>();
const error = ref('');

const toneColor = () => {
  switch (props.tone) {
    case 'scanned':
      return '#722ed1';
    case 'granted':
      return '#52c41a';
    case 'error':
      return '#ff4d4f';
    case 'muted':
      return '#8c8c8c';
    default:
      return '#1890ff';
  }
};

const render = async () => {
  if (!canvas.value || !props.value) return;
  try {
    await QRCode.toCanvas(canvas.value, props.value, {
      width: props.size,
      margin: 1,
      color: {
        dark: '#101828',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    error.value = '';
  } catch (e: any) {
    console.error('[qr] render failed', e);
    error.value = e?.message || '二维码生成失败';
  }
};

onMounted(render);

watch(
  () => [props.value, props.size],
  () => {
    void render();
  },
);
</script>

<template>
  <div class="qr-wrap" :style="{ width: `${size}px`, height: `${size}px` }">
    <canvas ref="canvas" class="qr-canvas"></canvas>

    <div v-if="loading" class="qr-mask">
      <a-spin />
    </div>
    <div v-else-if="error" class="qr-mask qr-error">
      <span>{{ error }}</span>
    </div>
    <div v-else-if="statusText" class="qr-mask" :style="{ color: toneColor() }">
      <div class="qr-status">{{ statusText }}</div>
    </div>
  </div>
</template>

<style scoped>
.qr-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}
.qr-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.qr-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.94);
  padding: 12px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.6;
}
.qr-error {
  color: #ff4d4f;
  font-weight: 500;
}
.qr-status {
  white-space: pre-line;
}
</style>
