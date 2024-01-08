<script setup lang="ts">
import { router } from '../../routes';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { ChatOn,Chating } from '../../icons';
</script>

<template>
  <page class="empty drag">
    <page-title />
    <!-- <h1>welcome...</h1>
    <h2>{{ router.currentRoute.value.params.chatObjectId }}</h2> -->
    <page-content class="page-content">
      <Chating class="svg-icon" />
    </page-content>
  </page>
</template>

<style scoped>
:deep(.ant-card) {
  overflow: hidden;
}
:deep(.page-title-left) {
  display: none;
}
.empty {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: var(--chat-empty-background-color);
  user-select: none;
  align-items: center;
  justify-content: center;
  color: var(--chat-empty-color);
}
.div-image {
  height: 300px;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png');
  background-size: cover;
  background-position: center center;
}
.page-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.svg-icon{
  scale: 10;
  /* color: rgba(124, 124, 124, 0.442); */
}
</style>
