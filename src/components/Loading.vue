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
  <div class="loading" :style="style">
    <slot>
      <sync-outlined spin />
      <span v-if="text">{{ text }}</span>
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
  color: rgba(128, 128, 128, 0.612);
  padding: 20px;
}
</style>
