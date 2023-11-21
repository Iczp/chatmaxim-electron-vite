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
// onMounted(() => {
//   //
//   SessionUnitService.getApiChatSessionUnitBadgeByCurrentUser({}).then(res => {
//     console.log('', res);
//     chatObjectItems.value = res;
//   });
// });
</script>

<template>
  <div class="top-bar drag"></div>
  <!-- <router-view /> -->

  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
    <!-- <component v-else :is="Component" :key="route.path" /> -->
  </router-view>
</template>

<style scoped>
.top-bar {
  position: fixed;
  width: 100%;
  height: 20px;
  /* background-color: rgba(95, 177, 249, 0.415); */
  z-index: 0;
  -webkit-app-region: drag;
  user-select: none;
}
</style>
