<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, FileContentDto } from '../../../apis/dtos';
import Bubble from '../../../components/Bubble.vue';
import TextViewer from '../../../components/TextViewer.vue';
import { ImageContentDto } from '../../../apis/dtos/message/ImageContentDto';
const { t } = useI18n();
const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as ImageContentDto);

import { ref } from 'vue';
import { formatImageRect, formatUrl } from '../../../commons/utils';
import { useDownload } from '../../../commons/useDownload';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../../apis';
const visible = ref(false);
// https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?1703916163985
const url = computed(() => content.value.url);

const maxWidth = 240;
const maxHeight = 180;

const rect = computed(() =>
  formatImageRect(content.value.width || 0, content.value.height || 0, maxWidth, maxHeight),
);

const isError = ref(false);
const errMessage = ref<string>();
const onError = (event: Event) => {
  isError.value = true;
  errMessage.value = t('LoadError');
};
const showErr = () => {
  console.warn('showErr');
};
const fallback = () => {};

const showProgress = ref(false);

const thumbnailUrl = computed(() => content.value.thumbnailUrl!);

const src = computed(() => content.value.path || formatUrl(content.value.thumbnailUrl!));
// const src = ref<string>();
const { downloadFile, percent, blobUrl, isPending } = useDownload();

if (thumbnailUrl.value) {
  downloadFile(thumbnailUrl.value).catch(err => {
    console.error('downloadFile image:', props.item.id, content.value.url, JSON.stringify(err));
  });
}
</script>

<template>
  <!-- <Bubble :r="item.isSelf" class="msg-image">
    <a-image :preview="false" :width="width" :height="height" @click="visible = true" />
  </Bubble> -->

  <div class="msg-image">
    <div v-if="isPending" class="abs progress">
      <a-progress type="circle" :percent="percent" :size="24" :strokeWidth="6" />
    </div>
    <div class="abs err-info">{{ errMessage }}</div>
    <!-- <div v-if="isError" class="empty" @click.stop.prevent="showErr">{{ errMessage }}</div> -->
    <a-image
      :src="blobUrl || src"
      placeholder="..."
      :class="{ error: isError }"
      :preview="false"
      :width="rect.width"
      :height="rect.height"
      @click="visible = true"
      @error="onError"
    />
  </div>
</template>

<style scoped>
.msg-image {
  position: relative;
  user-select: none;
  /* padding: 1px; */
  min-height: 40px;
  min-width: 24px;
  /* line-height: 24px; */
  max-width: var(--message-max-width);
  overflow: hidden;
  /* background-image: url(https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp); */
  background-size: cover;
  /* width: 180px; */
  /* height: 240px; */
  background-color: rgba(228, 228, 228, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 12px;
  color: var(--color);
}
:deep(img.error),
.error img {
  /* display: none; */
  opacity: 0;
}
.empty {
  display: flex;
  font-size: 12px;
  color: #ccc;
}
.abs {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: var(--sub-title-color);
}
.progress {
  pointer-events: none;
}
.err-info {
  display: flex;
}
:deep(.ant-progress.ant-progress-circle .ant-progress-text) {
  color: rgba(255, 255, 255, 0.88);
}
</style>
