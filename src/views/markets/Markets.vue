<script setup lang="ts">
import { ref } from 'vue';
import { AppDto } from '../../apis/dtos';
import { useI18n } from 'vue-i18n';
import type { CSSProperties } from 'vue';
import { useEnums } from '../../commons/useEnums';
const { t } = useI18n();

const { objectTypeOptions } = useEnums();
const onItemClick = (item: AppDto) => {
  console.log('onItemClick', item);
};
</script>

<template>
  <page class="markets-page">
    <aside class="page-aside">
      <header class="page-aside-header">page-aside-header</header>
      <main class="page-aside-main">
        <div class="data-list">
          <a v-for="(item, index) in objectTypeOptions" :key="index" class="data-item active">
            {{ item.label }}
          </a>
        </div>
      </main>
    </aside>
    <main class="page-main">
      <page-title :title="t('Markets')" :description="'1'" />
      <page-content class="page-content">page-content</page-content>
    </main>
  </page>
</template>

<style scoped>
.markets-page {
  flex-direction: row;
}
.page-content {
  flex-direction: row;
}
.page-aside,
.page-main {
  display: flex;
  flex-direction: column;
}
.page-aside {
  flex-basis: 160px;
  border-right: 1px solid var(--divider-color);
}
.page-main {
  flex: 1;
}

.page-aside-header {
  height: 120px;
}
.data-list {
  padding: 0;
}
.data-item {
  height: 40px;
  /* justify-content: center; */
  align-items: center;
  padding: 20px;
  margin: 2px 10px;
  border-radius: 4px;
  text-decoration: n;
  /* background-color: var(--background-color-normal); */
}
.data-item.active {

  background-color: var(--background-color-active);
}
</style>
