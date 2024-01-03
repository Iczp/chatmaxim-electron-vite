<script setup lang="ts">
import { useAppInfo } from '../../../commons/useAppInfo';
import { reactive, ref, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';

interface FormState {
  fetchMessage: string;
  sendMessage: string;
  type: string[];
  resource: string;
  desc: string;
}
const formState: UnwrapRef<FormState> = reactive({
  fetchMessage: 'Ctrl + D',
  sendMessage: 'Ctrl + Enter',
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
</script>

<template>
  <page>
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view>
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="提取消息">
            <a-input v-model:value="formState.fetchMessage" />
          </a-form-item>

          <a-form-item label="发送消息">
            <a-input v-model:value="formState.sendMessage" />
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped></style>
