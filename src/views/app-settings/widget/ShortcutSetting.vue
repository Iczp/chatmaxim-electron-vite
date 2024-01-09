<script setup lang="ts">
import { useAppInfo } from '../../../commons/useAppInfo';
import { reactive, ref, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';

const value2 = ref<string>('+');
const value3 = ref<string>('Ctrl');
const value4 = ref<string>('N');
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
        <a-form
          class="form"
          layout="horizontal"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-divider class="divider" orientation="left">Global</a-divider>
          <a-form-item label="提取消息">
            <a-input v-model:value="formState.fetchMessage" />
          </a-form-item>

          <a-form-item label="发送消息">
            <!-- <a-input v-model:value="formState.sendMessage" /> -->
            <a-select v-model:value="formState.sendMessage">
              <a-select-option value="Ctrl + Enter">Ctrl + Enter</a-select-option>
              <a-select-option value="Enter">Enter</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="创建群">
            <a-input v-model:value="value2">
              <template #addonBefore>
                <a-select v-model:value="value3" style="width: 80px">
                  <a-select-option value="Ctrl">Ctrl</a-select-option>
                  <a-select-option value="Alt">Alt</a-select-option>
                </a-select>
              </template>
              <template #addonAfter>
                <a-select v-model:value="value4" style="width: 60px">
                  <a-select-option value="D">D</a-select-option>
                  <a-select-option value="N">N</a-select-option>
                </a-select>
              </template>
            </a-input>
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
</style>
