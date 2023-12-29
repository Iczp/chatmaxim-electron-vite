<script setup lang="ts">
import { createVNode, ref } from 'vue';
import { Modal, message } from 'ant-design-vue';
import { MessageDto, MessageSimpleDto } from '../../../apis/dtos';
import { MessageStateEnums } from '../../../apis/enums';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
  entity?: MessageDto;
  state?: MessageStateEnums;
}>();

const percent = ref<number>(65);
const status = ref<'success' | 'exception' | 'normal' | 'active'>('active');

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

const format = (number: number) => `进行中，已完成${number}%`;
</script>

<template>
  <div v-if="state != MessageStateEnums.Ok" class="msg-state">
    <template v-if="state == MessageStateEnums.Sending">
      <a-spin size="small" />
      <a-progress
        class="progress"
        type="circle"
        :size="16"
        :status="status"
        :showInfo="true"
        :stroke-color="{
          '0%': '#108ee9',
          '100%': '#87d068',
        }"
        :percent="percent"
        :format="format"
      />
    </template>

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
.progress {
  user-select: none;
}
</style>
