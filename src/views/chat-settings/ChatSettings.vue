<script setup lang="ts">
import { ref } from 'vue';
import { chatSettingsRoutes } from '../../routes/chatSettingsRoutes';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ChatObject from '../../components/ChatObject.vue';
import { useDestination } from './commons/useDestination';
import { computed } from 'vue';
import { ChatObjectTypeEnums } from '../../apis/enums';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const objectType = computed(() => sessionUnit.value?.destination?.objectType);
const navItems = computed(() =>
  chatSettingsRoutes.filter(
    x =>
      // true ||
      !x.meta?.objectTypes ||
      (x.meta?.objectTypes as Array<ChatObjectTypeEnums>).some(d => d == objectType.value),
  ),
);

const { sessionUnit, memberCount } = useDestination();

const onTabClick = (item: any, index: number) => {
  // console.log(item, index);
  router.push({ name: item.name });
};

const description = computed(() => {
  switch (objectType.value) {
    case ChatObjectTypeEnums.Room:
    case ChatObjectTypeEnums.Square:
      return t('Memebers Count', [`${memberCount.value || 50}`]);
    default:
      return undefined;
  }
});
</script>

<template>
  <page class="chat-setting-page">
    <aside class="nav-sider">
      <header>
        <chat-object
          :entity="sessionUnit?.destination"
          class="destination"
          :sub="description"
        ></chat-object>
      </header>
      <scroll-view>
        <div class="tabs">
          <div
            class="tab-item"
            v-for="(item, index) in navItems"
            :class="{ active: route.name == item.name }"
            @click="onTabClick(item, index)"
          >
            {{ t(item.meta!.title as string) }}
          </div>
        </div>
      </scroll-view>
    </aside>
    <page-content class="page-content">
      <!-- <ToolBar /> -->
      <!-- <page-title /> -->
      <router-view v-slot="{ Component, route }">
        <!-- <transition name="fade"> -->
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
        <!-- </transition> -->
      </router-view>
    </page-content>
  </page>
</template>

<style scoped>
:deep(.ant-form) :deep(.ant-form-item) {
  color: var(--color);
}

:deep(.tool-bar) {
  position: fixed;
}

.chat-setting-page {
  user-select: none;
  display: flex;
  flex-direction: row;
  /* color: var(--color);
  background-color: var(--background-color); */
}
.destination {
  padding: 20px;
  --title-left-max-width: 160px;
}
.nav-sider {
  position: relative;
  background-color: unset;
  /* width: 120px; */
  /* min-width: 120px; */
  /* flex-basis: 120px; */
  /* flex: 0 0 120px; */
}
.nav-sider {
  flex: 0 0 240px;
}

.page-content {
  border-left: 1px solid var(--divider-color);
}

.tabs {
  width: 100%;
  /* height: 100%; */
  box-sizing: border-box;
  /* margin-top: 50px; */
  -webkit-app-region: drag;
}
.tab-item {
  display: flex;
  padding: 12px 20px;
  align-items: center;
  /* height: 44px; */
  position: relative;
  transition: all 0.3s linear;
  -webkit-app-region: no-drag;
  /* color: rgb(159, 100, 100); */
}
.tab-item.active {
  color: var(--tab-item-active-color);
  background-color: var(--tab-item-active-background-color);
  box-sizing: border-box;
  /* font-weight: bold; */
}
.tab-item::after {
  content: '';
  position: absolute;
  right: 0;
  width: 2px;
  height: 0%;

  background-color: rgba(10, 118, 226, 0.458);
  transition: all 0.3s linear;
}
.tab-item.active::after {
  height: 100%;
  background-color: var(--tab-item-active-bar-background-color);
}
.tab-item:hover {
  background-color: var(--tab-item-background-color-hover);
}
</style>
../../../routes/chatSettingsRoutes ../../routes/chatSettingsRoutes
