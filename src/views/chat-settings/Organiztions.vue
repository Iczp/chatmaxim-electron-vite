<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();
</script>

<template>
  <page>
    <page-title :title="t('Session Organiztions')" description="managermemt" />

    <page-content>
      <a-page-header title="Title" sub-title="This is a subtitle" />
      <scroll-view>
        <RouterLink to="/">{{ t('Home') }}</RouterLink>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped></style>
