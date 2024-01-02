<script setup lang="ts">
import { computed, createVNode, ref, watch } from 'vue';
import { Modal, message } from 'ant-design-vue';
import { MessageDto, MessageSimpleDto } from '../../../apis/dtos';
import { MessageStateEnums } from '../../../apis/enums';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useProgressStore } from '../../../stores/progress';

const props = defineProps<{
  entity?: MessageDto;
  state?: MessageStateEnums;
}>();

const progressStore = useProgressStore();
const uploadProgress = computed(() => progressStore.get(`${props.entity?.autoId}`));
const percent = computed(() => uploadProgress.value?.percent);
const status = ref<'success' | 'exception' | 'normal' | 'active'>('success');
watch(percent, p => {
  if (Number(p) == 100) {
    status.value = 'success';
  }
});

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

const format = (number: number) => `发送中 ${number}%`;
</script>

<template>
  <div v-if="state != MessageStateEnums.Ok" class="msg-state">
    <template v-if="state == MessageStateEnums.Sending">
      <a-progress
        v-if="uploadProgress"
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
      <a-spin v-else size="small" />
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
