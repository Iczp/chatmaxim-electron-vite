<script setup lang="ts">
const props = defineProps<{
  options?: Object;
  src?: string;
}>();

defineExpose({});
</script>

<template>
  <div class="viewer-container">
    <img class="image no-drag" :src="src" />
  </div>
</template>

<style scoped>
.viewer-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.image {
  display: flex;
  max-width: 100%;
  max-height: 100%;
  transition: all 0.3s linear;
}
</style>
