<script setup lang="ts">
import {} from 'vue';

import { ChatObjectDto } from '../../../apis/dtos';
import ChatObject from '../../../components/ChatObject.vue';
import FileItem from '../../../components/FileItem.vue';
import { computed, ref } from 'vue';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import prettyBytes from 'pretty-bytes';
import { useI18n } from 'vue-i18n';
import { useWaitersList } from '../../object-settings/commons/useWaitersList';
import { reactive } from 'vue';
import { CallCenterService } from '../../../apis';
import { message } from 'ant-design-vue';
const { t } = useI18n();

const emits = defineEmits<{
  // confirm: [{ files?: Array<any>; text?: string }];
  cancel: [];
}>();

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
  isMultiple,
  maxSelectCount,
  picker: pickerRef,
  getSelectItems,
} = useWaitersList({
  input: {
    isContainsShopKeeper: true,
    shopKeeperId: undefined,
    maxResultCount: 999,
  },
});

// const list = ref<Array<ChatObjectDto>>([]);
const text = ref<string>();
const isOpen = ref(false);
const okText = computed(() => t('Transfer'));

const confirm = ref<(destination?: ChatObjectDto) => void>();
const cancel = ref<() => void>();

type ArgsType = {
  chatObjectId: number;
  sessionUnitId: string;
  owner: ChatObjectDto;
  onConfirm?: (destination?: ChatObjectDto) => void;
  onCancel?: () => void;
};
const openArgs = ref<ArgsType>();
const open = (args: ArgsType) => {
  openArgs.value = args;
  isMultiple.value = false;
  query.value = {
    isContainsShopKeeper: true,
    shopKeeperId: args.chatObjectId,
    maxResultCount: 999,
  };
  disabledList.value = [{ id: args.owner.id }];
  isOpen.value = true;
  confirm.value = args.onConfirm;
  cancel.value = args.onCancel;
};
const close = () => {
  isOpen.value = false;
};

const handleCancel = (e: MouseEvent) => {
  // emits('cancel');
  cancel.value?.call(this);
};
const confirmLoading = ref(false);
const okButtonProps = reactive({
  disabled: false,
});
const handleOk = (e: MouseEvent) => {
  console.log(e);
  confirmLoading.value = true;
  const target = getSelectItems()[0];
  const key = 'transfer';
  CallCenterService.postApiChatCallCenterTransferTo({
    sessionUnitId: openArgs.value!.sessionUnitId,
    destinationId: target?.id!,
  })
    .then(() => {
      isOpen.value = false;
      confirmLoading.value = false;
      confirm.value?.call(this, target);
    })
    .catch(err => {
      message.error({ content: err?.body?.error?.message, duration: 2, key });
      confirmLoading.value = false;
    })
    .finally(() => {});
};
const onDelete = (index: number): void => {
  list.value.splice(index, 1);
  if (list.value.length == 0) {
    isOpen.value = false;
  }
};

// Expose
defineExpose({
  open,
  close,
});
</script>

<template>
  <a-modal
    class="transfer-page"
    v-model:open="isOpen"
    :width="360"
    :title="t('Transfer To')"
    :ok-text="okText"
    :confirmLoading="confirmLoading"
    :okButtonProps="okButtonProps"
    :cancel-text="t('Cancel')"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <page class="transfer-modal">
      <page-content>
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
        <scroll-view class="scroll-view">
          <div v-if="list.length != 0" class="waiter-list">
            <div
              v-for="(item, index) in list"
              :class="{ checked: isChecked(item), disabled: isDisabled(item) }"
              @click="toggleChecked(item)"
              class="data-item hover"
            >
              <chat-object :entity="item" :sub="'5'" :size="44"></chat-object>
              <a-checkbox
                :checked="isChecked(item)"
                :disabled="isDisabled(item)"
                class="check-box"
              ></a-checkbox>
            </div>
          </div>
        </scroll-view>
      </page-content>
    </page>
  </a-modal>
</template>

<style scoped>
:deep(.ant-modal-title),
:deep(.ant-modal-content) {
  user-select: none;
}
:deep(.file-name) {
  max-width: 180px;
}

.transfer-page {
  user-select: none;
  background-color: unset;
}
.transfer-modal {
  user-select: none;
  /* background-color: white;
  --background-color: #f5f5f5; */
}

.section-search {
  margin-bottom: 12px;
}

.scroll-view {
  /* min-height: 150px; */
  /* max-height: 300px; */
  height: 160px;
}

.waiter-list {
  display: flex;
  flex-direction: column;
  /* padding: 12px; */
  user-select: text;
  /* background-color: var(--background-color); */
}

.hover {
  border-radius: 4px;
  padding: 0 12px;
  position: relative;
  /* background-color: var(--background-color-hover); */
  /* background-color: #b8b8b8; */
}
.hover:last-child::after {
  content: unset;
}
.hover::after {
  content: '';
  position: absolute;
  left: 54px;
  right: 0;
  bottom: 0;
  /* background-color: #383838; */
  background-color: var(--divider-color);
  height: 1px;
  transform: translateY(0.25);
  /* z-index: 1; */
}
.hover:hover {
  background-color: var(--background-color-hover);
}
:deep(.delete) {
  opacity: 0;
}
.hover:hover :deep(.delete) {
  opacity: 1;
}
</style>
