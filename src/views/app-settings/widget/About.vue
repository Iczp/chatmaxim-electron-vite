<script setup lang="ts">
import { useAppInfo } from '../../../commons/useAppInfo';
import { reactive, h, ref, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import { ContentCopy } from '../../../icons';
import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import CopyBox from '../../../components/CopyBox.vue';
import { computed } from 'vue';
const { t } = useI18n();
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

const versionInfo = computed(() =>
  Object.entries(versions.value)
    .map(([key, value]) => `${key}:${value}`)
    .join('\n'),
);
const title = ref('');
</script>

<template>
  <page>
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view class="scroll-view">
        <!-- {{ versions }} -->
        <a-divider class="divider" orientation="left">{{ t('Application') }}</a-divider>
        <a-descriptions
          class="descriptions"
          :title="`${appName} v${version}`"
          size="small"
          :column="2"
        >
          <template #extra>
            <CopyBox :value="versionInfo" :text="t('Copy')" />
          </template>
          <a-descriptions-item v-for="(value, key) in versions" :key="key" :label="key">
            {{ value }}
          </a-descriptions-item>
        </a-descriptions>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped>
.scroll-view {
  padding: 0;
}
.divider {
  font-size: 12px;
  color: #999;
}
.descriptions {
  padding: 0 24px;
}
.ps {
  height: 100%;
}
:deep(.ant-descriptions-small .ant-descriptions-row > td) {
  padding: 0 0;
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
