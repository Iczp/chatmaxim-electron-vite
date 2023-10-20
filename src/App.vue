<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import {
  AndroidOutlined,
  MessageOutlined,
  CodepenCircleOutlined,
  SettingOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SketchOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';
import { IczpNet_Chat_SessionUnits_Dtos_BadgeDto as BadgeDto, SessionUnitService } from './apis';

const chatObjectItems: Ref<BadgeDto[]> = ref([]);
onMounted(() => {
  //
  SessionUnitService.getApiChatSessionUnitBadgeByCurrentUser({}).then(res => {
    console.log('', res);
    chatObjectItems.value = res;
  });
});
</script>

<template>
  <scroll-view>
    <div id="chatMaxim">
      <div class="side">
        <div class="side-top">
          <router-link to="/">
            <div class="tab-item">
              <a-badge color="red" count="5">
                <MessageOutlined  two-tone-color="#ff0000" />
              </a-badge>
            </div>
          </router-link>

          <div class="tab-item"><ClockCircleOutlined /></div>

          <router-link
            v-for="(item, index) in chatObjectItems"
            :key="index"
            :to="`/message/` + item.chatObjectId"
          >
            <div class="tab-item"><AndroidOutlined /></div>
          </router-link>
          <router-link to="/about">
            <div class="tab-item"><CodepenCircleOutlined two-tone-color="#ff0000"/></div>
          </router-link>
          <div class="tab-item"><SketchOutlined /></div>
          <div class="tab-item"><AppstoreOutlined /></div>
        </div>

        <div class="side-bottom">
          <div class="tab-item">
            <a-badge color="red" count="5">
              <SettingOutlined />
            </a-badge>
          </div>
          <div class="tab-item"><UserOutlined /></div>
        </div>
      </div>
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <div class="content-page">
        <router-view></router-view>
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
  align-items: center;
  justify-content: center;
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
