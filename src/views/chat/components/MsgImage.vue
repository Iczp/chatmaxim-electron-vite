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
</script>

<template>
  <Bubble :r="item.isSelf" class="msg-image">
    <!-- {{ item.id }} -->
    <!-- {{ content?.text }}
    <br />
    indexOf:{{ content?.text?.indexOf('\n') }}
    <br /> -->
    image
    <TextViewer :value="content?.url!" />
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
