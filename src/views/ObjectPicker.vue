<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { generateTickect } from '../apis/websockets';
import { ChatObjectDto, ContactsDto, ResultValue } from '../apis/dtos';
import { ChatObjectService, OfficialService, SessionRequestService } from '../apis';
import { ChatObjectTypeEnumText, ChatObjectTypeEnums } from '../apis/enums';
import { useTitle } from '@vueuse/core';
import { ObjectPickerPayLoad, sendResult } from '../ipc/objectPicker';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useRemoteStore } from '../commons/useRemoteStore';
import { useContacts } from '../commons/useContacts';
import ChatObject from '../components/ChatObject.vue';
import Loading from '../components/Loading.vue';
import { useI18n } from 'vue-i18n';
import { usePayload } from '../commons/usePayload';
import { env } from '../env';
import { onActivated } from 'vue';

const { t } = useI18n();
const route = useRoute();

const title = useTitle((route.query.title as string) ?? t('Forward'));

const props = defineProps<{
  title?: string;
  chatObjectId: number | string;
  ticks?: number;
}>();

const payload = usePayload<any>();

watch(
  payload,
  v => {
    console.log('windowStore payload', v);
  },
  { immediate: true },
);

const {
  isChecked,
  isDisabled,
  isPending,
  list,
  selectedList,
  disabledList,
  isBof,
  isEof,
  fetchData,
  fetchNext,
  onReachStart,
  onReachEnd,
  query,
  totalCount,
  maxSelectCount,
  toggleChecked,
  picker,
  getSelectItems,
} = useContacts({
  input: { ownerId: Number(props.chatObjectId!) },
});

watch(
  () => props.chatObjectId,
  v => {
    console.warn('#watch props.chatObjectId', v);
    query.value = {
      ownerId: Number(v),
    };
    fetchNext();
    // if (list.value.length < Number(query.value.maxResultCount || 10)) {
    //   fetchNext(query.value);
    // }
  },
);

const isItemDisabled = (item: ContactsDto) => !item.setting?.isInputEnabled || isDisabled(item);

const isLoading = ref(false);

// .then(res => {
//   console.log('useFetchValue', res);
//   if (res) {
//   }
//   isLoading.value = false;
// });

// 与 beforeRouteLeave 相同，无法访问 `this`
onBeforeRouteLeave((to, from) => {
  console.log('onBeforeRouteLeave', to, from);
});

// 与 onBeforeRouteUpdate 相同，无法访问 `this`
onBeforeRouteUpdate((to, from) => {
  console.log('onBeforeRouteUpdate', to, from);
});

const count = ref(0);
const onClick = () => {
  count.value++;
  generateTickect();
  // connect();
};

const keyword = ref('');

const onSearch = () => {};

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
  const pickerResult = {
    success: true,
    message: 'ok',
    selectedItems: getSelectItems(),
  };
  console.log('pickerResult', pickerResult);
  sendResult(event as string, pickerResult);
};
</script>

<template>
  <page :loading="isLoading">
    <page-title :title="title || chatObjectId" />

    <page-content>
      <div class="search-section">
        <a-input-search
          v-model:value="query.keyword"
          :placeholder="t('Search')"
          enter-button
          @search="onSearch"
        />
      </div>
      <RecycleScroller
        class="scroller"
        :items="list"
        :item-size="56"
        key-field="id"
        @scroll-start="onReachStart"
        @scroll-end="onReachEnd"
      >
        <template #before>
          <div>总数:{{ list.length }}/{{ totalCount }}</div>
        </template>
        <template v-if="isPending" #after><Loading /></template>
        <template v-else-if="isEof" #after>{{ t('DividerEnd') }}</template>
        <template v-slot="{ item }">
          <div
            :key="item.id"
            class="data-item"
            :class="{ checked: isChecked(item), disabled: isDisabled(item) }"
            @click="toggleChecked(item)"
          >
            <a-checkbox
              :checked="isChecked(item)"
              :disabled="isDisabled(item)"
              class="check-box"
            ></a-checkbox>
            <chat-object :entity="item.destination" :size="44">
              <!-- <template v-if="env.isDev" #title-right>{{ item?.destination?.id }}</template> -->
              <template v-if="env.isDev" #sub>ownerId:{{ query.ownerId }}</template>
              <!-- <template #footer>
                <a-button @click="addFriend(item)">添加/关注</a-button>
              </template> -->
            </chat-object>
          </div>
        </template>
      </RecycleScroller>
    </page-content>
    <page-footer class="footer">
      <div class="select-result">
        {{ t('SelectedItems') }}:
        <b>{{ selectedList.length }}</b>
      </div>
      <a-space size="large">
        <a-button type="default" @click="onCancle">{{ t('Cancel') }}</a-button>
        <a-button type="primary" @click="onConfirm" :disabled="selectedList.length == 0">
          {{ t('Confirm Forward') }} ({{ selectedList.length }})
        </a-button>
      </a-space>
    </page-footer>
  </page>
</template>

<style scoped>
.search-section {
  display: flex;
  padding: 12px;
  border-bottom: 1px solid var(--divider-color);
}
.data-list {
  display: flex;
  flex-direction: column;
  --split-size: 12px;
}
.data-item {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 0px 12px;
}
.data-item:hover {
  background-color: var(--background-color-hover);
}
.checked,
.checked:hover {
  background: var(--checked-background);
}
.check-box {
  margin: 0 var(--split-size);
}
.chat-object {
  flex: 1;
}

.footer {
  /* justify-content: space-between;
  padding: 0 24px; */
}
.select-result {
  /* color: gray; */
  font-size: 12px;
}
</style>
../ipc/objectPicker
