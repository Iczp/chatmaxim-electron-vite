<script setup lang="ts">
import { AppDto } from '../../../apis/dtos';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import type { UnwrapRef } from 'vue';
import { message } from 'ant-design-vue';
import { SessionRoleService } from '../../../apis';
const { t } = useI18n();

interface FormState {
  isAgreed?: boolean | null;
  name?: string;
  description?: string;
}
const formTitle = ref(t('AppTitle'));
const formState: UnwrapRef<FormState> = reactive({
  isAgreed: undefined,
  handleMessage: '',
  name: '',
  description: '',
});

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const emits = defineEmits<{
  cancel: [];
}>();

const entity = ref<AppDto>();

const isOpen = ref(false);
const okText = computed(() => t('Confirm'));
const confirmLoading = ref<boolean>(false);
const okBtnDisabled = ref(false);
const formDisabled = ref(false);

const cancel = ref<() => void>();
const open = (args: { entity: AppDto | undefined; isAgreed?: boolean }) => {
  entity.value = args.entity;
  isOpen.value = true;
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
  const key = 'nav-to-app';
  setTimeout(() => {
    confirmLoading.value = false;
    isOpen.value = false;
    message.success({ content: `${entity.value?.name}`, key });
  }, 300);
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
          <a-form-item :label="t('Name')">
            <a-input v-model:value="entity!.name" class="no-resize" />
            <!-- {{ entity?.name }} -->
          </a-form-item>
          <a-form-item :label="`badge`">
            <a-input v-model:value="entity!.badge" class="no-resize" />
          </a-form-item>

          <a-form-item :label="t('Description')">
            <a-textarea v-model:value="entity!.description" class="no-resize" />
            <!-- {{ entity?.description || '-' }} -->
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
