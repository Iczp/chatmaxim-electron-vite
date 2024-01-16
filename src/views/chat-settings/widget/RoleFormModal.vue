<script setup lang="ts">
import { ChatObjectDto, SessionRequestDetailDto } from '../../../apis/dtos';
import ChatObject from '../../../components/ChatObject.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { reactive } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { SessionRequestService, SessionRoleService } from '../../../apis';
import { SessionRoleDetailDto } from '../../../apis/models/SessionRoleDetailDto';
const { t } = useI18n();
defineProps<{
  destination?: ChatObjectDto;
  open?: boolean;
}>();
interface FormState {
  isAgreed?: boolean | null;
  name?: string;
  description?: string;
}
const formTitle = ref(t('RoleAdd'));
const formState: UnwrapRef<FormState> = reactive({
  isAgreed: undefined,
  handleMessage: '',
  name: '',
  description: '',
});

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const emits = defineEmits<{
  // confirm: [{ files?: Array<any>; text?: string }];
  cancel: [];
}>();

const entity = ref<SessionRoleDetailDto>();

const isOpen = ref(false);
const okText = computed(() => t('Confirm'));
const confirmLoading = ref<boolean>(false);
const okBtnDisabled = ref(false);
const formDisabled = ref(false);

const cancel = ref<() => void>();
const open = (args: { entity: SessionRoleDetailDto | undefined; isAgreed?: boolean }) => {
  entity.value = args.entity;
  isOpen.value = true;
  // formState.isAgreed = entity.value.isAgreed;
  // formState.handleMessage = entity.value.handleMessage;
  // okBtnDisabled.value = entity.value.isHandled || false;
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
  SessionRoleService.postApiChatSessionRole({

    requestBody:{
      sessionId:''
    }
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
          <a-form-item :label="t('RoleName')">
            <a-input v-model:value="formState.name" class="no-resize" />
          </a-form-item>

          <a-form-item :label="t('RoleDescription')">
            <a-textarea v-model:value="formState.description" class="no-resize" />
          </a-form-item>
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
