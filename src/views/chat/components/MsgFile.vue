<script setup lang="ts">
import { computed } from 'vue';
import { MessageDto, FileContentDto } from '../../../apis/dtos';
import Bubble from '../../../components/Bubble.vue';
import TextViewer from '../../../components/TextViewer.vue';
import prettyBytes from 'pretty-bytes';
import FileItem from '../../../components/FileItem.vue';
const props = defineProps<{
  item: MessageDto;
}>();
const content = computed(() => props.item.content as FileContentDto);
</script>

<template>
  <Bubble :r="item.isSelf" class="msg-file">
    <file-item
      :name="content?.fileName"
      :suffix="content?.suffix"
      :size="content?.contentLength"
    ></file-item>
    <div class="footer">
      <div>{{ prettyBytes(content?.contentLength || 0) }}</div>
      <div>{{ content?.suffix }}</div>
    </div>
  </Bubble>
</template>

<style scoped>

.msg-file {
  
  /* background: linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255)) border-box; */
  background: var(--msg-file-background);
}
.msg-file:hover {
  /* background: linear-gradient(135deg, rgb(245, 245, 245), rgb(244, 244, 244)) border-box; */
  background: var(--msg-file-background-hover);
}
/* :deep(.file-icon) {
  background: linear-gradient(135deg, rgb(245, 245, 245), rgba(230, 230, 230, 0.942)) border-box;
} */
.msg-file {
  padding: 0px;
  width: 260px;
  min-height: 40px;
  line-height: 24px;
  max-width: var(--message-max-width);
  user-select: none;
}
.footer {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  padding: 0 4px;
  color: #666;
}
.footer::before {
  position: absolute;
  content: '';
  height: 1px;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.192);
  transform: scaleY(0.25);
}
</style>
