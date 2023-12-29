<script setup lang="ts">
import { Modal, message } from 'ant-design-vue';
import { MessageDto, MessageSimpleDto } from '../../../apis/dtos';
import { MessageStateEnums } from '../../../apis/enums';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
const props = defineProps<{
  entity?: MessageDto;
  state?: MessageStateEnums;
}>();
const showError = () => {
  Modal.confirm({
    title: '发送失败',
    icon: createVNode(ExclamationCircleOutlined),
    content: props.entity?.error,
    okText: '重新发送',
    okType: 'danger',
    cancelText: '删除',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
    class: 'send-error',
  });
  // message.error({ content: props.entity?.error, key: 'error' });
};
</script>

<template>
  <div v-if="state != MessageStateEnums.Ok" class="msg-state">
    <a-spin v-if="state == MessageStateEnums.Sending" size="small" />
    <span v-else-if="state == MessageStateEnums.Error" class="error" @click="showError">
      <InfoCircleOutlined />
    </span>
    <span v-else>{{ state }}</span>

    <!-- <span>{{ state }}</span> -->
  </div>
</template>

<style scoped>
.msg-state {
  display: flex;
  height: 40px;
  align-items: center;
}
.error {
  color: red;
}
:deep(.send-error .ant-btn) {
  font-size: 12px;
}
</style>
