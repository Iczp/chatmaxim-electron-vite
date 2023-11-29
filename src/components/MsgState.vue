<script setup lang="ts">
import { MessageStateEnums } from '../apis/enums';
defineProps<{
  state?: MessageStateEnums;
}>();
</script>

<template>
  <div v-if="state != MessageStateEnums.Ok" class="msg-state">
    <a-spin size="small" />
  </div>
</template>

<style scoped>
.msg-state {
  display: flex;
  height: 40px;
  align-items: center;
}
</style>
