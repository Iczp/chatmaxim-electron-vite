<script setup lang="ts">
import { useAppInfo } from '../../../commons/useAppInfo';
import { reactive, ref, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';

interface FormState {
  server: string;
  authHost: string;
  clientId: string;
  clientSecret: string;
}
const formState: UnwrapRef<FormState> = reactive({
  server: import.meta.url,
  authHost: import.meta.env.VITE_APP_AUTH_HOST,
  clientId: import.meta.env.VITE_APP_CLIENT_ID,
  clientSecret: import.meta.env.VITE_APP_CLIENT_SECRET,
});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
};
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 14 };

const { appId, appName, author, websize, version, copyright } = useAppInfo();
const title = ref('')
</script>

<template>
  <page>
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view>
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-divider orientation="left">server</a-divider>
          <!-- <a-divider dashed >aa</a-divider> -->
          <a-form-item label="服务器地址">
            <a-input v-model:value="formState.server" />
          </a-form-item>

          <a-form-item label="授权地址">
            <a-input v-model:value="formState.authHost" />
          </a-form-item>
          <a-divider orientation="left">client</a-divider>
          <a-form-item label="client_id">
            <a-input v-model:value="formState.clientId" />
          </a-form-item>

          <a-form-item label="client_secret">
            <a-input type="password" v-model:value="formState.clientSecret" />
          </a-form-item>
        </a-form>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped></style>
