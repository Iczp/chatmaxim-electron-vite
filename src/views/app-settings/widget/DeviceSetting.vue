<script setup lang="ts">
import { ref } from 'vue';
import { ContentCopy } from '../../../icons';
import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
import { useWindowStore } from '../../../stores/window';
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 14 };
const windowStore = useWindowStore();

const machineId = ref(windowStore.machineId);
const { copy, isSupported } = useClipboard();

const copyContent = () => {
  let contentText = machineId.value || '';
  copy(contentText).then(v => {
    message.success({ content: '复制成功!', duration: 2 });
  });
};
const title = ref('');
</script>

<template>
  <page>
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view>
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-divider orientation="left">server</a-divider>
          <!-- <a-divider dashed >aa</a-divider> -->
          <a-form-item label="MachineId">
            <!-- <a-input v-model:value="machineId" /> -->
            <a-input v-model:value="machineId" :read-only="true" readonly>
              <template #addonAfter>
                <div @click="copyContent"><ContentCopy class="svg-icon-14" /></div>
              </template>
            </a-input>
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped>
.ps {
  height: 100%;
}
:deep(.ant-descriptions-small .ant-descriptions-row > td) {
  padding: 2px 0;
}
:deep(.ant-descriptions-item-label) {
  text-transform: capitalize;
  color: #333;
}
:deep(.ant-descriptions-item-content) {
  color: #666;
}
/* .label {
  color: #333;
  text-transform: capitalize;
}
.label::after {
  content: ':';
  margin: 0 5px;
}
.value {
  color: #666;
} */
</style>
