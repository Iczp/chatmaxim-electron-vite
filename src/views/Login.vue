<script setup lang="ts">
import { reactive } from 'vue';
import { login } from '../apis/auth/TokenController';
import { router } from '../routes';

import { message } from 'ant-design-vue';
import { ref } from 'vue';
const key = 'updatable';

interface FormState {
  username: string;
  password: string;
  isAutoLogin: boolean;
}

const formState = reactive<FormState>({
  username: 'admin',
  password: '1q2w3E*',
  isAutoLogin: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values, message);
  message.loading({ content: 'Loading...', key });
  login({
    username: formState.username,
    password: formState.password,
  }).then(res => {
    console.log('登录成功！', res);
    message.success({ content: '欢迎回来!', key, duration: 2 });
    router.push('/');
  });
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<template>
  <div class="page drag">
    <div class="login-page no-drag">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="login-form"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="isAutoLogin" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.isAutoLogin">自动登录</a-checkbox>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
.login-page {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* background-color: rgb(11, 7, 37); */
}
.login-form {
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  margin: 0 auto;
  max-width: 500px;
}
</style>
