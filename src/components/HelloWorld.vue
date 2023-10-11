<script setup lang="ts">
import { reactive, ref } from 'vue';
import axios from 'axios';
import request from '../commons/request';
import { AxiosResponse } from 'axios';
import { PagedResultDto } from '../types/abp';
defineProps<{ msg: string }>();

import { SessionUnitService } from '../apis';

const count = ref(0);
// interface PagedResultDto<T extends any[]> {
//   totalCount: number;
//   items: T;
// }
type AxiosResponseType<T> = Promise<AxiosResponse<Body<T>>>;
type Body<T> = {
  code: number;
  data: T;
  message: string;
};

console.log('axios', axios);

const login = (): AxiosResponseType<any> =>
  request('https://localhost:44370/api/chat/session-unit?ownerId=555', {
    method: 'GET',
    data: { ownerId: 555 },
  });

console.log('login', login);

const result: PagedResultDto<any> = reactive({
  totalCount: 123,
  items: [],
});

const onclick = () => {
  count.value++;
  result.totalCount++;
  // login().then((res: AxiosResponse<Body<any>, any>) => {
  //   console.log('login res', res.data);
  // });
  console.log('click', count.value);

  SessionUnitService.getApiChatSessionUnit1(555).then((res) => {
    console.log('res SessionUnitService.getApiChatSessionUnit1', res);
  });
  console.log('SessionUnitService', SessionUnitService.getApiChatSessionUnit1);
};

interface IObjLength {
  length: number;
}
const myLength = (obj: IObjLength, num: number): IObjLength => {
  if (obj.length >= num) {
    return obj;
  } else {
    obj.length = num;
    return obj;
  }
};

const res = myLength({ length: 3 }, 6);
console.log(res); //{ length: 6 }
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="onclick">
      count is {{ count }}

      totalCount:{{ result.totalCount }}
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
</style>
../types/abp
