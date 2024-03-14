<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatUrl } from '../../commons/utils';
import { usePayload } from '../../commons/usePayload';
import { ChatObjectDto } from '../../apis/dtos';
import { computed } from 'vue';
const { t } = useI18n();
const props = defineProps<{ chatObjectId: number | string }>();
const payload = usePayload<{ owner: ChatObjectDto }>();

const portrait = computed(() => formatUrl(payload.value?.owner.portrait));

const tryChangePortrait = (portrait: string): boolean => {
  if (payload.value?.owner) {
    payload.value.owner.portrait = portrait;
    return true;
  }
  return false;
};
</script>

<template>
  <upload-portrait
  :title="t('User Portrait')"
    type="chatObjectId"
    :id="chatObjectId"
    @change="tryChangePortrait"
    :portrait="portrait"
  ></upload-portrait>
</template>

<style scoped></style>
