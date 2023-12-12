<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, TextDto } from '../apis/dtos';
import Bubble from './Bubble.vue';
import TextViewer from './TextViewer.vue';
const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as TextDto);
</script>

<template>
  <Bubble :r="item.isSelf" class="msg-text">
    <!-- {{ item.id }} -->
    <!-- {{ content?.text }}
    <br />
    indexOf:{{ content?.text?.indexOf('\n') }}
    <br /> -->
    <TextViewer :value="content?.text!" />
  </Bubble>
</template>

<style scoped>
.msg-text {
  padding: 8px;
  min-height: 40px;
  min-width: 24px;
  line-height: 24px;
  max-width: var(--message-max-width);
}
</style>
