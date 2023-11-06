<script setup lang="ts">
const props = defineProps<{
  item?: string | null;
}>();
</script>

<template>
  <div class="msg-quote">{{ item }}</div>
</template>

<style scoped>
.msg-quote {
  display: flex;
}
</style>
