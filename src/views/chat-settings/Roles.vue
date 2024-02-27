<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoleList } from './commons/useRoleList';
import RoleFromModal from './widget/RoleFormModal.vue';
import { onActivated } from 'vue';
import { SessionRoleDetailDto } from '../../apis/models/SessionRoleDetailDto';
import Loading from '../../components/Loading.vue';
import { MoreOutlined, SearchOutlined } from '@ant-design/icons-vue';
import EmptyData from '../../components/EmptyData.vue';
import { Plus } from '../../icons';
const { t } = useI18n();
const props = defineProps<{ sessionUnitId: string }>();
const formModal = ref<InstanceType<typeof RoleFromModal> | null>();
const {
  totalCount,
  query,
  isPending,
  list,
  isBof,
  isEof,
  isEmptyData,
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
} = useRoleList({
  input: {
    sessionUnitId: props.sessionUnitId,
    maxResultCount: 999,
  },
});

const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false },
]);

const activeKey = ref(panes.value[0].key);

const newTabIndex = ref(0);

const add = () => {
  activeKey.value = `newTab${++newTabIndex.value}`;
  panes.value.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey.value });

  formModal.value?.open({
    sessionUnitId: props.sessionUnitId,
  });
};
const edit = (item: SessionRoleDetailDto) => {
  formModal.value?.open({
    id: item.id,
    sessionUnitId: props.sessionUnitId,
  });
};

const remove = (targetKey: string) => {
  let lastIndex = 0;
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      lastIndex = i - 1;
    }
  });
  panes.value = panes.value.filter(pane => pane.key !== targetKey);
  if (panes.value.length && activeKey.value === targetKey) {
    if (lastIndex >= 0) {
      activeKey.value = panes.value[lastIndex].key;
    } else {
      activeKey.value = panes.value[0].key;
    }
  }
};

const onEdit = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    add();
  } else {
    remove(targetKey as string);
  }
};

onActivated(() => {
  refresh();
});
</script>

<template>
  <page>
    <page-title :title="t('Session Roles')" description="managermemt" />
    <RoleFromModal ref="formModal" @change="refresh" />
    <page-content>
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
        <a-button type="text" @click="add">
          <Plus class="svg-icon cursor-pointer" />
        </a-button>
      </div>

      <!-- <a-tabs v-model:activeKey="activeKey" size="small" @edit="onEdit">
        <template #rightExtra>
          <a-button type="text">Add</a-button>
        </template>
        <a-tab-pane v-for="item in list" :key="item.id" :tab="item.name" :closable="true">
          <scroll-view>5555</scroll-view>
        </a-tab-pane>
      </a-tabs> -->

      <RecycleScroller
        ref="scroller"
        class="scroller"
        :items="list"
        :item-size="56"
        key-field="id"
        @scroll-start="onReachStart"
        @scroll-end="onReachEnd"
      >
        <template #after>
          <Loading v-if="isPending" />
          <!-- <div v-else-if="isEof">{{ t('DividerEnd') }}</div> -->

          <div class="section">总数:{{ list.length }}/{{ totalCount }}</div>
        </template>

        <template v-if="isEmptyData" #empty>
          <EmptyData />
        </template>

        <template v-slot="{ item }: { item: SessionRoleDetailDto }">
          <div
            :key="item.id"
            class="data-item"
            :class="{ checked: isChecked(item), disabled: isDisabled(item) }"
            @click="toggleChecked(item)"
          >
            <!-- <a-checkbox :checked="isChecked(item)" :disabled="isDisabled(item)" class="check-box">
              
            </a-checkbox> -->
            <div @click="edit(item)">{{ item.name }}</div>

            <a-button class="btn-item" type="text" @click="edit(item)"><MoreOutlined /></a-button>
          </div>
        </template>
      </RecycleScroller>
    </page-content>
  </page>
</template>

<style scoped>
:deep(.page-content) {
  margin-left: 0px;
}
.section {
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
}
.section-search {
  display: flex;
  /* flex: 1; */
  border-bottom: 1px solid var(--divider-color);
}

.data-item {
  padding: 0 20px;
  height: 48px;
  flex-direction: row;
  align-items: center;
}
.check-box {
  display: flex;
  /* flex: 1;  */
}
</style>
