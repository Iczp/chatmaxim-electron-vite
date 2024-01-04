<script setup lang="ts">
import { computed } from 'vue';
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import {
  HomeOutlined,
  AndroidOutlined,
  MessageOutlined,
  CodepenCircleOutlined,
  SettingOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SketchOutlined,
  AppstoreOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue';

import { navToChat } from '../commons/utils';
import { router, chatHistorys } from '../routes';
import { message } from 'ant-design-vue';
import { BadgeDto } from '../apis/dtos';
import { useChatObjectList } from '../commons/useChatObjectList';
import { useWebsocket } from '../commons/useWebsocket';
import { setWindow } from '../commons/setWindow';
import { openAppSettings } from '../commons/openAppSettings';

const route = useRoute();
const { connectionText, connectionState, retryCount } = useWebsocket();
const { badge, badgeItems } = useChatObjectList();
// const router = useRouter();

const navToChatHitory = (item: BadgeDto) => {
  const chatObjectId = item.chatObjectId!;
  const arg = chatHistorys[chatObjectId];
  if (arg) {
    navToChat({
      chatObjectId,
      sessionUnitId: arg.sessionUnitId,
      title: arg.title,
    });
    return;
  }
  router.push({
    path: `/chat/${item.chatObjectId}`,
  });
};

const goto = (p: any) => router.push(p);

const chatObjectId = computed(() => Number(router.currentRoute.value.params.chatObjectId));

const isChatActive = (chatObjectId: number): boolean => {
  return route.path.startsWith('/chat/') && chatObjectId == Number(route.params.chatObjectId);
};

const isNavActive = (pattern: string | RegExp, flags?: string | undefined): boolean => {
  const reg = new RegExp(pattern, flags);
  return reg.test(router.currentRoute.value.path);
};

const gotoAppSettings = () => {
  openAppSettings({
    name: 'app-settings',
    path: `/app-settings`,
    visiblity: true,
  });
  message.info({ content: '设置' });
};

const getKey = (route: RouteLocationNormalizedLoaded): string | string[] => {
  const m = route.path.match(/^\/(chat|object)\/\d+/gi);
  const key = m != null ? m[0] : route.path;
  // console.warn('key:', key);
  return key;
};
</script>

<template>
  <scroll-view>
    <div id="chatMaxim">
      <div class="side">
        <div class="side-top">
          <div class="nav-item" @click="goto('/')">
            <a-badge :count="badge" :dot="true" :title="badge.toString()">
              <HomeOutlined />
            </a-badge>
          </div>
          <div
            class="nav-item"
            v-for="(item, index) in badgeItems"
            :key="index"
            :title="item.owner?.name"
            :class="{active: isChatActive(item.chatObjectId!)}"
            @click="navToChatHitory(item)"
          >
            <a-badge :count="item.badge">
              <MessageOutlined />
            </a-badge>
          </div>
          <div class="nav-item" @click="goto('/about')">
            <CodepenCircleOutlined two-tone-color="#ff0000" />
          </div>
          <div class="nav-item" @click="goto('/login')">
            <AndroidOutlined />
          </div>
          <div
            class="nav-item"
            @click="goto('/management/members/13/e52bacf4-c231-061a-6628-3a0b0cf571fb')"
          >
            <SketchOutlined />
          </div>
          <div class="nav-item"><AppstoreOutlined /></div>
          <div class="nav-item"><ClockCircleOutlined /></div>
          <div class="nav-item"><MoreOutlined /></div>
        </div>

        <div class="side-bottom">
          <div class="nav-item" title="用户" @click="goto('/user')">
            <a-badge :dot="true">
              <UserOutlined />
            </a-badge>
          </div>
          <div class="nav-item" @click="gotoAppSettings()">
            <a-badge color="red" count="0">
              <SettingOutlined />
            </a-badge>
          </div>
        </div>
      </div>
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <div class="content-page">
        <router-view v-slot="{ Component, route }">
          <!-- <keep-alive v-if="route.path.startsWith('/chat')">
            <component :is="Component" :key="route.params.chatObjectId" />
          </keep-alive>
          <keep-alive v-else>
            <component :is="Component" :key="route.path" />
          </keep-alive> -->

          <keep-alive>
            <component :is="Component" :key="getKey(route)" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </scroll-view>
</template>

<style scoped>
#chatMaxim {
  margin: auto;
}
.side :deep(.anticon) {
  font-size: 24px;
}
:deep(.ant-badge) {
  color: unset;
}
.side {
  position: fixed;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: var(--side-width);
  overflow: hidden;
  background-color: black;
  justify-content: space-between;
  align-items: center;
  color: #9feaf9;
  user-select: none;
  z-index: 99;
}
.side-top {
  display: flex;
  flex-direction: column;
}

.side-bottom {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  height: 64px;
  width: var(--side-width);
  align-items: center;
  justify-content: center;
  /* background-color: rgba(0, 128, 255, 0.427); */
  cursor: pointer;
}

.nav-item.active {
  background-color: rgb(65 65 65 / 84%);
  color: #1890ff;
}
.nav-item.active:hover {
  background-color: rgba(77, 76, 76, 0.84);
  color: #0084ff;
}
.nav-item:hover {
  background-color: rgba(50, 50, 50, 0.427);
  color: #008cb6;
}
.nav-item:active {
  background-color: rgba(19, 4, 93, 0.427);
}
.content-page {
  position: fixed;
  left: 64px;
  top: 0;
  right: 0;
  bottom: 0;
  /* position: relative; */
  z-index: 1;
  /* display: flex; */
  /* flex: 1; */
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.ps {
  width: 100%;
  height: 100%;
}
</style>
