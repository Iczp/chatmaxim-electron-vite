<script setup lang="ts">
// https://icones.js.org/collection/svg-spinners
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
  <div class="loading" :style="style">
    <SyncOutlined spin />
    <slot>
      <!-- <LoadingOutlined spin /> -->
      <span v-if="text" class="loading-text">{{ text }}</span>
    </slot>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 64px; */
  box-sizing: border-box;
  color: var(--loading-color);
  padding: 20px;
  font-size: 12px;
}
.loading-text {
  margin-left: 8px;
}
</style>
