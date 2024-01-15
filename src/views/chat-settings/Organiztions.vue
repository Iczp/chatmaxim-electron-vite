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
  if (isPending.value) {
    console.info('isPending', isPending);
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
      <div>总数:{{ list.length }}/{{ totalCount }}</div>
      <!-- <scroll-view @ps-y-reach-end="onReachEnd" @ps-y-reach-start="onReachStart"> -->
      <RecycleScroller
        class="scroller"
        :items="list"
        :item-size="56"
        key-field="id"
        @scroll-start="onReachStart"
        @scroll-end="onReachEnd"
      >
        <template #before>before</template>
        <template #after>after</template>
        <template v-slot="{ item }">
          <div
            :key="item.id"
            class="data-item"
            :class="{ checked: isChecked(item), disabled: isDisabled(item) }"
            @click="toggleChecked(item)"
          >
            <chat-object :entity="item.owner" class="chat-object" :size="32">
              <!-- <template #title>title-left</template> -->
              <!-- <template #title-right>title-right555</template> -->
              <!-- <template #sub>sub-left555</template> -->
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
.scroller {
  height: 100%;
  margin-right: 5px;
  margin-bottom: 5px;
  box-sizing: border-box;
}

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
  padding: 4px 12px;
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

/* 滚动槽 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  /* padding: 10px; */
  transition: all 0.3s linear;
  /* background: transparent; */
}
.scroller-container {
}
::-webkit-scrollbar-track {
  border-radius: 5px;
  background: rgba(238, 5, 5, 0.221);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(223, 213, 213, 0.546);
  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s linear;
}

:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 0, 0, 0.546);
}
</style>
