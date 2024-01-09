<script setup lang="ts">
import { ref } from 'vue';
import { TabsProps } from 'ant-design-vue/es/tabs';
const tabPosition = ref<TabsProps['tabPosition']>('left');
const activeKey = ref('1');
import { useAppInfo } from '../../../commons/useAppInfo';
// defineProps<{ msg: string }>();

import { reactive, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import { setWindow } from '../../../commons/setWindow';
import { setColorScheme } from '../../../commons/setColorScheme';

interface FormState {
  colorScheme: string;
  isOpenAtLogin: boolean;
  type: string[];
  resource: string;
  desc: string;
}
const formState: UnwrapRef<FormState> = reactive({
  colorScheme: 'light',
  isOpenAtLogin: false,
  type: [],
  resource: '',
  desc: '',
});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
};
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 14 };

const { appId, appName, author, websize, version, copyright } = useAppInfo();
const title = ref('');

const onColorSchemeChange = (e: any) => {
  console.log('onColorSchemeChange', e);
  const colorScheme = e.target.value;
  setColorScheme({ colorScheme });
};
</script>

<template>
  <page>
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view>
        <a-form class="form" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-divider class="divider" orientation="left">主题</a-divider>
          <a-form-item label="颜色">
            <a-radio-group v-model:value="formState.colorScheme" @change="onColorSchemeChange">
              <a-radio-button value="light">明亮</a-radio-button>
              <a-radio-button value="dark">暗黑</a-radio-button>
              <a-radio-button value="green">green</a-radio-button>
              <a-radio-button value="blue">blue</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-divider class="divider" orientation="left">系统</a-divider>
          <a-form-item label="开机启动">
            <a-switch v-model:checked="formState.isOpenAtLogin" />
          </a-form-item>
          <!-- <a-form-item label="Activity type">
            <a-checkbox-group v-model:value="formState.type">
              <a-checkbox value="1" name="type">Online</a-checkbox>
              <a-checkbox value="2" name="type">Promotion</a-checkbox>
              <a-checkbox value="3" name="type">Offline</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="Resources">
            <a-radio-group v-model:value="formState.resource">
              <a-radio value="1">Sponsor</a-radio>
              <a-radio value="2">Venue</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="Activity form">
            <a-textarea v-model:value="formState.desc" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 14 }">
            <a-button>应用</a-button>
            <a-button style="margin-left: 10px" type="primary" @click="onSubmit">保存</a-button>
          </a-form-item> -->
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
</style>
