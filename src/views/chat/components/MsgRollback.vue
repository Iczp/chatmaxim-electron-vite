<script setup lang="ts">
defineProps<{
  name?: string;
}>();
</script>

<template>
  <div class="rollback">
    <text>{{ name }}</text>
    <text>[撤回一条消息]</text>
  </div>
</template>

<style scoped>
.rollback {
  display: flex;
  justify-content: center;
  color: #ccc;
  font-size: 12px;
  align-items: center;
  padding: 8px;
}
</style>
