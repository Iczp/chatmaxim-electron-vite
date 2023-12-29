<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, CmdDto } from '../../../apis/dtos';
import Bubble from '../../../components/Bubble.vue';
import TextViewer from '../../../components/TextViewer.vue';
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
  padding: 4px 8px;
  line-height: 150%;
  font-size: 12px;
  max-width: 360px;
  margin: auto;
  text-align: center;
  border-radius: 4px;
  color: #a1a1a1;
  background-color: #e3e3e3bf;
  margin: 4px auto;
  border: 1px solid #e3e3e3bf;
  box-sizing: border-box;
  /* user-select: none; */
}
.msg-cmd:hover {
  border: 1px solid #cecece;
}
:deep(.uid),
:deep(.oid) {
  color: #7f7f7f;
}
:deep(.oid:hover),
:deep(.uid:hover) {
  color: #333;
}
</style>
