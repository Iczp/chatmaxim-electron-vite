<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
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
  <!-- <router-link to="/">
    <HomeOutlined two-tone-color="#ff0000" />
  </router-link> -->
  <scroll-view>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
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

<style scoped></style>
