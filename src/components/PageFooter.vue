<script setup lang="ts">
// const props = defineProps<{
//   align?: 'left' | 'right' | 'center';
// }>();
</script>

<template>
  <a-layout-footer class="page-footer">
    <slot></slot>
  </a-layout-footer>
</template>

<style scoped>
.page-footer {
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  padding: 0 12px;
  border-top: 1px solid var(--page-footer-border-top-color);
}
</style>
