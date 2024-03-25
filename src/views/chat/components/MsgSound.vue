<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, SoundContentDto, TextContentDto } from '../../../apis/dtos';
import Bubble from '../../../components/Bubble.vue';
import TextViewer from '../../../components/TextViewer.vue';
const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as SoundContentDto);
</script>

<template>
  <Bubble :r="item.isSelf" class="msg-image">
    <!-- {{ item.id }} -->
    <!-- {{ content?.text }}
    <br />
    indexOf:{{ content?.text?.indexOf('\n') }}
    <br /> -->
    Auido:{{ content.time }}
  </Bubble>
</template>

<style scoped>
.msg-image {
  padding: 8px;
  min-height: 40px;
  min-width: 24px;
  line-height: 24px;
  max-width: var(--message-max-width);
}
</style>
