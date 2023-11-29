<script setup lang="ts">
import { router } from '../routes';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { ChatOn,Chating } from '../icons';
</script>

<template>
  <page class="empty">
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
  background-color: rgb(251, 251, 251);
  user-select: none;
  align-items: center;
  justify-content: center;
  color: rgb(196, 196, 196);
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
  color: rgba(236, 236, 236, 0.442);
}
</style>
