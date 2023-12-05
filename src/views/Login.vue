<script setup lang="ts">
import { app, ipcRenderer } from 'electron';
// // const electron = require('electron');
// const path = require('path');
// const fs = require('fs');
// const userDataPath = app.getPath('userData');

// let win = app.remote.getCurrentWindow()
// // win.setBounds({
// //     width: 320,
// //     height: 480,
// // })
// win.center()
// win.setMaximizable(false)
// win.setFullScreenable(false)
// win.setResizable(false)

import { reactive } from 'vue';
import { login, isLogined } from '../apis/auth/TokenController';
import { router } from '../routes';

import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { setWindow } from '../commons/setWindow';
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

  ipcRenderer.send('login', 'ping');

  // window.electronAPI.setTitle(title)
  // window.electron?.ping();
  login({
    username: formState.username,
    password: formState.password,
  })
    .then(res => {
      console.log('登录成功！', res);
      message.success({ content: '欢迎回来!', key, duration: 2 });
      setWindow({ size: { width: 1080, height: 760 } });
      router.push('/');
    })
    .catch(err => {
      message.error({ content: err.message, key, duration: 2 });
    });
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<template>
  <page>
    <page-title title="登录"></page-title>
    <page-content>
      <div class="page drag">
        <div class="login-page no-drag">
          <div>isLogined:{{ isLogined() }}</div>
          <!-- <p>userDataPath:{{ userDataPath }}</p> -->
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
              <a-input v-model:value="formState.username">
                <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>

            <a-form-item
              label="密码"
              name="password"
              :rules="[{ message: 'Please input your password!' }]"
            >
              <a-input-password v-model:value="formState.password">
                <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input-password>
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
    </page-content>
  </page>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
.login-page {
  padding: 20px;
  /* position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(11, 7, 37);
  box-shadow: 0 0 5px #cccccc89;
  padding: 30px;
  border-radius: 5px; */
}
.login-page:hover {
  box-shadow: 0 0 10px #cccccc89;
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
