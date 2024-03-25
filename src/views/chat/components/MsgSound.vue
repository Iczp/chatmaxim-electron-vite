<script setup lang="ts">
import { computed, ref, CSSProperties } from 'vue';
import { MessageDto, SoundContentDto } from '../../../apis/dtos';
import Bubble from '../../../components/Bubble.vue';
import SoundPlay from './SoundPlay.vue';
const props = defineProps<{
  item: MessageDto;
  play?: boolean;
}>();
const maxWidth = 420;
const content = computed(() => props.item.content as SoundContentDto);
const duration = computed(() => content.value?.time || Math.random() * 1000 * 60);
const formatTime = (time?: number): string | undefined => {
  if (!time) {
    return;
  }
  let s = (time / 1000).toFixed(0);
  return s + '"';
};
const time = computed(() => formatTime(duration.value));

const width = computed(() => {
  if (!duration.value) {
    return;
  }
  return (duration.value / maxValue) * maxWidth;
});

const maxValue = 1000 * 120; //120"

const bubbleStyle = ref<CSSProperties>({
  width: `${width.value?.toFixed(2)}px`,
});
</script>

<template>
  <div class="msg-sound">
    <Bubble :r="item.isSelf" :style="bubbleStyle" class="sound-bubble">
      <SoundPlay :play="play" />
    </Bubble>

    <div class="duration">{{ time }}</div>
    <a-badge v-if="!item.isSelf && !item.isReaded" class="unread" :dot="true" />
  </div>
</template>

<style scoped>
.reverse .msg-sound {
  flex-direction: row-reverse;
}

.reverse .sound-bubble {
  justify-content: flex-end;
}
.msg-sound {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.sound-bubble {
  padding: 4px 8px;
  min-height: 32px;
  min-width: 64px;
  line-height: 24px;
  max-width: var(--message-max-width);
  display: flex;
  /* width: 150px; */
}
:deep(.ant-badge-dot) {
  transform: unset;
  width: 8px;
  height: 8px;
  box-shadow: 0 0 1px 1px #b11f1f;
}
.unread {
  margin: 0 8px;
  /* padding: 8px; */
}
.duration {
  color: var(--color);
}
</style>
