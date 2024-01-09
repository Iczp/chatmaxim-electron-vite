<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, CmdContentDto } from '../../../apis/dtos';
import TextViewer from '../../../components/TextViewer.vue';
const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as CmdContentDto);
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
  color: var(--msg-cmd-color);
  background-color: var(--msg-cmd-background-color);
  border: 1px solid var(--msg-cmd-border-color);
  margin: 4px auto;
  box-sizing: border-box;
  /* user-select: none; */


}
.msg-cmd:hover {
  color: var(--msg-cmd-hover-color);
  background-color: var(--msg-cmd-hover-background-color);
  border: 1px solid var(--msg-cmd-hover-border-color);


}
:deep(.uid),
:deep(.oid) {
  color: var(--msg-cmd-object-color);
}
:deep(.oid:hover),
:deep(.uid:hover) {
  color: var(--msg-cmd-object-hover-color);
}
</style>
