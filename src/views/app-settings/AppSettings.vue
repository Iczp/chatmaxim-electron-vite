<script setup lang="ts">
import { ref } from 'vue';
import { TabsProps } from 'ant-design-vue/es/tabs';
import { useAppInfo } from '../../commons/useAppInfo';
// defineProps<{ msg: string }>();
import { appSettingsChildren } from '../../routes/appSettingsChildren';
import type { CSSProperties } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const navItems = ref(Array.from(appSettingsChildren));
const siderStyle: CSSProperties = {
  width: 120,
  minWidth: 120,
  flexBasis: 120,
  maxWidth: 120,
};
const { version } = useAppInfo();
const router = useRouter();
const onTabClick = (item: any, index: number) => {
  console.log(item, index);
  router.push(`/settings/${item.path}`);
};
</script>

<template>
  <page class="app-setting-page">
    <aside :style="siderStyle" class="nav-sider">
      <scroll-view>
        <div class="tabs">
          <div
            class="tab-item"
            v-for="(item, index) in navItems"
            :class="{ active: route.name == item.name }"
            @click="onTabClick(item, index)"
          >
            {{ item.title }}
          </div>
        </div>
      </scroll-view>
      <div class="version">v{{ version }}</div>
    </aside>
    <page-content class="page-content">
      <!-- <page-title></page-title> -->
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view>
    </page-content>
  </page>
</template>

<style scoped>
.app-setting-page {
  user-select: none;
  display: flex;
  flex-direction: row;
}
.nav-sider {
  position: relative;
  background-color: unset;
  width: 120px;
  min-width: 120px;
  flex-basis: 120px;
  flex: 0 0 120px;
}

.page-content {
  border-left: 1px solid #cccccc69;
}
.header {
  background-color: unset;
  border: none;
}
.footer {
  background-color: unset;
  border: none;
  color: #ccc;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  height: 32px;
}
.tabs {
  width: 100%;
  /* height: 100%; */
  box-sizing: border-box;
  margin-top: 50px;
}
.tab-item {
  display: flex;
  padding: 0 20px;
  align-items: center;
  height: 44px;
  position: relative;

  /* color: rgb(159, 100, 100); */
}
.tab-item.active {
  color: rgb(10, 118, 226);
  background-color: #f6f6f6d5;
  box-sizing: border-box;
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
  background-color: rgba(10, 118, 226, 0.93);
}
.tab-item:hover {
  background-color: #fcfcfcd5;
}

.version {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  color: #ccc;
  font-size: 12px;
  width: 100%;
  height: 24px;
}
</style>
