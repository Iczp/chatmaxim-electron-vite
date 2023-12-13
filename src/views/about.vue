<script setup lang="ts">
import { Ref, reactive, ref } from 'vue';
import { connect, generateTickect } from '../apis/websockets';
import { ChatObjectDto, ResultValue } from '../apis/dtos';
import { ChatObjectService, OfficialService, SessionRequestService } from '../apis';
import { ChatObjectTypeEnumText, ChatObjectTypeEnums } from '../apis/enums';
import ChatObject from '../components/ChatObject.vue';
import SearchInput from '../components/SearchInput.vue';
// defineProps<{ msg: string }>();
const count = ref(0);
const onClick = () => {
  count.value++;
  generateTickect();
  // connect();
};

const keyword = ref('');

const searchResult = reactive<ResultValue<ChatObjectDto>>({
  isPosting: false,
  isEof: false,
  totalCount: 0,
  items: [],
});

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

const onInput = (e: any) => {
  console.log(e.target.value);
};
</script>

<template>
  <page>
    <page-title title="About" description="Electron + Vite + TypeScript" />

    <page-content>
      <SearchInput @input="onInput"></SearchInput>
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

      <a-space>
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
            <!-- </a-input-group>
      <a-input-group compact> -->
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

      <chat-object
        v-for="(item, index) in searchResult.items"
        :footer="true"
        :key="item.id"
        :entity="item"
        class="atavar-layout"
        :size="32"
        icon="arrow"
      >
        <!-- <template #title>title-left</template> -->
        <!-- <template #title-right>title-right555</template> -->
        <!-- <template #sub>sub-left555</template> -->
        <template #footer>
          <a-button @click="addFriend(item)">添加/关注</a-button>
        </template>
      </chat-object>

      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

      <a-space wrap>
        <a-button type="primary">Primary Button</a-button>
        <a-button>Default Button</a-button>
        <a-button type="dashed">Dashed Button</a-button>
        <a-button type="text">Text Button</a-button>
        <a-button type="link">Link Button</a-button>
      </a-space>

      <a-menu>
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="#1">General</a>
        </a-menu-item>
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="#2">Layout</a>
        </a-menu-item>
        <a-menu-item>
          <a target="_blank" rel="noopener noreferrer" href="#3">Navigation</a>
        </a-menu-item>
      </a-menu>
    </page-content>
    <page-footer>footer</page-footer>
  </page>
</template>

<style scoped></style>
