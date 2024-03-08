<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, FileContentDto } from '../../../apis/dtos';
import Bubble from '../../../components/Bubble.vue';
import TextViewer from '../../../components/TextViewer.vue';
import { ImageContentDto } from '../../../apis/dtos/message/ImageContentDto';

const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as ImageContentDto);

import { ref } from 'vue';
import { formatImageRect, formatUrl } from '../../../commons/utils';
const visible = ref(false);
// https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?1703916163985
const url = computed(() => content.value.url);

const maxWidth = 240;
const maxHeight = 180;

const rect = computed(() =>
  formatImageRect(content.value.width || 0, content.value.height || 0, maxWidth, maxHeight),
);

const isError = ref(false);
const errMessage = ref('加载错误');
const onError = (event: Event) => {
  isError.value = true;
  errMessage.value = '加载错误';
};
const showErr = () => {
  console.warn('showErr');
};
const fallback = () => {};

const src = computed(() => content.value.path || formatUrl(content.value.thumbnailUrl!));
</script>

<template>
  <!-- <Bubble :r="item.isSelf" class="msg-image">
    <a-image :preview="false" :width="width" :height="height" @click="visible = true" />
  </Bubble> -->

  <div class="msg-image">
    <!-- <div v-if="isError" class="empty" @click.stop.prevent="showErr">{{ errMessage }}</div> -->
    <a-image
      :src="src"
      :class="{ error: isError }"
      :preview="false"
      
      :height="rect.height"
      @click="visible = true"
      @error="onError"
    />
  </div>
</template>

<style scoped>
.msg-image {
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
  background-color: rgb(228, 228, 228);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 12px;
}
:deep(img.error),
.error img {
  display: none;
}
.empty {
  display: flex;
  font-size: 12px;
  color: #ccc;
}
</style>
