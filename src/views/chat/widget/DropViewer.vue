<script setup lang="ts">
import {} from 'vue';
import { ChatObjectDto } from '../../../apis/dtos';
import ChatObject from '../../../components/ChatObject.vue';
import FileItem from '../../../components/FileItem.vue';
import { computed, ref } from 'vue';
import { FileOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import prettyBytes from 'pretty-bytes';
defineProps<{
  destination?: ChatObjectDto;
  files?: Array<any>;
  text?: string;
  open?: boolean;
}>();

const emits = defineEmits<{
  // confirm: [{ files?: Array<any>; text?: string }];
  cancel: [];
}>();

const destination = ref<ChatObjectDto>();
const files = ref<Array<any>>([]);
const text = ref<string>();
const isOpen = ref(false);
const okText = computed(
  () => `发送` + (files.value.length == 0 ? '' : `( ${files.value.length} )`),
);

const confirm = ref<(files?: Array<any>, text?: string) => void>();
const cancel = ref<() => void>();
const open = (args: {
  destination?: ChatObjectDto;
  files?: Array<any>;
  text?: string;
  onConfirm?: (files?: Array<any>, text?: string) => void;
  onCancel?: () => void;
}) => {
  destination.value = args.destination;
  files.value = args.files || [];
  text.value = args.text;
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

const handleOk = (e: MouseEvent) => {
  console.log(e);
  isOpen.value = false;
  confirm.value?.call(this, files.value, text.value);
  // emits('confirm', { files: files.value, text: text.value });
};
const onDelete = (index: number): void => {
  files.value.splice(index, 1);
  if (files.value.length == 0) {
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
    class="drop-viewer"
    v-model:open="isOpen"
    :width="360"
    title="发送给"
    :ok-text="okText"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <page class="drop-viewer">
      <page-content>
        <chat-object :entity="destination" class="chat-object" :size="32"></chat-object>
        <a-divider class="divider" />
        <scroll-view class="scroll-view">
          <div v-if="text" class="text-viewer">
            {{ text }}
          </div>
          <div v-if="files.length != 0" class="file-list">
            <div v-for="(item, index) in files" class="hover">
              <file-item
                :name="item?.name"
                :size="item.size"
                :suffix="`.${item?.name.split('.').pop()}`"
                :del="true"
                @delete="onDelete(index)"
              >
                <div class="file-info">{{ prettyBytes(item.size || 0) }}</div>
              </file-item>
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
.drop-viewer {
  user-select: none;
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
  background-color: #272727;
}
.file-list {
  display: flex;
  flex-direction: column;
  /* padding: 12px; */
  user-select: text;
  background-color: var(--background-color);
}
.file-info {
  color: rgba(128, 128, 128, 0.511);
}
.hover {
  position: relative;
  /* background-color: #272727; */
  background-color: var(--background-color-normal);
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
