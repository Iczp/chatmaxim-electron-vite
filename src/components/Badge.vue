<script setup lang="ts">
const props = defineProps<{
  value?: string | number;
}>();
</script>

<template>
  <div class="badge">
    <slot>{{ value }}</slot>
  </div>
</template>

<style scoped>
.badge {
  --size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: red;
  border-radius: 40px;
  padding: 0 6px;
  box-sizing: border-box;
  min-width: var(--size);
  min-height: var(--size);
  /* font-size: 12px; */
}
</style>
