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
  onReachStart,
  onReachEnd,
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
.data-item {
  padding: 0 20px;
}

.search-section {
  display: flex;
  padding: 12px;
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
