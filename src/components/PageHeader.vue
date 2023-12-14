<script setup lang="ts">
// const props = defineProps<{
//   align?: 'left' | 'right' | 'center';
// }>();
</script>

<template>
  <a-layout-header class="page-header">
    <slot></slot>
  </a-layout-header>
</template>

<style scoped>
.page-header {
  /* display: flex;
  flex-direction: column; */
  height: auto;
  padding: 0;
  background-color: unset;
}
</style>
