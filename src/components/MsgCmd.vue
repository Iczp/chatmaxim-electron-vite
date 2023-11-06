<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, CmdDto } from '../apis/dtos';
import Bubble from './Bubble.vue';
import TextViewer from './TextViewer.vue';
const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as CmdDto);
</script>

<template>
  <!-- <Bubble :r="item.isSelf"> -->
  <TextViewer :value="content.text!" class="msg-cmd" />
  <!-- </Bubble> -->
</template>

<style scoped>
.msg-cmd {
  padding: 8px;
  min-height: 40px;
  min-width: calc(44px + 12px);
  line-height: 24px;
  max-width: var(--message-max-width);
  color: #ccc;
  font-size: 12px;
}
</style>
