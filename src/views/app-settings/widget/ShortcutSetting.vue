<script setup lang="ts">
import { useAppInfo } from '../../../commons/useAppInfo';
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
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 14 };

const { appId, appName, author, websize, version, copyright } = useAppInfo();
</script>

<template>
  <scroll-view>
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="提取消息">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item label="发送消息">
        <a-input v-model:value="formState.name" />
      </a-form-item>
    </a-form>
  </scroll-view>
</template>

<style scoped></style>
