<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, VideoContentDto } from '../../../apis/dtos';
import { ImageContentDto } from '../../../apis/dtos/message/ImageContentDto';
import MsgImg from './MsgImg.vue';

const props = defineProps<{
  item: MessageDto;
  path?: string;
  url: string;
  width?: number;
  height?: number;
  size?: number;
  suffix?: string;
}>();

const content = computed(() => props.item.content as VideoContentDto);

const url = computed(() => content.value.gifUrl || content.value.imageUrl);
</script>

<template>
  <MsgImg
    class="msg-image"
    :url="url"
    :path="content.path"
    :width="content.width"
    :height="content.height"
    :suffix="content.suffix"
    :size="content.size"
  >
    <div class="abs pointer-events-none">
      <PlayIcon class="btn-play" :percent="100" :size="36" />
    </div>
  </MsgImg>
</template>

<style scoped></style>
