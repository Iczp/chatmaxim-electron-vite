<script setup lang="ts">
import { ref } from 'vue';
import { ContentCopy } from '../../../icons';
import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
import { useWindowStore } from '../../../stores/window';
import { useAppInfo } from '../../../commons/useAppInfo';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };
const windowStore = useWindowStore();

const machineId = ref(windowStore.machineId);
const { copy, isSupported } = useClipboard();
const platform = ref(process.platform);
// console.log('process', process);

const copyContent = (contentText: string | undefined) => {
  // let contentText = machineId.value || '';
  if (!contentText) {
    return;
  }
  copy(contentText).then(v => {
    message.success({ content: `${t('Copied')}!`, duration: 2 });
  });
};
const title = ref('');
const { appId, appName, author, websize, version, copyright } = useAppInfo();
</script>

<template>
  <page>
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view>
        <a-form class="form" :label-col="labelCol" layout="horizontal" :wrapper-col="wrapperCol">
          <a-divider class="divider" orientation="left">{{ t('Device') }}</a-divider>
          <a-form-item :label="t('AppId')">
            <a-input v-model:value="appId" readonly>
              <template #addonAfter>
                <div @click="copyContent(appId)"><ContentCopy class="svg-icon-14" /></div>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item :label="t('MachineId')">
            <a-input v-model:value="machineId" readonly>
              <template #addonAfter>
                <div @click="copyContent(machineId)"><ContentCopy class="svg-icon-14" /></div>
              </template>
            </a-input>
          </a-form-item>

          <a-divider class="divider" orientation="left">{{ t('Author') }}</a-divider>

          <a-form-item :label="t('Websize')">
            <a-input v-model:value="websize" readonly>
              <template #addonAfter>
                <div @click="copyContent(websize)"><ContentCopy class="svg-icon-14" /></div>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item :label="t('Platform')">
            <div>{{ platform }}</div>
          </a-form-item>
          <a-form-item :label="t('Author')">
            <div>{{ author }}</div>
          </a-form-item>
          <a-form-item :label="t('Copyright')">
            <div>{{ copyright }}</div>
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped>
.form {
  padding: 0;
}

.divider {
  font-size: 12px;
  color: #999;
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
