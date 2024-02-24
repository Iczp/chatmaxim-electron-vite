<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMembersList } from './commons/useMembersList';
import { useI18n } from 'vue-i18n';
import ChatObject from '../../components/ChatObject.vue';
import Loading from '../../components/Loading.vue';

import {
  PlusOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  EditOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue';
import { SessionUnitOwnerDto } from '../../apis';
import { SessionUnitDestinationDto } from '../../apis/dtos';
// import {RecycleScroller} from 'vue-virtual-scroller/RecycleScroller'
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();

const {
  totalCount,
  query,
  isPending,
  list,
  isBof,
  isEof,
  onReachStart,
    onReachEnd,
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
} = useMembersList({
  input: {
    id: props.sessionUnitId,
    isPublic: true,
    maxResultCount: 40,
  },
});

const onReachStart1 = (event: CustomEvent) => {
  console.info('onReachStart', event);
};
const onReachEnd1 = (event: CustomEvent) => {
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

  fetchNext();
};

onMounted(() => {
  fetchNext();
});
const onSearch = () => {
  refresh();
};
</script>

<template>
  <page>
    <page-title :title="t('Session Members')" :description="sessionUnitId" />
    <!-- <a-page-header :title="t('Session Members')" :sub-title="sessionUnitId" /> -->
    <page-content>
      <div class="section section-search">
        <a-input-search
          v-model:value="query.keyword"
          :allowClear="true"
          :placeholder="t('Search')"
          enter-button
          @search="onSearch"
        />
      </div>
      <!-- <Loading /> -->
      <!-- <scroll-view @ps-y-reach-end="onReachEnd" @ps-y-reach-start="onReachStart"> -->
      <RecycleScroller
        class="scroller"
        :items="list"
        :item-size="56"
        key-field="id"
        @scroll-start="onReachStart"
        @scroll-end="onReachEnd"
      >
        <template #before>
          <div class="section">总数:{{ list.length }}/{{ totalCount }}</div>
        </template>
        <template v-if="isPending" #after><Loading /></template>
        <template v-else-if="isEof" #after>{{ t('DividerEnd') }}</template>
        <template v-slot="{ item }: { item: SessionUnitDestinationDto }">
          <div
            :key="item.id"
            class="data-item"
            :class="{ checked: isChecked(item), disabled: isDisabled(item) }"
            @click="toggleChecked(item)"
          >
            <chat-object :entity="item.owner" :size="44">
              <template #title>
                <a-space>
                  <div>{{ item.owner?.name }}</div>
                  <a-tag
                    v-if="item.setting?.isCreator"
                    class="tag-creator"
                    color="pink"
                  >
                    群主
                  </a-tag>
                </a-space>
              </template>
              <!-- <template #title-right>title-right555</template> -->
              <template #sub>{{ t('JoinTime') }}:{{ item.creationTime }}</template>
              <template #footer>
                <a-space>
                  <!-- <a-button type="text"><PlusOutlined /></a-button>
                  <a-button type="text"><EditOutlined /></a-button>
                  <a-button type="text"><CloseOutlined /></a-button> -->
                  <a-button class="btn-item" type="text"><MoreOutlined /></a-button>
                </a-space>
              </template>
            </chat-object>
            <a-checkbox
              v-if="selectable"
              :checked="isChecked(item)"
              :disabled="isDisabled(item)"
              class="check-box"
            ></a-checkbox>
          </div>
        </template>
      </RecycleScroller>
    </page-content>
  </page>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.tag-creator{
  
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
.data-item {
  padding: 0 20px;
}
.section-search {
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
