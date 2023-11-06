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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  line-height: 150%;
  color: #ccc;
  font-size: 12px;
  max-width: 360px;
  margin: auto;
  text-align: center;
}
:deep(.uid),
:deep(.oid) {
  color: #999;
}
:deep(.oid:hover),
:deep(.uid:hover) {
  color: #333;
}
</style>
