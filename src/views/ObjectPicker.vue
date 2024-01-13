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
const { t } = useI18n();
const route = useRoute();

const title = useTitle((route.query.title as string) ?? t('Forward'));

const props = defineProps<{
  title?: string;
  chatObjectId: number | string;
  ticks?: number;
}>();

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
    query.value.ownerId = Number(v);
    // list.value = [];
    fetchNext();
  },
);

const isItemDisabled = (item: ContactsDto) => !item.setting?.isInputEnabled || isDisabled(item);
const remoteStore = useRemoteStore<ObjectPickerPayLoad>();
watch(
  () => remoteStore.value,
  v => {
    picker.value = v;
  },
);

const isLoading = ref(false);

const searchResult = reactive<ResultValue<ChatObjectDto>>({
  isPosting: false,
  isEof: false,
  totalCount: 0,
  items: [],
});

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
  const pickerResult = {
    success: true,
    message: 'ok',
    selectedItems: getSelectItems(),
  };
  console.log('pickerResult', pickerResult);
  sendResult(event as string, pickerResult);
};

const onReachStart = (event: CustomEvent) => {
  console.info('onReachStart');
};
const onReachEnd = (event: CustomEvent) => {
  const el = event.target as HTMLElement;
  console.info('onReachEnd');
  const isReachEnd = el.scrollTop != 0; //&& el.scrollTop > el.offsetHeight;
  if (!isReachEnd) {
    console.error(
      'onReachEnd',
      isReachEnd,
      el.clientHeight,
      el.offsetHeight,
      el.scrollHeight,
      el.scrollTop,
    );
    return;
  }

  fetchNext();
};

onMounted(() => {
  fetchNext();
});
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
      <scroll-view @ps-y-reach-end="onReachEnd" @ps-y-reach-start="onReachStart">
        <div class="data-list">
          <div
            v-for="(item, index) in list"
            :key="item.id"
            class="data-item"
            :class="{ checked: isChecked(item), disabled: isItemDisabled(item) }"
            @click="toggleChecked(item)"
          >
            <a-checkbox
              :checked="isChecked(item)"
              :disabled="isItemDisabled(item)"
              class="check-box"
            ></a-checkbox>
            <chat-object :entity="item.destination" class="chat-object" :size="32">
              <!-- <template #title>title-left</template> -->
              <!-- <template #title-right>title-right555</template> -->
              <!-- <template #sub>sub-left555</template> -->
              <!-- <template #footer>
                <a-button @click="addFriend(item)">添加/关注</a-button>
              </template> -->
            </chat-object>
          </div>
          <Loading v-if="isPending" :height="48" />
          <div>总数:{{ list.length }}/{{ totalCount }}</div>
        </div>

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
                :placeholder="`${t('Search')}:${t('Room')},${t('Official')}...`"
                enter-button
                @search="onSearch"
              />
            </a-input-group>
          </a-space>
        </div>
      </scroll-view>
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
  padding: 4px 12px;
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
