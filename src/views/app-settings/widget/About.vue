<script setup lang="ts">
import { useAppInfo } from '../../../commons/useAppInfo';
import { reactive, h, ref, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import { ContentCopy } from '../../../icons';
import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
interface FormState {
  name: string;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
};
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const versions = ref(process.versions);
const { appId, appName, author, websize, version, copyright } = useAppInfo();
const iconClass = ref({ class: 'svg-icon s16' });

const { copy, isSupported } = useClipboard();

const copyContent = () => {
  let contentText = Object.entries(versions.value)
    .map(([key, value]) => `${key}:${value}`)
    .join('\n');

  copy(contentText).then(v => {
    message.success({ content: '复制成功!', duration: 2 });
  });
};
</script>

<template>
  <page>
    <page-content>
      <scroll-view>
        <!-- {{ versions }} -->

        <a-descriptions :title="appName" size="small" :column="2">
          <template #extra>
            <!-- <ContentCopy class="svg-icon-14" /> -->
            <a-button type="text" @click="copyContent">
              <ContentCopy class="svg-icon-14" />
              复制
            </a-button>
          </template>
          <a-descriptions-item v-for="(value, key) in versions" :key="key" :label="key">
            {{ value }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- <div v-for="(value, key) in versions" :key="key">
          <span class="label">{{ key }}</span>
          <span class="value">{{ value }}</span>
        </div> -->
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
