<script setup lang="ts">
import { MessageSimpleDto } from '../apis/dtos';
import { useMessageContent } from '../commons/useMessageContent';

const props = defineProps<{
  entity?: MessageSimpleDto;
}>();
const { contentType, contentText } = useMessageContent(props.entity);
</script>

<template>
  <span v-if="entity" class="message-content-proview">
    <span v-if="contentType" class="message-type" :message-type="entity?.messageType">
      {{ contentType }}
    </span>
    <span class="message-text" :title="contentText">{{ contentText }}</span>

    <!-- <span v-if="isRollback">消息被撤回</span>
  <span v-else-if="messageType == MessageTypeEnums.Cmd">{{ content.text }}</span>
  <span v-else-if="messageType == MessageTypeEnums.Text">{{ content.text }}</span>
  <span v-else-if="messageType == MessageTypeEnums.Image">[图片]</span>
  <span v-else-if="messageType == MessageTypeEnums.Video">[视频]</span>
  <span v-else-if="messageType == MessageTypeEnums.Location">[位置]{{ content.name }}</span>
  <span v-else-if="messageType == MessageTypeEnums.Contacts">[名片]{{ content.title }}</span>
  <span v-else-if="messageType == MessageTypeEnums.Sound">[语音]</span>
  <span v-else-if="messageType == MessageTypeEnums.RedEnvelope">[红包]</span>
  <span v-else-if="messageType == MessageTypeEnums.History">[聊天记录]</span>
  <span v-else-if="messageType == MessageTypeEnums.Link">[链接]</span>
  <span v-else-if="messageType == MessageTypeEnums.Html">
    {{ content.title }} {{ content.content }}
  </span>
  <span v-else>[不支持的类型]</span> -->
  </span>
</template>

<style scoped>
.message-content-proview {
  /* display: inline-flex; */
}

.message-type {
  color: black;
  margin-right: 4px;
}
.message-text {
  color: gray;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* min-width: 80px; */
}
</style>
