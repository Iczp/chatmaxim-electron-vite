<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { ChatObjectDto } from '../apis/dtos';
import { Person } from '../icons';
import { computed } from 'vue';
const props = defineProps<{
  name?: string | null;
  entity?: ChatObjectDto;
  size?: number | string;
}>();

const svgClass = computed(() => 'svg-icon-' + (Number(props.size) || 48) / 2);
</script>

<template>
  <a-avatar shape="circle" :size="size || 48" class="avatar" :alt="name">
    <template #icon><Person class="svg-icon" :class="svgClass" /></template>
  </a-avatar>
</template>

<style scoped>
.avatar {
  display: flex;
  flex-shrink: 0;
  /* width: 48px; */
  /* height: 48px; */
  /* background-color: #ccc; */
  /* border-radius: 4px; */
  color: #ecececb4;
  justify-content: center;
  align-items: center;
  /* font-size: 12px; */
}
</style>
