<script setup lang="ts">
import { computed, onActivated, ref } from 'vue';
import { ViewerPayload } from './commons/ViewerPayload';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePayload } from '../../commons/usePayload';
import {
  isImageOfMessage,
  isVideoOfMessage,
  getVideoOfMessage,
  formatUrl,
} from '../../commons/utils';

// import VuePdfApp from 'vue3-pdf-app';
// // import this to use default icons for buttons
// import 'vue3-pdf-app/dist/icons/main.css';

// const { t } = useI18n();
// const route = useRoute();
// const router = useRouter();
// const payload = usePayload<ViewerPayload>();
// const currentIndex = ref(payload.value?.currentIndex || 0);
// const msg = computed(() => payload.value?.messages[currentIndex.value]);
// const videoType = computed(() => getVideoOfMessage(msg.value));
// const isImage = computed(() => isImageOfMessage(msg.value));
// const isVideo = computed(() => isVideoOfMessage(msg.value));
// const messageType = computed(() => msg.value?.messageType);
// const url = computed(() => msg.value?.content?.url);

// const pdfUrl = ref(formatUrl(`/file?id=42c8d500-9aef-4fea-9873-3a11af154d4b`));
// const pdfUrl = ref('file://C:\\Users\\ZP\\Music\\不动产登记情况.pdf');
onActivated(() => {
  console.log('onActivated');
});
</script>

<template>
  <page class="viewer-page">
    <page-title></page-title>
    <page-content class="page-content">
      <!-- <ImageViewer v-if="isImage" :src="url"></ImageViewer> -->
      <!-- <VideoPlayer v-else-if="isVideo" :src="url" :type="videoType" /> -->

      <!-- message-view:{{ pdfUrl }} -->
      <!-- <vue-pdf-app style="height: 100vh" :pdf="pdfUrl"></vue-pdf-app> -->
      <router-view />
      <!-- <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view> -->
    </page-content>
  </page>
</template>

<style scoped>
:deep(.page-title) {
  width: 100%;
  position: fixed;
  z-index: 9;
}
.title-bar {
  width: 100%;
  height: 32px;
  position: fixed;
  z-index: 1;
  /* background-color: rgba(121, 121, 121, 0.1); */
}
</style>
