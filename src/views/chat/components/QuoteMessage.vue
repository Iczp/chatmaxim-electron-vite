<script setup lang="ts">
import { ref } from 'vue';
import { MessageSimpleDto } from '../../../apis/dtos';
import { useMessageEntity } from '../../../commons/useMessageEntity';
import MessageProview from '../../../components/MessageProview.vue';
import { CloseCircleOutlined } from '@ant-design/icons-vue';
const props = defineProps<{
  entity?: MessageSimpleDto;
  r?: boolean;
  removable?: boolean;
  flash?: number;
}>();

const emits = defineEmits<{
  remove: [Event];
  sender: [MouseEvent | PointerEvent];
  content: [MouseEvent | PointerEvent];
}>();
const { senderName } = useMessageEntity(props.entity);

const flashSeconds = ref(props.flash || 0);
if (props.flash) {
  setTimeout(() => {
    flashSeconds.value = 0;
  }, props.flash);
}
</script>

<template>
  <div class="quote-message" :class="{ flash: Number(flashSeconds) > 0 }">
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
.flash .quote-message-body {
  animation: flash 0.5s infinite;
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

@keyframes flash {
  from {
    background: rgba(255, 0, 0, 0.637);
  }
  to {
    background: rgba(255, 0, 0, 0);
  }
}
</style>
