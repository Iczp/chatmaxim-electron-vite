<script setup lang="ts">
import { ref } from 'vue';
import { useAppInfo } from '../../../commons/useAppInfo';
import { reactive, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import { setColorScheme } from '../../../commons/setColorScheme';
import { useWindowStore } from '../../../stores/window';
import { useColorMode } from '@vueuse/core';
import { getLoginItemSettings, setLoginItemSettings } from '../../../commons/setLoginItemSettings';
import { setLanguage } from '../../../commons/setLanguage';
import { useI18n } from 'vue-i18n';
import { l } from '../../../i18n';

const { t, d, n, locale, availableLocales } = useI18n({
  useScope: 'global',
  inheritLocale: true,
});

const { system, store } = useColorMode();
const windowStore = useWindowStore();
interface FormState {
  colorScheme: string;
  isOpenAtLogin: boolean;
  language: string;
  resource: string;
  desc: string;
}
const formState: UnwrapRef<FormState> = reactive({
  colorScheme: windowStore.colorScheme as string,
  isOpenAtLogin: false,
  language: 'zh-CN',
  resource: '',
  desc: '',
});
const onSubmit = () => {
  console.log('submit!', toRaw(formState));
};
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const { appId, appName, author, websize, version, copyright } = useAppInfo();
const title = ref('');

const onColorSchemeChange = (e: any) => {
  console.log('onColorSchemeChange', e);
  const colorScheme = e.target.value;
  windowStore.setColorScheme(colorScheme);
  setColorScheme({ colorScheme });
};
const onLanguageChange = (language: string) => {
  console.log('onLanguageChange', language);
  setLanguage({
    language,
  });
};
getLoginItemSettings().then(settings => {
  console.log('getLoginItemSettings', settings);

  formState.isOpenAtLogin = settings.openAtLogin;
});
const onIsOpenAtLoginChange = (e: any) => {
  console.log('onIsOpenAtLoginChange', e);
  setLoginItemSettings({
    openAtLogin: !formState.isOpenAtLogin,
  })
    .then(settings => {
      console.log('setLoginItemSettings', settings);
      formState.isOpenAtLogin = settings.openAtLogin;
    })
    .finally(() => {});
};
</script>

<template>
  <page>
    <page-title :title="title"></page-title>
    <page-content>
      <scroll-view>
        <a-form class="form" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-divider class="divider" orientation="left">{{ t('Application') }}</a-divider>
          <a-form-item :label="t('Color scheme')">
            <a-radio-group v-model:value="formState.colorScheme" @change="onColorSchemeChange">
              <a-radio-button value="light" title="light">{{ t('Light') }}</a-radio-button>
              <a-radio-button value="dark" title="dark">{{ t('Dark') }}</a-radio-button>
              <a-radio-button value="auto" title="System preference">
                {{ t('System preference') }}({{ system }})
              </a-radio-button>
              <!-- <a-radio-button value="green">green</a-radio-button>
              <a-radio-button value="blue">blue</a-radio-button> -->
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="t('Language')">
            <!-- <a-input v-model:value="formState.sendMessage" /> -->
            <a-select v-model:value="locale" style="width: 120px" @change="onLanguageChange">
              <a-select-option v-for="item in availableLocales" :value="item">
                {{ l(item) }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-divider class="divider" orientation="left">{{ t('System') }}</a-divider>
          <a-form-item :label="t('Open at login')">
            <a-switch :checked="formState.isOpenAtLogin" @click="onIsOpenAtLoginChange" />
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
  color: var(--color);
}
</style>
