<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, SoundContentDto, TextContentDto } from '../../../apis/dtos';
import Bubble from '../../../components/Bubble.vue';
import SoundPlay from './SoundPlay.vue';
const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as SoundContentDto);
</script>

<template>
  <div class="msg-sound">
    <Bubble :r="item.isSelf" class="sound-bubble">
      <SoundPlay :play="false" />
    </Bubble>
    <div>{{ content.time }}"</div>
  </div>
</template>

<style scoped>
.reverse .msg-sound {
  flex-direction: row-reverse;
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
  /* width: 150px; */
}
</style>
