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
.left {
  justify-content: flex-start;
}
.right {
  justify-content: flex-end;
}
.page-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 12px;
}
.flex-end {
  justify-content: flex-end;
}
</style>
