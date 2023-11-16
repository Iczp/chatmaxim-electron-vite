<script setup lang="ts">
const props = defineProps<{
  name?: string | null;
  entity?: ChatObjectDto;
  size?: number | string;
}>();
import { UserOutlined } from '@ant-design/icons-vue';
import { ChatObjectDto } from '../apis/dtos';
</script>

<template>
  <a-avatar shape="circle" :size="size || 48" class="avatar" :alt="name">
    <template #icon><UserOutlined /></template>
    1
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
