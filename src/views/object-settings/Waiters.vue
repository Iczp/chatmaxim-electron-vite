<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue';
import { useWaitersList } from './commons/useWaitersList';
import { useI18n } from 'vue-i18n';
import ChatObject from '../../components/ChatObject.vue';
import Loading from '../../components/Loading.vue';
import { Plus } from '../../icons';
import WaiterFormModal from './widget/WaiterFormModal.vue';
import {
  PlusOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  SearchOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue';
import { SessionUnitOwnerDto } from '../../apis';
import { ChatObjectDto, SessionUnitDestinationDto } from '../../apis/dtos';
import { usePayload } from '../../commons/usePayload';
import { getDisplayName, getParentName } from '../../commons/utils';
// import {RecycleScroller} from 'vue-virtual-scroller/RecycleScroller'
const { t } = useI18n();
const props = defineProps<{ chatObjectId: string }>();
const payload = usePayload<{ owner: ChatObjectDto }>();
const formModal = ref<InstanceType<typeof WaiterFormModal> | null>();
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
} = useWaitersList({
  input: {
    isContainsShopKeeper: false,
    shopKeeperId: Number(props.chatObjectId),
    maxResultCount: 999,
  },
});

const onReachStart = (event: CustomEvent) => {
  console.info('onReachStart', event);
};
const onReachEnd = (event: CustomEvent) => {
  console.info('onReachEnd', event);
  // const el = event.target as HTMLElement;

  // const isReachEnd = el.scrollTop != 0; //&& el.scrollTop > el.offsetHeight;
  // if (!isReachEnd) {
  //   console.error(
  //     'onReachEnd',
  //     isReachEnd,
  //     el.clientHeight,
  //     el.offsetHeight,
  //     el.scrollHeight,
  //     el.scrollTop,
  //   );
  //   return;
  // }
  if (isPending.value) {
    console.info('isPending', isPending);
    return;
  }
  if (isEof.value) {
    console.info('isEof', isEof);
    return;
  }

  // fetchNext();
};

onActivated(() => {
  // fetchNext();
  refresh();
});
const onSearch = () => {
  refresh();
};
const onPlus = () => {
  console.log('payload', payload.value);

  formModal.value?.open({
    isAdd: true,
    shopKeeper: payload.value?.owner,
  });
};
const onEdit = (item: ChatObjectDto) => {
  console.log('payload', payload.value);
  formModal.value?.open({
    isAdd: false,
    shopKeeper: payload.value?.owner,
    entity: item,
  });
};
</script>

<template>
  <page>
    <page-title :title="t('ShopWaiter')" :description="chatObjectId" />
    <!-- <a-page-header :title="t('Session Members')" :sub-title="sessionUnitId" /> -->

    <page-content>
      <WaiterFormModal ref="formModal" />
      <div class="section">
        <div class="section-search">
          <a-input
            v-model:value="query.keyword"
            :allowClear="true"
            :placeholder="t('Search')"
            enter-button
          >
            <template #addonAfter>
              <div><SearchOutlined /></div>
            </template>
          </a-input>
        </div>
        <a-button type="text" @click="onPlus">
          <Plus class="svg-icon cursor-pointer" />
        </a-button>
      </div>
      <scroll-view>
        <div class="data-list">
          <!-- <Loading /> -->
          <a
            v-for="item in list"
            :key="item.id"
            :title="getDisplayName(item)"
            class="data-item"
            @click="onEdit(item)"
          >
            <chat-object :entity="item" :sub="getParentName(item)" :size="44">
              <template #title>
                <a-space>
                  <div>{{ item.name }}</div>
                </a-space>
              </template>
              <!-- <template #title-right>title-right555</template> -->
              <!-- <template #sub>{{ t('JoinTime') }}:{{ item.creationTime }}</template> -->
              <template #footer>
                <a-space>
                  <!-- <a-button type="text"><PlusOutlined /></a-button>
                  <a-button type="text"><EditOutlined /></a-button>
                  <a-button type="text"><CloseOutlined /></a-button> -->
                  <a-button class="btn-item" type="text"><MoreOutlined /></a-button>
                </a-space>
              </template>
            </chat-object>
          </a>
          <a class="data-item plus cursor-pointer" @click="onPlus">
            <Plus class="svg-icon-36" />
          </a>
        </div>
      </scroll-view>
    </page-content>
  </page>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
}
.tag-creator {
  font-size: 11px;
}
.btn-item {
  --btn-size: 32px;
  width: var(--btn-size);
  height: var(--btn-size);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 0;
  outline: none;
}
.data-list {
  flex-wrap: wrap;
  flex-direction: row;
}
.data-item {
  padding: 0 20px;
  /* width: 50%; */
  flex-shrink: 1;
  min-width: 240px;
  /* flex: 1; */
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  /* box-sizing: border-box; */
  height: 80px;
}
.data-item.plus {
  color: var(--color);
  border-style: dashed;
  justify-content: center;
  align-items: center;
}
.section-search {
  display: flex;
  /* flex: 1; */
  border-bottom: 1px solid var(--divider-color);
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
</style>
