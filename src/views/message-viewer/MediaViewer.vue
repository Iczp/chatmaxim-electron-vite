<script setup lang="ts">
import { computed, onActivated, onMounted, ref, watch } from 'vue';
import { ViewerPayload } from './commons/ViewerPayload';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ChatObject from '../../components/ChatObject.vue';
import { usePayload } from '../../commons/usePayload';
import { ChatObjectDto } from '../../apis/dtos';
import {
  formatUrl,
  isImageOfMessage,
  isVideoOfMessage,
  getVideoOfMessage,
} from '../../commons/utils';
import { useObjectUrl } from '@vueuse/core';
import { FileService } from '../../apis/services/FileService';
import VideoPlayer from '@/components/VideoPlayer.vue';
import ToolBar from '../../components/TooBar.vue';
import ImageViewer from '../../components/ImageViewer.vue';
import { useDownload } from '../../commons/useDownload';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const payload = usePayload<ViewerPayload>();

const currentIndex = ref(payload.value?.currentIndex || 0);

const msg = computed(() => payload.value?.messages[currentIndex.value]);

const videoType = computed(() => getVideoOfMessage(msg.value));

const isImage = computed(() => isImageOfMessage(msg.value));

const isVideo = computed(() => isVideoOfMessage(msg.value));

const messageType = computed(() => msg.value?.messageType);

const { downloadFile, isPending, error, objectUrl } = useDownload();

watch(
  () => msg.value?.content?.url,
  (url: string) => {
    // console.log('url', url);
    downloadFile(url);
  },
  {
    immediate: true,
  },
);

const videoOption = computed(() => ({
  autoplay: false,
  controls: true,
  width: 480,
  height: 360,
  // sources: [
  //   {
  //     src: objectUrl.value,
  //     type: 'video/mp4',
  //   },
  // ],
}));
</script>

<template>
  <page class="viewer-page">
    <!-- <div class="title-bar drag">
      <tool-bar></tool-bar>
    </div> -->
    <page-title></page-title>

    <!-- <page-header>
      <chat-object :entity="payload?.sessionUnit.destination" class="destination"></chat-object>
      <div>messageType: {{ messageType }}</div>
    </page-header> -->

    <page-content class="page-content">
      <ImageViewer :src="objectUrl" v-if="isImage" :error="error"></ImageViewer>
      <VideoPlayer v-else-if="isVideo" :options="videoOption" :src="objectUrl" :type="videoType" />
    </page-content>
  </page>
</template>

<style scoped>
:deep(.page-title) {
  width: 100%;
  position: fixed;
  z-index: 9;
}
/* .hover:hover {
  background-color: rgba(244, 7, 7, 0.984);
} */
.title-bar {
  width: 100%;
  height: 32px;
  position: fixed;
  z-index: 1;
  /* background-color: rgba(121, 121, 121, 0.1); */
}
</style>
