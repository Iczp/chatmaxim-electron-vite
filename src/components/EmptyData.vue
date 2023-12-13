<script setup lang="ts">
import { SyncOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { reactive } from 'vue';
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
      <span v-if="text" class="empty-text">{{ text }}</span>
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
