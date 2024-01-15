<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMembersList } from './commons/useMembersList';
import { useI18n } from 'vue-i18n';
import ChatObject from '../../components/ChatObject.vue';
import Loading from '../../components/Loading.vue';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();
const selectable = ref(false);
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
    maxResultCount: 40,
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
      <div class="search-section">
        <a-input-search
          v-model:value="query.keyword"
          :placeholder="t('Search')"
          enter-button
          @search="onSearch"
        />
      </div>

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
            <chat-object :entity="item.owner" :size="44">
              <!-- <template #title>title-left</template> -->
              <!-- <template #title-right>title-right555</template> -->
              <template #sub>{{ t('JoinTime') }}:{{ item.creationTime }}</template>
              <!-- <template #footer>
                <a-button @click="addFriend(item)">添加/关注</a-button>
              </template> -->
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


.search-section {
  display: flex;
  padding: 12px;
  border-bottom: 1px solid var(--divider-color);
}
.data-list {
  display: flex;
  flex-direction: column;
  --split-size: 12px;
  padding: 12px;
}
.data-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* height: 32%; */
  padding: 0 12px;
  /* height: 100px; */
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

</style>
