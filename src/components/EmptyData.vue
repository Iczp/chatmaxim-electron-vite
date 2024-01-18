<script setup lang="ts">
import { SyncOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps<{
  height?: number;
  text?: string;
}>();
const style = reactive({
  height: props.height + 'px',
});
</script>

<template>
  <div class="empty-data" :style="style">
    <slot>
      <span class="empty-text">{{ text || t('EmptyData') }}</span>
    </slot>
  </div>
</template>

<style scoped>
.empty-data {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 64px; */
  box-sizing: border-box;
  color: rgba(128, 128, 128, 0.612);
  padding: 8px;
}
.empty-text {
  font-size: 12px;
  margin-left: 8px;
}
</style>
