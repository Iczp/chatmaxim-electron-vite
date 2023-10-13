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

const count = ref(0);
const d = reactive({
  d: 'Volo_Abp_Application_Dtos_PagedResultDto_1',
});
const sessionUnitRet: Ref<
  Volo_Abp_Application_Dtos_PagedResultDto_1 | undefined
> = ref({});
const onclick = (): void => {
  count.value++;

  // login().then((res: AxiosResponse<Body<any>, any>) => {
  //   console.log('login res', res.data);
  // });
  console.log('click', count.value);

  SessionUnitService.getApiChatSessionUnit1({
    ownerId: 555,
  }).then((res) => {
    sessionUnitRet.value = res;
    console.log(
      'res SessionUnitService.getApiChatSessionUnit1',
      res,
      res.totalCount
    );
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
  }).then((res) => {
    console.log('badge', res);
    badgeItems.value = res.map((x) => ({
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
  }).then((res) => {
    console.log('dddddd', res);
  });
};

const showDetial = (item: BadgeDetialDto) => {
  item.detail = 'dddddd';
  ChatObjectService.getApiChatChatObjectDetail({
    id: item.chatObjectId!,
  }).then((res) => {
    item.detail = JSON.stringify(res);
  });
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
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
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
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
