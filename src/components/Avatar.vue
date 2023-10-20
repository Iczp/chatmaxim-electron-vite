<script setup lang="ts">
const props = defineProps<{
  value?: string | number;
}>();
</script>

<template>
  <div class="avatar">img</div>
</template>

<style scoped>
.avatar {
  display: flex;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background-color: #ccc;
  border-radius: 4px;
  color: #ecececb4;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
</style>
