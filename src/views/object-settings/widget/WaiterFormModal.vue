<script setup lang="ts">
import { ChatObjectDto } from '../../../apis/dtos';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { reactive } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { SessionRoleService, ShopWaiterService } from '../../../apis';
import { getParentName } from '../../../commons/utils';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
const { t } = useI18n();
defineProps<{
  destination?: ChatObjectDto;
  open?: boolean;
}>();
interface FormState {
  account?: string;
  password?: string;
  isEnabled?: boolean;
  name?: string;
  description?: string;
}
const isAdd = ref(true);
const formTitle = computed(() => (isAdd.value ? t('WaiterAdd') : t('Edit')));

const formState: UnwrapRef<FormState> = reactive({});

const parentName = computed(() => shopKeeper.value?.name);

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const emits = defineEmits<{
  // confirm: [{ files?: Array<any>; text?: string }];
  cancel: [];
}>();

const entity = ref<ChatObjectDto>();
const shopKeeper = ref<ChatObjectDto>();

const isOpen = ref(false);
const okText = computed(() => t('Confirm'));
const confirmLoading = ref<boolean>(false);
const okBtnDisabled = ref(false);
const formDisabled = ref(false);

const cancel = ref<() => void>();
const open = (args: { shopKeeper?: ChatObjectDto; entity?: ChatObjectDto; isAdd?: boolean }) => {
  shopKeeper.value = args.shopKeeper;
  entity.value = args.entity;
  isAdd.value = args.isAdd || false;
  isOpen.value = true;
  if (isAdd) {
    formState.password = '';
    formState.account = '';
  }
  formState.name = args.entity?.name;
  formState.isEnabled = args.entity?.isEnabled;
  formState.description = args.entity?.description;
};
const close = () => {
  isOpen.value = false;
};

const handleCancel = (e: MouseEvent) => {
  // emits('cancel');
  cancel.value?.call(this);
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  confirmLoading.value = true;
  const key = 'session-request-handle';
  ShopWaiterService.postApiChatShopWaiterUpdate({
    id: Number(entity.value?.id),
    requestBody: {
      name: formState.name,
      description: formState.description,
    },
  })
    .then(res => {
      isOpen.value = false;
      message.success({ content: `ok`, key });
    })
    .catch(err => {
      message.error({ content: `${err?.body?.error?.message}`, key });
    })
    .finally(() => {
      confirmLoading.value = false;
    });
};
// Expose
defineExpose({
  open,
  close,
});
</script>

<template>
  <a-modal
    class="drop-viewer"
    v-model:open="isOpen"
    :title="formTitle"
    :width="480"
    :ok-text="okText"
    :ok-button-props="{ disabled: okBtnDisabled }"
    :cancel-text="t('Cancel')"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <page class="drop-viewer">
      <page-content>
        <a-form
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :disabled="formDisabled"
        >
          <template v-if="isAdd">
            <a-form-item
              :label="t('Account')"
              name="username"
              :rules="[{ message: 'Please input your username!' }]"
              :help="t('AccountHelp')"
              required
            >
              <a-input v-model:value="formState.account">
                <template #prefix><UserOutlined class="prefix" /></template>
              </a-input>
            </a-form-item>

            <a-form-item
              :label="t('Password')"
              name="password"
              :rules="[{ message: 'Please input your password!' }]"
              :help="t('PasswordHelp')"
              required
            >
              <a-input-password v-model:value="formState.password">
                <template #prefix><LockOutlined class="prefix" /></template>
              </a-input-password>
            </a-form-item>
          </template>

          <a-form-item :label="t('Name')" :help="t('ObjectNameHelp')" required>
            <a-input v-model:value="formState.name" :bordered="true">
              <template v-if="parentName" #prefix>
                <div class="parent-name">{{ parentName }}</div>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item :label="t('EnabledState')">
            <a-checkbox v-model:checked="formState.isEnabled">{{ t('Enabled') }}</a-checkbox>
          </a-form-item>

          <!-- <a-form-item :label="t('Description')">
            <a-textarea v-model:value="formState.description" class="no-resize" />
          </a-form-item> -->
        </a-form>
        <!-- </scroll-view> -->
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
.parent-name {
  color: var(--sub-title-color);
}
.parent-name::after {
  padding: 0 4px;
  content: ':';
  color: var(--main-title-color);
}

.drop-viewer {
  user-select: none;
  background-color: unset;
}
.drop-viewer {
  user-select: none;
  /* background-color: white;
  --background-color: #f5f5f5; */
}
.divider {
  margin: 6px 0;
}

.scroll-view {
  /* min-height: 300px; */
  max-height: 150px;
}
.text-viewer {
  user-select: text;
  padding: 12px;
  /* background-color: #272727; */
  background-color: var(--background-color-normal);
}
.file-list {
  display: flex;
  flex-direction: column;
  /* padding: 12px; */
  user-select: text;
  /* background-color: var(--background-color); */
}
.file-info {
  color: rgba(128, 128, 128, 0.511);
}
.hover {
  position: relative;
  background-color: var(--background-color-hover);
  /* background-color: #b8b8b8; */
}
.hover:last-child::after {
  content: unset;
}
.hover::after {
  content: '';
  position: absolute;
  left: 68px;
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
