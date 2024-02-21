<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { ContentCopy } from '../icons';
const props = defineProps<{
  value?: string;
  key?: string;
  duration?: number | undefined;
}>();
const { t } = useI18n();
const { copy, isSupported } = useClipboard();

const copyContent = () => {
  let contentText = props.value;
  if (!contentText) {
    return;
  }
  copy(contentText).then(v => {
    message.success({ content: `${t('Copied')}!`, key: props.key, duration: props.duration });
  });
};
</script>

<template>
  <div class="copy-box" @click="copyContent()">
    <ContentCopy class="svg-icon-14" />
    <slot></slot>
  </div>
</template>

<style scoped>
.copy-box {
  cursor: pointer;
}
</style>
