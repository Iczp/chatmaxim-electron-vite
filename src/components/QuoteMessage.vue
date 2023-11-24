<script setup lang="ts">
import { MessageDto } from '../apis/dtos';
import { useMessageInfo } from '../commons/useMessageInfo';
import MessageProview from './MessageProview.vue';
import { CloseCircleOutlined } from '@ant-design/icons-vue';
const props = defineProps<{
  entity?: MessageDto;
  r?: boolean;
  removable?: boolean;
}>();

const emits = defineEmits<{
  remove: [Event];
}>();
const { senderName } = useMessageInfo(props.entity);
</script>

<template>
  <div class="quote-message">
    <div class="quote-message-body" :class="{ reserve: r }">
      <icon type="quote-left" class="icon-quote" />
      <span class="sender-name">{{ senderName }}</span>
      <MessageProview :entity="entity" />
      <icon type="quote-right" class="icon-quote" />
    </div>
    <div v-if="removable" class="closable" @click="emits('remove', $event)" title="删除引用">
      <CloseCircleOutlined />
    </div>
  </div>
</template>

<style scoped>
:deep(.message-text) {
  max-width: 100px;
}
.quote-message {
  display: flex;
  flex-direction: row;
}
.quote-message-body {
  display: flex;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: rgba(234, 234, 234, 0.5);
  font-size: 12px;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid rgba(212, 212, 212, 0.658);
  position: relative;
}

.sender-name {
  color: #333;
}
.sender-name::before {
  content: '[';
}
.sender-name::after {
  content: ']:';
  margin-right: 5px;
}
.closable {
  margin-left: 5px;
  font-size: 16px;
  cursor: pointer;
}

.closable:hover {
  color: rgba(130, 130, 130, 0.9);
}
.quote-message-body:hover {
  background-color: rgba(234, 234, 234, 1);
  border: 1px solid rgba(130, 130, 130, 0.9);
}
.icon-quote {
  color: #ccc;
  font-size: 14px;
}
</style>
