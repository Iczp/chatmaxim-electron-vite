<script setup lang="ts">
import { ref } from 'vue';
import BaseSetting from './widget/BaseSetting.vue';
import NetworkSetting from './widget/NetworkSetting.vue';
import ShortcutSetting from './widget/ShortcutSetting.vue';
import About from './widget/About.vue';
import { TabsProps } from 'ant-design-vue/es/tabs';
const tabPosition = ref<TabsProps['tabPosition']>('left');
const activeKey = ref('base');
import { useAppInfo } from '../../commons/useAppInfo';
// defineProps<{ msg: string }>();

import { reactive, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';

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

const { appId, appName, author, websize, version, copyright } = useAppInfo();
</script>

<template>
  <page class="page">
    <page-title class="header" title="设置" />
    <page-content>
      <a-tabs class="tabs" v-model:activeKey="activeKey" :tab-position="tabPosition" animated>
        <a-tab-pane key="base" tab="基础设置">
          <BaseSetting />
        </a-tab-pane>
        <a-tab-pane key="shortcut" tab="快捷方式">
          <ShortcutSetting />
        </a-tab-pane>
        <a-tab-pane key="network" tab="网络设置">
          <NetworkSetting />
        </a-tab-pane>
        <a-tab-pane key="about" tab="关于">
          <About />
        </a-tab-pane>
        <template #rightExtra>
          <div class="version">v{{ version }}</div>
        </template>
      </a-tabs>
    </page-content>
    <!-- <page-footer class="footer">
      {{ version }}
    </page-footer> -->
  </page>
</template>

<style scoped>
.page {
  user-select: none;
}
.header {
  background-color: unset;
  border: none;
}
.footer {
  background-color: unset;
  border: none;
  color: #ccc;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  height: 32px;
}
.tabs {
  height: 100%;
}
:deep(.ant-tabs-tab:hover) {
  background-color: #e6e6e6d5;
}
:deep(.ant-tabs-nav) {
  min-width: 100px;
}
:deep(.ant-tabs-left > .ant-tabs-content-holder) {
  /* margin-left: -1px; */
  border-left: 1px solid #d8d8d8;
}
.version {
  color: #ccc;
  font-size: 12px;
  display: flex;
  height: 24px;
}
</style>
