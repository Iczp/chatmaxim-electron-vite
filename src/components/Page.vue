<script setup lang="ts">
const props = defineProps<{
  value?: string;
}>();
</script>

<template>
  <a-layout class="page">
    <slot></slot>
  </a-layout>
</template>

<style scoped>
</style>
