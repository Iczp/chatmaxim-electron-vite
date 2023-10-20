<script setup lang="ts">
import { Ref, reactive, ref } from 'vue';
defineProps<{ msg: string }>();

import {
  ChatObjectService,
  IczpNet_Chat_SessionUnits_Dtos_BadgeDto,
  SessionUnitService,
} from '../apis';
import { login } from '../apis/auth/TokenController';
import { Volo_Abp_Application_Dtos_PagedResultDto_1 } from '../apis/models/Volo_Abp_Application_Dtos_PagedResultDto_1';
import { Button } from 'ant-design-vue';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const count = ref(0);
const d = reactive({
  d: 'Volo_Abp_Application_Dtos_PagedResultDto_1',
});
const sessionUnitRet: Ref<Volo_Abp_Application_Dtos_PagedResultDto_1 | undefined> = ref({});
const onclick = (): void => {
  count.value++;

  // login().then((res: AxiosResponse<Body<any>, any>) => {
  //   console.log('login res', res.data);
  // });
  console.log('click', count.value);

  SessionUnitService.getApiChatSessionUnit1({
    ownerId: 555,
  }).then(res => {
    sessionUnitRet.value = res;
    console.log('res SessionUnitService.getApiChatSessionUnit1', res, res.totalCount);
  });
  SessionUnitService.getApiChatSessionUnit1({
    ownerId: 112,
  }).then(res => {
    sessionUnitRet.value = res;
    console.log('res SessionUnitService.getApiChatSessionUnit1', res, res.totalCount);
  });
  // console.log('SessionUnitService', SessionUnitService.getApiChatSessionUnit1);
};
type BadgeDetialDto = IczpNet_Chat_SessionUnits_Dtos_BadgeDto & {
  isShow: boolean;
  detail?: string;
};
const badgeItems: Ref<BadgeDetialDto[]> = ref([]);

const loadBadgeItems = () => {
  SessionUnitService.getApiChatSessionUnitBadgeByCurrentUser({
    isImmersed: false,
  }).then(res => {
    console.log('badge', res);
    badgeItems.value = res.map(x => ({
      ...x,
      isShow: false,
      detail: undefined,
    }));
  });
};

const username = ref('admin');
const password = ref('1q2w3E*');
const onLogin = () => {
  login({
    username: username.value,
    password: password.value,
  }).then(res => {
    console.log('dddddd', res);
  });
};

const showDetial = (item: BadgeDetialDto) => {
  item.detail = 'dddddd';
  ChatObjectService.getApiChatChatObjectDetail({
    id: item.chatObjectId!,
  }).then(res => {
    item.detail = JSON.stringify(res);
  });
};
</script>

<template>
  <h1>{{ msg }}</h1>
  <a-space wrap>
    <a-button type="primary">Primary Button</a-button>
    <a-button>Default Button</a-button>
    <a-button type="dashed">Dashed Button</a-button>
    <a-button type="text">Text Button</a-button>
    <a-button type="link">Link Button</a-button>
  </a-space>

  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
  <div class="card">
    <Button>dd</Button>
    <div>
      <input v-model="username" type="text" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button type="button" @click="onLogin">sign in</button>
    </div>

    <div>
      <button type="button" @click="loadBadgeItems">loadBadgeItems</button>
    </div>

    <div class="badge-section">
      <div
        v-for="(item, index) in badgeItems"
        :key="index"
        class="badge-item"
        @click="showDetial(item)"
      >
        <div>chatObjectId:{{ item.chatObjectId }}, badge:{{ item.badge }}</div>
        <div v-if="item.detail">detail:{{ item.detail }}</div>
      </div>
    </div>

    <button type="button" @click="onclick">
      count is {{ count }} , sessionUnitRet:{{ sessionUnitRet?.totalCount }}
    </button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code>
      to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>
    , the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.badge-section {
  display: flex;
  flex-direction: column;
}
.badge-item {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid rgb(139, 19, 19);
  margin: 10px;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  background-color: #e9e9e992;
  font-size: 16px;
}
</style>
