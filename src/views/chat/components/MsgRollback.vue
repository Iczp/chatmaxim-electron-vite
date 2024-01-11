<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps<{
  name?: string;
}>();
</script>

<template>
  <div class="rollback">
    <text>{{ name }}</text>
    <text>[{{ t('Rollback a message') }}]</text>
  </div>
</template>

<style scoped>
.rollback {
  display: flex;
  justify-content: center;
  color: var(--msg-rollback-color);
  background-color: var(--msg-rollback-background-color);
  font-size: 12px;
  align-items: center;
  padding: 8px;
}
</style>
