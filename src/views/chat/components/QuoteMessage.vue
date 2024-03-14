<script setup lang="ts">
import { MessageSimpleDto } from '../../../apis/dtos';
import { useMessageEntity } from '../../../commons/useMessageEntity';
import MessageProview from '../../../components/MessageProview.vue';
import { CloseCircleOutlined } from '@ant-design/icons-vue';
const props = defineProps<{
  entity?: MessageSimpleDto;
  r?: boolean;
  removable?: boolean;
}>();

const emits = defineEmits<{
  remove: [Event];
  sender: [MouseEvent | PointerEvent];
  content: [MouseEvent | PointerEvent];
}>();
const { senderName } = useMessageEntity(props.entity);
</script>

<template>
  <div class="quote-message">
    <div class="quote-message-body" :class="{ reserve: r }">
      <icon type="quote-left" class="icon-quote" />
      <a class="sender-name" @click.stop="emits('sender', $event)">{{ senderName }}</a>
      <MessageProview :entity="entity" @click.stop="emits('content', $event)" />
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

  background-color: var(--quote-message-background-color);
  font-size: 12px;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid var(--quote-message-border-color);
  position: relative;
}

.sender-name {
  color: var(--quote-message-sender-name-color);
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
  color: var(--quote-message-closable-hover-color);
}
.quote-message-body:hover {
  background-color: var(--quote-message-hover-background-color);
  border: 1px solid var(--quote-message-hover-border-color);
}
.icon-quote {
  color: var(--quote-message-icon-color);
  font-size: 14px;
}
</style>
../../../commons/useMessageEntity
