<script setup lang="ts">
import { computed, onActivated, ref } from 'vue';
import { ViewerPayload } from './commons/ViewerPayload';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePayload } from '../../commons/usePayload';
import { isImageOfMessage, isVideoOfMessage, getVideoOfMessage } from '../../commons/utils';

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
const url = computed(() => msg.value?.content?.url);
onActivated(() => {
  console.log('onActivated');
});
</script>

<template>
  <page class="viewer-page">
    <page-title></page-title>
    <page-content class="page-content">
      <ImageViewer v-if="isImage" :src="url"></ImageViewer>
      <VideoPlayer v-else-if="isVideo" :src="url" :type="videoType" />
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
