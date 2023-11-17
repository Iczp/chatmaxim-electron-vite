<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>();
</script>

<template>
  <a-layout-content class="page-content">
    <slot></slot>
  </a-layout-content>
</template>

<style scoped>

</style>
