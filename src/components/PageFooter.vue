<script setup lang="ts">
const props = defineProps<{
  align?: 'left' | 'right' | 'center';
}>();
</script>

<template>
  <a-layout-footer class="page-footer" :class="{ align }">
    <slot></slot>
  </a-layout-footer>
</template>

<style scoped>
.left{
  justify-content: flex-start;
}
.right{
  justify-content: flex-end;
}
</style>
