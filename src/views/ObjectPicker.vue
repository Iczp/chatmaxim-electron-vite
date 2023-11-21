<script setup lang="ts">
import { reactive, ref } from 'vue';
import { generateTickect } from '../apis/websockets';
import { ChatObjectDto, ResultValue } from '../apis/dtos';
import { ChatObjectService, OfficialService, SessionRequestService } from '../apis';
import { ChatObjectTypeEnumText, ChatObjectTypeEnums } from '../apis/enums';
import { useTitle } from '@vueuse/core';
import { sendResult } from '../commons/objectPicker';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useFetchValue } from '../commons/useFetchValue';

const route = useRoute();

const title = useTitle((route.query.title as string) ?? '转发');

const props = defineProps<{
  title?: string;
  chatObjectId: Number;
  ticks?: Number;
}>();

const isLoading = ref(true);

const searchResult = reactive<ResultValue<ChatObjectDto>>({
  isPosting: false,
  isEof: false,
  totalCount: 0,
  items: [],
});

useFetchValue<{}>({
  show: true,
  size: {
    width: 500,
    height: 750,
  },
}).then(res => {
  console.log('useFetchValue', res);
  if (res) {
  }
  isLoading.value = false;
});

// 与 beforeRouteLeave 相同，无法访问 `this`
onBeforeRouteLeave((to, from) => {
  console.log('onBeforeRouteLeave', to, from);
});

// 与 onBeforeRouteUpdate 相同，无法访问 `this`
onBeforeRouteUpdate((to, from) => {
  title.value = route.fullPath;
  console.log('onBeforeRouteUpdate', to, from);
});

const count = ref(0);
const onClick = () => {
  count.value++;
  generateTickect();
  // connect();
};

const keyword = ref('');

const onSearch = () => {
  ChatObjectService.getApiChatChatObject({
    objectType: objectType.value,
    keyword: keyword.value,
    maxResultCount: 20,
  }).then(res => {
    searchResult.totalCount = res.totalCount!;
    searchResult.items = res.items!;
  });
};

const addFriend = (item: ChatObjectDto) => {
  if (item.objectType == ChatObjectTypeEnums.Official) {
    OfficialService.postApiChatOfficialSubscribe({
      ownerId: 13,
      destinationId: item.id!,
    }).then(res => {
      console.log(res);
    });
    return;
  }

  SessionRequestService.postApiChatSessionRequest({
    ownerId: 13,
    destinationId: item.id!,
    requestMessage: 'add from Election App.',
  }).then(res => {
    console.log(res);
  });
};

const objectTypes = ref(
  Object.keys(ChatObjectTypeEnums)
    .filter(x => !isNaN(Number(x)))
    .map((key, index) => {
      return {
        key: ChatObjectTypeEnums[Number(key)],
        text: ChatObjectTypeEnumText[index as ChatObjectTypeEnums],
        value: key,
      };
    }),
);

const objectType = ref<ChatObjectTypeEnums>();

const activeKey = ref('all');

const onCancle = (): void => {
  const { event } = route.query;
  console.log('event', event);
  sendResult(event as string, {
    success: false,
    message: 'User canceled!',
  });
};
const onConfirm = (): void => {
  const { event } = route.query;
  console.log('router', route);
  sendResult(event as string, {
    success: true,
    message: 'ok',
    selectedItems: [{ id: 'abc123' }],
  });
};
</script>

<template>
  <page :loading="isLoading">
    <page-title :title="title || chatObjectId" description="Electron + Vite + TypeScript" />
    <page-content>
      <scroll-view>
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="all" tab="所有">所有</a-tab-pane>
          <a-tab-pane v-for="(item, index) in objectTypes" :key="index" :tab="item.text">
            {{ item.text }} ({{ item.key }} )
          </a-tab-pane>
          <template #leftExtra>
            <a-button type="text" class="tabs-extra-demo-button">Left</a-button>
          </template>
          <template #rightExtra>
            <a-input-search
              v-model:value="keyword"
              placeholder="搜索：公众号"
              enter-button
              @search="onSearch"
            />
          </template>
        </a-tabs>

        <h2 @click="onClick">{{ count }}</h2>
        <a-space>
          <a-button @click="onClick">Connect to websocket</a-button>
          <RouterLink to="/contacts/13?id=321">Contacts:13</RouterLink>
          <RouterLink to="/contacts/14?id=321">Contacts:14</RouterLink>
        </a-space>

        <div>
          {{ ChatObjectTypeEnumText }}
          <a-space direction="vertical">
            <a-input-group compact>
              <a-select v-model:value="objectType" style="width: 160px">
                <a-select-option
                  v-for="(item, index) in objectTypes"
                  :value="item.value"
                  :key="index"
                >
                  {{ item.text }} ({{ item.key }} )
                </a-select-option>
              </a-select>

              <a-input-search
                v-model:value="keyword"
                placeholder="搜索：公众号"
                enter-button
                @search="onSearch"
              />
            </a-input-group>
          </a-space>
        </div>
        <!-- <a-loading></a-loading> -->
        <h3 v-for="(item, index) in searchResult.items">
          {{ item.fullPathName }} - {{ item.id }}
          <a-button @click="addFriend(item)">添加/关注</a-button>
        </h3>

        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      </scroll-view>
    </page-content>
    <page-footer class="footer">
      <a-space size="large">
        <a-button type="default" @click="onCancle">取消</a-button>
        <a-button type="primary" @click="onConfirm">确定转发(1)</a-button>
      </a-space>
    </page-footer>
  </page>
</template>

<style scoped>
.footer {
  justify-content: flex-end;
  padding: 0 24px;
}
</style>
