<script setup lang="ts">
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

import { reactive, ref } from 'vue';
import { login, isLogined } from '../apis/auth/TokenController';
import { router } from '../routes';

import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { TokenDto } from '../apis/auth/dto';
import { setAuthorize } from '../ipc/setAuthorize';
import { useAppInfo } from '../commons/useAppInfo';
import { useI18n } from 'vue-i18n';

const { t, d, n, locale, availableLocales } = useI18n();
availableLocales.forEach(locale => {
  console.log(`${locale} locale messages`, locale);
});
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
  message.loading({ content:t('Logging in'), key });
  login({
    username: formState.username,
    password: formState.password,
  })
    .then(res => {
      console.log(`${t('Login succeeded')}!`, res);
      message.success({ content: `${t('Welcome back')}!`, key, duration: 2 });
      // setWindow({ size: { width: 1080, height: 760 } });
      setAuthorize(res.detail as TokenDto);
      router.push('/');
    })
    .catch(err => {
      message.error({ content: err.message, key, duration: 2 });
    });
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const { appId, appName, author, websize, version, copyright } = useAppInfo();
</script>

<template>
  <page>
    <page-title class="header" :title="t('Login')"></page-title>
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
              :label="t('Account')"
              name="username"
              :rules="[{ message: 'Please input your username!' }]"
            >
              <a-input v-model:value="formState.username">
                <template #prefix><UserOutlined class="prefix" /></template>
              </a-input>
            </a-form-item>

            <a-form-item
              :label="t('Password')"
              name="password"
              :rules="[{ message: 'Please input your password!' }]"
            >
              <a-input-password v-model:value="formState.password">
                <template #prefix><LockOutlined class="prefix" /></template>
              </a-input-password>
            </a-form-item>

            <a-form-item name="isAutoLogin" :wrapper-col="{ offset: 8, span: 16 }">
              <a-checkbox v-model:checked="formState.isAutoLogin">
                {{ t('Automatic logon') }}
              </a-checkbox>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
              <a-button type="primary" html-type="submit">{{ t('Login') }}</a-button>
            </a-form-item>
            <!-- {{ locale }} -->
          </a-form>
        </div>
      </div>
    </page-content>
    <page-footer class="footer">
      <div class="version">v{{ version }}</div>
    </page-footer>
  </page>
</template>

<style scoped>
.header {
  background-color: unset;
  border: none;
}
.footer {
  background-color: unset;
  border: none;
  font-size: 12px;
  align-items: center;
  justify-content: center;
}

.page {
  width: 100%;
  height: 100%;
}
.prefix {
  /* color: var(--color); */
  font-weight: normal;
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
  /* box-shadow: 0 0 10px #cccccc89; */
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
../ipc/setAuthorize
