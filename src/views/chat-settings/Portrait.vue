<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UploadPortrait from '../../components/UploadPortrait.vue';
import { useDestination } from './commons/useDestination';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();
const { portrait, tryChangePortrait } = useDestination(props.sessionUnitId!);

</script>

<template>
  <upload-portrait
  :title="t('Session Portrait')"
    type="sessionUnitId"
    :id="sessionUnitId"
    @change="tryChangePortrait"
    :portrait="portrait"
  ></upload-portrait>
</template>

<style scoped>
</style>
