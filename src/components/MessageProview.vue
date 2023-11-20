<script setup lang="ts">
import { computed } from 'vue';
import { MessageSimpleDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { formatMessageTime } from '../commons/utils';

const props = defineProps<{
  entity?: MessageSimpleDto;
}>();

const isRollback = computed(() => props.entity?.rollbackTime != null);
const messageType = computed(() => props.entity?.messageType as MessageTypeEnums | undefined);
const content = computed(() => props.entity?.content);
</script>

<template>
  <!-- 消息内容 -->
  <span v-if="isRollback">消息被撤回</span>
  <span v-else-if="messageType == MessageTypeEnums.Cmd">{{ content.text }}</span>
  <span v-else-if="messageType == MessageTypeEnums.Text">{{ content.text }}</span>
  <span v-else-if="messageType == MessageTypeEnums.Image">[图片]</span>
  <span v-else-if="messageType == MessageTypeEnums.Video">[视频]</span>
  <span v-else-if="messageType == MessageTypeEnums.Location">[位置]{{ content.name }}</span>
  <span v-else-if="messageType == MessageTypeEnums.Contacts">[名片]{{ content.title }}</span>
  <span v-else-if="messageType == MessageTypeEnums.Sound">[语音]</span>
  <span v-else-if="messageType == MessageTypeEnums.RedEnvelope">[红包]</span>
  <span v-else-if="messageType == MessageTypeEnums.Html">
    {{ content.title }} {{ content.content }}
  </span>
  <span v-else>[不支持的类型]</span>
</template>

<style scoped></style>
