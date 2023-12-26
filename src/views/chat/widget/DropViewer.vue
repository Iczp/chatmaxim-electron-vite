<script setup lang="ts">
import prettyBytes from 'pretty-bytes';
import { ChatObjectDto } from '../../../apis/dtos';
import ChatObject from '../../../components/ChatObject.vue';
defineProps<{
  destination?: ChatObjectDto;
  files?: Array<any>;
}>();
</script>

<template>
  <page class="page">
    <page-content>
      <chat-object :entity="destination" class="chat-object" :size="32"></chat-object>
      <a-divider class="divider" />
      <scroll-view class="scroll-view">
        <div class="file-list">
          <div v-for="(item, index) in files">{{ item?.name }} ({{ prettyBytes(item.size) }})</div>
        </div>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped>
.page {
  background-color: white;
}
.divider {
  margin: 6px;
}
.scroll-view {
  /* min-height: 300px; */
  max-height: 300px;
}
.file-list {
  display: flex;
  flex-direction: column;
  padding: 12px;
}
</style>
