<script setup lang="ts">
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import { PersonAdd } from '../../icons';
import { getDisplayName } from '../../commons/utils';
import { AppDto, ChatObjectDto } from '../../apis/dtos';
import { useI18n } from 'vue-i18n';

import { useEnums } from '../../commons/useEnums';
import { useChatObjectList } from '../../commons/useChatObjectList';
import ChatObject from '../../components/ChatObject.vue';
import Avatar from '../../components/Avatar.vue';
import { onActivated, toRaw } from 'vue';
import Loading from '../../components/Loading.vue';
import { sessionRequest } from '../../ipc/sessionRequest';
import { useImStore } from '../../stores/im';
const { t } = useI18n();

const { objectTypeOptions } = useEnums();
const imStore = useImStore();
const {
  totalCount,
  query,
  isPending,
  list,
  isBof,
  isEof,
  fetchData,
  fetchNext,
  refresh,
  selectable,
  isChecked,
  toggleChecked,
  selectedList,
  disabledList,
  isDisabled,
  maxSelectCount,
  picker: pickerRef,
  getSelectItems,
} = useChatObjectList({
  input: {
    // isPublic: true,
    objectType: undefined,
    maxResultCount: 40,
  },
});

onActivated(() => {
  refresh();
});

const navTo = (item: { label: string; value: any }) => {
  query.value.objectType = item.value;
  console.log('navTo', item);
};
const onItemClick = (item: ChatObjectDto) => {
  console.log('onItemClick', item);
};
const getDescription = (item: ChatObjectDto) => {};
const openObjectProfile = (item: ChatObjectDto) => {};
const add = (item: ChatObjectDto) => {
  sessionRequest({
    t,
    payload: {
      params: {
        ownerId: imStore.chatObjectItems[0]?.id || 0,
        destinationId: item.id!,
        requestMessage: `from markets`,
      },
      destination: toRaw(item),
      owners: imStore.chatObjectItems,
    },
  })
    .then(res => {
      console.log(`sessionRequest`, res);
    })
    .catch(err => {
      console.error(`sessionRequest`, err);
    });
};
</script>

<template>
  <page class="markets-page">
    <aside class="page-aside">
      <header class="page-aside-header">page-aside-header</header>
      <main class="page-aside-main">
        <div class="data-list type-list">
          <a
            v-for="(item, index) in objectTypeOptions"
            :key="index"
            class="data-item type-item active"
            @click="navTo(item)"
          >
            {{ item.label }}
          </a>
        </div>
      </main>
    </aside>
    <main class="page-main">
      <page-title :title="t('Markets')" :description="'1'" />
      <page-content class="page-content">
        <scroll-view>
          {{ isPending }}
          <Loading v-if="isPending" />
          <div class="object-list">
            <div v-for="(item, index) in list" :key="item.id!" class="object-item">
              <a-card hoverable style="width: 240px">
                <!-- <template #cover>
                <div class="div-image"></div>
              </template> -->

                <a-card-meta :title="getDisplayName(item)">
                  <template #avatar>
                    <avatar :entity="item" />
                  </template>
                  <template #description>
                    <div class="description text-ellipsis">{{ item.description || '-' }}</div>
                  </template>
                </a-card-meta>

                <template #actions>
                  <plus-outlined key="edit" @click="add(item)" />
                  <!-- <setting-outlined key="setting" @click="openObjectProfile(item)" /> -->
                  <!-- <edit-outlined key="edit" @click="openObjectProfile(item)" /> -->
                  <ellipsis-outlined key="ellipsis" @click="openObjectProfile(item)" />
                </template>
              </a-card>
            </div>
          </div>
        </scroll-view>
      </page-content>
    </main>
  </page>
</template>

<style scoped>
.markets-page {
  flex-direction: row;
}
.page-content {
  flex-direction: row;
}
.page-aside,
.page-main {
  display: flex;
  flex-direction: column;
}
.page-aside {
  flex-basis: 160px;
  border-right: 1px solid var(--divider-color);
}
.page-main {
  flex: 1;
}

.page-aside-header {
  height: 120px;
}
.type-list {
  padding: 0;
}
.type-item {
  height: 40px;
  /* justify-content: center; */
  align-items: center;
  padding: 20px;
  margin: 2px 10px;
  border-radius: 4px;
  text-decoration: n;
  /* background-color: var(--background-color-normal); */
}
.type-item.active {
  background-color: var(--background-color-active);
}

.object-list {
  /* margin: 30px; */
  display: flex;
  /* width: 100%; */
  align-items: flex-start;
  /* justify-content: center; */
  flex-wrap: wrap;
  padding: 8px;
}
.object-item {
  display: flex;
  /* flex: 1; */
  /* margin: 20px; */
  padding: 8px;
  /* width: 25%; */
  justify-content: center;
}
.description {
  min-height: 22px;
}
</style>
