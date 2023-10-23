<script setup lang="ts">
import { router } from '../routes';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
</script>

<template>
  <div class="empty">
    <!-- <h1>welcome...</h1>
    <h2>{{ router.currentRoute.value.params.chatObjectId }}</h2> -->
    <a-card hoverable style="width: 300px">
      <template #cover>
        <div class="div-image"></div>
      </template>
      <template #actions>
        <setting-outlined key="setting" />
        <edit-outlined key="edit" />
        <ellipsis-outlined key="ellipsis" />
      </template>
      <a-card-meta title="Card title" description="This is the description">
        <template #avatar>
          <a-avatar src="https://joeschmoe.io/api/v1/random" />
        </template>
      </a-card-meta>
    </a-card>
  </div>
</template>

<style scoped>
:deep(.ant-card) {
  overflow: hidden;
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
</style>
