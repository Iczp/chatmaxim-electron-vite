<script setup lang="ts">
import { useAppInfo } from '../../../commons/useAppInfo';
import { reactive, ref, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import { env } from '../../../env';

interface FormState {
  server: string;
  authHost: string;
  clientId: string;
  clientSecret: string | undefined;
}
const formState: UnwrapRef<FormState> = reactive({
  server: env.base_url,
  authHost: env.auth_host,
  clientId: env.client_id,
  clientSecret: env.client_secret,
});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
};
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 16 };

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
          <a-divider class="divider" orientation="left">Server</a-divider>
          <!-- <a-divider dashed >aa</a-divider> -->
          <a-form-item label="服务器地址">
            <a-input v-model:value="formState.server" />
          </a-form-item>

          <a-form-item label="授权地址">
            <a-input v-model:value="formState.authHost" />
          </a-form-item>
          <a-divider class="divider" orientation="left">Client</a-divider>
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

<style scoped>
.form {
  padding: 0;
}
.divider {
  font-size: 12px;
  color: #999;
}
</style>
