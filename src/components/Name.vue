<script setup lang="ts">
const props = defineProps<{
  value?: string;
}>();
</script>

<template>
  <text class="chat-object-name">{{ value }}</text>
</template>

<style scoped>
.chat-object-name {
  display: inline-block;
}
</style>
