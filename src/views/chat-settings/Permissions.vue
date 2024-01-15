<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { usePermisstionGrantedList } from './commons/usePermisstionGrantedList';
import { usePermisstionDefinitionList } from './commons/usePermisstionDefinitionList';
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
} = usePermisstionDefinitionList({
  input: {
    // id: props.sessionUnitId,
    maxResultCount: 999,
  },
});

const onReachStart = (event: CustomEvent) => {
  console.info('onReachStart', event);
};
const onReachEnd = (event: CustomEvent) => {
  console.info('onReachEnd', event);
  if (isPending.value) {
    console.info('isPending', isPending.value);
    return;
  }
  if (isEof.value) {
    console.info('isEof', isEof.value);
    return;
  }
  fetchNext();
};

onMounted(() => {
  fetchNext();
});
</script>

<template>
  <page>
    <page-title :title="t('Session Permissions')" description="managermemt" />

    <page-content>
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
            class="data-item"
            :class="{ checked: isChecked(item), disabled: isDisabled(item) }"
            @click="toggleChecked(item)"
          >
            <a-checkbox class="check-box">
              {{ item.name }}
            </a-checkbox>
          </div>
        </template>
      </RecycleScroller>
    </page-content>
  </page>
</template>

<style scoped></style>
