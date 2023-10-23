<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
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
  EllipsisOutlined
} from '@ant-design/icons-vue';

import { IczpNet_Chat_SessionUnits_Dtos_BadgeDto as BadgeDto, SessionUnitService } from '../apis';

import { navToChat } from '../commons/utils';
import { router, chatHistorys } from '../routes';

const chatObjectItems: Ref<BadgeDto[]> = ref([]);

// const router = useRouter();

onMounted(() => {
  //
  SessionUnitService.getApiChatSessionUnitBadgeByCurrentUser({}).then(res => {
    console.log('', res);
    chatObjectItems.value = res;
  });
});

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
    // name: 'im',
    // params: {
    //   chatObjectId: item.chatObjectId,
    // },
  });
};
</script>

<template>
  <scroll-view>
    <div id="chatMaxim">
      <div class="side">
        <div class="side-top">
          <div class="tab-item">
            <a-badge color="red" :count="1">
              <router-link to="/">
                <HomeOutlined two-tone-color="#ff0000" />
              </router-link>
            </a-badge>
          </div>

          <div
            class="tab-item"
            v-for="(item, index) in chatObjectItems"
            :key="index"
            @click="navToChatHitory(item)"
          >
            <a-badge color="red" :count="item.badge">
              <!-- <router-link :to="`/chat/` + item.chatObjectId"> -->
              <MessageOutlined />
              <!-- </router-link> -->
            </a-badge>
          </div>
          <div class="tab-item">
            <router-link to="/about">
              <CodepenCircleOutlined two-tone-color="#ff0000" />
            </router-link>
          </div>
          <div class="tab-item">
            <router-link to="/login">
              <AndroidOutlined />
            </router-link>
          </div>
          <div class="tab-item"><SketchOutlined /></div>
          <div class="tab-item"><AppstoreOutlined /></div>
          <div class="tab-item"><ClockCircleOutlined /></div>
          <div class="tab-item"><EllipsisOutlined /></div>
          
        </div>

        <div class="side-bottom">
          <div class="tab-item">
            <router-link to="/settings">
              <a-badge color="red" count="5">
                <SettingOutlined />
              </a-badge>
            </router-link>
          </div>
          <div class="tab-item" title="用户">
            <router-link to="/user">
              <a-badge color="red" count="5">
                <UserOutlined />
              </a-badge>
            </router-link>
          </div>
        </div>
      </div>
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <div class="content-page">
        <router-view v-slot="{ Component, route }">
          <keep-alive v-if="route.path.startsWith('/chat')">
            <component :is="Component" :key="route.params.chatObjectId" />
          </keep-alive>
          <keep-alive v-else>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </router-view>
      </div>
      <!-- <keep-alive>
       
      </keep-alive> -->
    </div>
  </scroll-view>

  <!-- <div>
    <a href="https://www.electronjs.org/" target="_blank">
      <img src="./assets/electron.svg" class="logo electron" alt="Electron logo" />
    </a>
    <a href="https://vitejs.dev/" target="_blank">
      <img src="./assets/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Electron + Vite + Vue" />

  <div class="flex-center">
    Place static files into the
    <code>/public</code>
    folder
    <img style="width: 2.4em; margin-left: 0.4em" src="/logo.svg" alt="Logo" />
  </div> -->
</template>

<style scoped>
#chatMaxim {
  /* display: flex;
  flex-direction: row; */
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
}
.side-top {
  display: flex;
  flex-direction: column;
}

.side-bottom {
  display: flex;
  flex-direction: column;
}

.tab-item {
  display: flex;
  height: 64px;
  width: var(--side-width);
  align-items: center;
  justify-content: center;
  /* background-color: rgba(0, 128, 255, 0.427); */
  cursor: pointer;
}
.tab-item:hover {
  background-color: rgba(46, 40, 220, 0.427);
}
.tab-item:active {
  background-color: rgba(39, 25, 127, 0.427);
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
