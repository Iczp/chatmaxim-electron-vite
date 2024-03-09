<script setup lang="ts">
import { computed, onActivated, onMounted, ref, watch } from 'vue';
import { ViewerPayload } from './commons/ViewerPayload';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ChatObject from '../../components/ChatObject.vue';
import { ChatObjectTypeEnums } from '../../apis/enums';
import { usePayload } from '../../commons/usePayload';
import { ChatObjectDto } from '../../apis/dtos';
import { formatUrl } from '../../commons/utils';
import { useObjectUrl } from '@vueuse/core';
import { FileService } from '../../apis/services/FileService';
import VideoPlayer from '@/components/VideoPlayer.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const payload = usePayload<ViewerPayload>();
const currentIndex = ref(payload.value?.currentIndex || 0);



const msg = computed(() => payload.value?.messages[currentIndex.value]);
const messageType = computed(() => msg.value?.messageType);

const imgUrl = ref<string>();
const blobMap = new Map<string, string>();
const downloadFile = (url: string) => {
  // console.log('url', url);
  var blobValue = blobMap.get(url);
  if (blobValue) {
    imgUrl.value = blobValue;
    return;
  }
  FileService.download({
    url,
    onDownloadProgress(progressEvent) {
      console.log('onDownloadProgress', progressEvent);
    },
  })
    .then(res => {
      console.log('file', typeof res);
      const blob = useObjectUrl(res);
      imgUrl.value = blob.value;
      console.log('blob', blob);
      blobMap.set(url, blob.value!);
    })
    .catch(err => {
      console.log('err', err);
    });
};

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


const videoOption = ref({
  autoplay: false,
  controls: true,
  width: 480,
  height: 360,
  sources: [
    {
      src: `http://10.0.5.20:8044/file?id=9477cc54-5375-f33f-d358-3a1134bc1962`,
      type: 'video/mp4',
    },
  ],
});

</script>

<template>
  <page class="viewer-page">
    <page-title></page-title>
    <!-- <page-header>
      <chat-object :entity="payload?.sessionUnit.destination" class="destination"></chat-object>
      <div>messageType: {{ messageType }}</div>
    </page-header> -->

    <page-content class="page-content">
      <!-- <VideoPlayer :options="videoOption" /> -->
      <div class="viewer-container">
        <img class="image" :src="imgUrl" />
      </div>
    </page-content>
  </page>
</template>

<style scoped>
.viewer-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.image {
  display: flex;
  max-width: 100%;
  max-height: 100%;
  transition: all 0.3s linear;
}
</style>
