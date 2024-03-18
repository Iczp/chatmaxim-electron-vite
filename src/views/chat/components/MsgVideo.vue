<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, VideoContentDto } from '../../../apis/dtos';
import MsgImg from './MsgImg.vue';

const props = defineProps<{
  item: MessageDto;
}>();

const content = computed(() => props.item.content as VideoContentDto);
const url = computed(() => content.value.gifUrl || content.value.snapshotUrl);
</script>

<template>
  <MsgImg
    class="msg-image"
    :url="url"
    :width="content.width || 240"
    :height="content.height || 135"
    :suffix="content.suffix"
    :size="content.size"
  >
    <div class="abs pointer-events-none">
      <PlayIcon class="btn-play" :percent="100" :size="36" />
    </div>
  </MsgImg>
</template>

<style scoped></style>
