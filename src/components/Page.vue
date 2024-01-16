<script setup lang="ts">
const props = defineProps<{
  loading?: boolean;
}>();
</script>

<template>
  <a-layout class="page">
    <div v-if="loading" class="page-loading">
      <a-spin></a-spin>
    </div>

    <slot></slot>
  </a-layout>
</template>
<style scoped>
:deep(.ant-layout) {
  color: var(--color);
  background-color: var(--background-color);
  background-color: unset;
}
.page-loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.313);
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
