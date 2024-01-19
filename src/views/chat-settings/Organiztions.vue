<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMembersList } from './commons/useMembersList';
import { useI18n } from 'vue-i18n';
import ChatObject from '../../components/ChatObject.vue';
import Loading from '../../components/Loading.vue';

import { OverlayScrollbarsComponent, useOverlayScrollbars } from 'overlayscrollbars-vue';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue';

import { useEventObserver } from './commons/useEventObserver';

const contentHidden = ref(false);
const elementHidden = ref(false);
const overlayScrollbarsApplied = ref(true);
const bodyOverlayScrollbarsApplied = ref<boolean | null>(null);
const osRef = ref<OverlayScrollbarsComponentRef | null>(null);
const [activeEvents, activateEvent] = useEventObserver();
const [initBodyOverlayScrollbars, getBodyOverlayScrollbarsInstance] = useOverlayScrollbars({
  defer: true,
  events: {
    initialized: () => {
      bodyOverlayScrollbarsApplied.value = true;
    },
    destroyed: () => {
      bodyOverlayScrollbarsApplied.value = false;
    },
  },
  options: {
    scrollbars: {
      theme: 'os-theme-light',
    },
  },
});

const scrollContent = () => {
  const osInstance = osRef?.value?.osInstance();

  if (!osInstance) {
    return;
  }

  const { overflowAmount } = osInstance.state();
  const { scrollOffsetElement } = osInstance.elements();
  const { scrollLeft, scrollTop } = scrollOffsetElement;

  scrollOffsetElement.scrollTo({
    behavior: 'smooth',
    left: Math.round((overflowAmount.x - scrollLeft) / overflowAmount.x) * overflowAmount.x,
    top: Math.round((overflowAmount.y - scrollTop) / overflowAmount.y) * overflowAmount.y,
  });
};
const toggleContent = () => (contentHidden.value = !contentHidden.value);
const toggleElement = () => (elementHidden.value = !elementHidden.value);

const scroller = ref(null);
const toggleBodyOverlayScrollbars = () => {
  const bodyOsInstance = getBodyOverlayScrollbarsInstance();

  if (bodyOsInstance && !bodyOsInstance.state().destroyed) {
    bodyOsInstance.destroy();
  } else {
    initBodyOverlayScrollbars({
      target: document.body,
      cancel: {
        body: false,
      },
    });
  }
};

onMounted(() => {
  console.log('scroller', scroller);

  // initBodyOverlayScrollbars(document.body)
});

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

      <RecycleScroller
        ref="scroller"
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

      <!-- <OverlayScrollbarsComponent
        class="overlayscrollbars-vue"
        ref="osRef"
        :style="{ display: elementHidden ? 'none' : undefined }"
        :options="{
          scrollbars: {
            theme: 'os-theme-light',
          },
        }"
        :events="{
          initialized: () => activateEvent('initialized'),
          destroyed: () => activateEvent('destroyed'),
          updated: () => activateEvent('updated'),
          scroll: () => activateEvent('scroll'),
        }"
        defer
      >
        <div v-if="!contentHidden" class="logo">
          <img alt="Vue logo" src="logo.svg" />
        </div>
        
      </OverlayScrollbarsComponent> -->

      <!-- <scroll-view @ps-y-reach-end="onReachEnd" @ps-y-reach-start="onReachStart"> -->
    </page-content>
  </page>
</template>

<style scoped>
.section {
  padding: 0 20px;
}
.data-item {
  padding: 0 20px;
}

.search-section {
  display: flex;
  padding: 20px;
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
