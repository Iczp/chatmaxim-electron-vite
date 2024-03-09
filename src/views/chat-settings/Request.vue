<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useDestination } from './commons/useDestination';
import { computed, ref } from 'vue';
import { useRequestList } from './commons/useRequestList';
import { onMounted } from 'vue';
import { SessionRequestDetailDto } from '../../apis/dtos/SessionRequestDetailDto';
import RequestDetailModal from './widget/RequestDetailModal.vue';
import ChatObject from '../../components/ChatObject.vue';
import { formatDatetime } from '../../commons/utils';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();

const detailModal = ref<InstanceType<typeof RequestDetailModal> | null>();

const { sessionUnit, memberCount } = useDestination(props.sessionUnitId);

const destinationId = computed(() => 13 || sessionUnit.value?.destination?.id);
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
  selectable,
  isChecked,
  toggleChecked,
  selectedList,
  disabledList,
  isDisabled,
  maxSelectCount,
  picker: pickerRef,
  getSelectItems,
} = useRequestList({
  input: {
    // ownerId: ownerId.value,
    destinationId: destinationId.value,
    maxResultCount: 40,
  },
});
onMounted(() => {
  fetchNext();
});
const onItemClick = (item: SessionRequestDetailDto, isAgreed?: boolean) => {
  console.log('onItemClick', item);
  detailModal.value?.open({
    entity: item,
  });
};
const agreeHandle = (item: SessionRequestDetailDto, isAgreed?: boolean) => {
  detailModal.value?.open({
    entity: item,
  });
};
</script>

<template>
  <page>
    <page-title :title="t('Session Request')" description="managermemt" />
    <RequestDetailModal ref="detailModal" />
    <page-content>
      <!-- <a-page-header title="Title" sub-title="This is a subtitle" /> -->
      {{ destinationId }}
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
            :class="`agreed-${item.isAgreed}`"
            @click="onItemClick(item)"
          >
            <chat-object :entity="item.owner" :size="44" class="chat-object">
              <!-- <template #title>title-left</template> -->
              <!-- <template #title-right>{{ formatDatetime(item.creationTime) }}</template> -->
              <template #sub-right>{{ formatDatetime(item.creationTime) }}</template>
              <template #sub>
                <div class="text-ellipsis">{{ t('RequestMessage') }}:{{ item.requestMessage }}</div>
              </template>
              <template #footer>
                <div class="handle-result" v-if="item.isHandled">
                  {{ item.isAgreed ? t('Agreed') : t('Disagreed') }}
                </div>
                <a-space v-else>
                  <a-button type="text" @click="agreeHandle(item, true)">
                    {{ t('Disagree') }}
                  </a-button>
                  <a-button type="text" @click="agreeHandle(item, false)">
                    {{ t('Agree') }}
                  </a-button>
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
.data-item {
  padding: 0 20px;
}
.chat-object {
  --main-left-max-width: 240px;
  --sub-left-max-width: 240px;
  --border-left: 50px;
  /* --spacing-size: 20px; */
  flex: 1;
}
.chat-object::after {
  content: '';
}
.chat-object:deep(.footer) {
  margin-left: 20px;
}
.handle-result {
  color: var(--sub-title-color);
}
</style>
