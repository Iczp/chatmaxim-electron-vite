<script setup lang="ts">
import { ref } from 'vue';
import { useAppInfo } from '../../commons/useAppInfo';
import { appSettingsChildren } from '../../routes/appSettingsChildren';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const navItems = ref(Array.from(appSettingsChildren));
const { version } = useAppInfo();
const onTabClick = (item: any, index: number) => {
  // console.log(item, index);
  router.push({ name: item.name });
};
</script>

<template>
  <page class="app-setting-page">
    <aside class="nav-sider">
      <div class="version">v{{ version }}</div>
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
    </aside>
    <page-content class="page-content">
      <!-- <ToolBar /> -->
      <router-view v-slot="{ Component, route }">
        <transition name="fade">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </page-content>
  </page>
</template>

<style scoped>

.fade-enter-active{
  transition: all 0.3s;
}
.fade-leave-active {
  /* transition: opacity 0.1s; */
  opacity: 0;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.tool-bar) {
  position: fixed;
}

.divider {
  font-size: 12px;
  color: #999;
}

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
  -webkit-app-region: drag;
}
.tab-item {
  display: flex;
  padding: 0 20px;
  align-items: center;
  height: 44px;
  position: relative;
  transition: all 0.3s linear;
  -webkit-app-region: no-drag;
  /* color: rgb(159, 100, 100); */
}
.tab-item.active {
  color: rgb(10, 118, 226);
  background-color: #ffffff;
  box-sizing: border-box;
  font-weight: bold;
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
  background-color: #dedede98;
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
