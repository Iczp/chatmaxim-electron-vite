<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatImageRect, formatUrl, getImageRect } from '../../../commons/utils';
import { useDownload } from '../../../commons/useDownload';
import { useI18n } from 'vue-i18n';
import prettyBytes from 'pretty-bytes';
import EmptyImg from '../../../assets/empty.png';
import { useElementVisibility } from '@vueuse/core';

const { t } = useI18n();
const props = defineProps<{
  path?: string;
  url?: string;
  width?: number;
  height?: number;
  size?: number;
  suffix?: string;
}>();
const target = ref<HTMLDivElement>();

const targetIsVisible = useElementVisibility(target);

watch(
  () => targetIsVisible.value,
  v => {
    console.log('watch targetIsVisible', v, src.value);
  },
);

const visible = ref(false);
const maxWidth = 240;
const maxHeight = 180;
const rect = ref(formatImageRect((props.width || 0) / (props.height || 0), maxWidth, maxHeight));
const isError = ref(false);
const errMessage = ref<string>();
const onError = (event: Event) => {
  // isError.value = true;
  // errMessage.value = t('LoadError');
};

const { downloadFile, percent, blobUrl, isPending } = useDownload();
if (props.url) {
  downloadFile(props.url)
    .then(res => {
      // getImageRect(res.objectUrl).then(res => {
      //   rect.value = formatImageRect(res.width / res.height, maxWidth, maxHeight);
      // });
    })
    .catch(err => {
      console.error('downloadFile image:', props.url, JSON.stringify(err));
    })
    .finally(() => {
      if (!(props.path || blobUrl)) {
        isError.value = true;
        errMessage.value = 'url is null';
      }
    });
} else if (props.path) {
  // isError.value = true;
  // errMessage.value = props.path;
} else {
  // isError.value = true;
  // errMessage.value = 'url is null';
}

const src = computed(() => props.path || blobUrl.value || EmptyImg);
</script>

<template>
  <div class="msg-img" ref="target">
    <div v-if="isPending" class="abs pointer-events-none">
      <a-progress
        type="circle"
        :percent="percent"
        :size="24"
        :strokeWidth="6"
        trailColor="rgba(255, 255, 255, 0.3)"
        strokeColor="rgba(255, 255, 255, 0.5)"
        class="progress"
      />
    </div>
    <slot></slot>
    <div v-if="errMessage" class="abs err-info">{{ errMessage }}</div>

    <div class="abs image-info">
      <div>{{ prettyBytes(size || 0) }}</div>
      <div>{{ suffix }}</div>
    </div>
    <a-image
      :src="src"
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
.msg-img {
  position: relative;
  cursor: pointer;
  user-select: none;
  /* padding: 1px; */
  min-height: 40px;
  min-width: 20px;
  /* line-height: 24px; */
  max-width: var(--message-max-width);
  overflow: hidden;

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
  box-shadow: 0 0 8px 2px rgba(62, 62, 62, 0.33);
}
.progress {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  opacity: 0.5;
}

:deep(img.error),
.error img {
  /* display: none; */
  opacity: 0;
}
.empty {
  display: flex;
  font-size: 12px;
  color: #cccccc9f;
}

.image-info {
  top: unset;
  font-size: 12px;
  justify-content: space-between;
  padding: 0 4px;
  /* display: none; */
  transition: all 0.3s linear;
  /* opacity: 0; */
  background-color: rgba(0, 0, 0, 0.301);
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(1, 1, 1, 0)) border-box;
  bottom: -100%;
}
.msg-img:hover .image-info {
  /* display: flex; */
  /* opacity: 1; */
  bottom: 0;
}
.progress {
  pointer-events: none;
}
.err-info {
  display: flex;
  color: var(--sub-title-color);
  font-size: 12px;
}
:deep(.ant-progress.ant-progress-circle .ant-progress-text) {
  color: rgba(255, 255, 255, 0.88);
}
</style>
