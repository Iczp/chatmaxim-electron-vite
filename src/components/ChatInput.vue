<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  UploadOutlined,
  MehOutlined,
  VideoCameraOutlined,
  FolderOpenOutlined,
  ScissorOutlined,
  MoreOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue';
import { MessageDto } from '../apis/dtos';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    value?: string | number;
    maxLength?: number;
    counter?: boolean;
    mentions?: Array<{
      value: string;
      label: string;
    }>;
  }>(),
  {
    maxLength: 500,
    counter: true,
  },
);

const emits = defineEmits<{
  send: [
    {
      value: string;
      event: MouseEvent | PointerEvent | undefined;
    },
  ];
}>();

const inputValue = ref('');
// const isSendDisabled = ref(false);
const textarea = ref(null as HTMLInputElement | null);

const onInput = (e: InputEvent) => {
  console.log('onInput', e.data, (e.target as HTMLInputElement).value);
};
const send = (event: MouseEvent | PointerEvent | undefined): void => {
  emits('send', {
    event,
    value: inputValue.value,
  });
};
const clear = (): void => {
  inputValue.value = '';
};

const click = (e: any) => {
  console.log('click', e);
  // setSelectionRange(start, end)
  // textarea.value?.setSelectionRange(1, 2)
  // https://stackoverflow.com/questions/42289080/for-text-input-how-to-make-it-so-that-clicking-on-it-will-select-everything
};

defineExpose({
  clear,
  send,
  inputValue,
});
</script>

<template>
  <section class="chat-input" disabled="disabled">
    <div class="tool-bar">
      <a-space>
        <a-button type="text"><MehOutlined /></a-button>
        <a-button type="text"><FolderOpenOutlined /></a-button>
        <a-button type="text"><VideoCameraOutlined /></a-button>
        <a-button type="text"><ScissorOutlined /></a-button>

        <a-button type="text">
          <UploadOutlined />
        </a-button>

        <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
          <a-button type="text">Confirm</a-button>
        </a-popconfirm>
      </a-space>
    </div>
    <div class="input-body">
      <div class="input-area">
        <scroll-view>
          <a-mentions
            class="textarea"
            v-model:value="inputValue"
            rows="5"
            placeholder="说点什么..."
            :options="mentions"
            :autofocus="false"
            :disabled="disabled"
            @keydown.ctrl.enter="send"
            @input="onInput"
          ></a-mentions>
          <!-- <br /> <br /> <br /> <br /> <br /> -->
        </scroll-view>
      </div>
      <div class="input-footer">
        <div class="footer-left">
          <div class="counter">{{ (inputValue?.toString() || '').length }}/{{ maxLength }}</div>
          <slot></slot>
        </div>
        <div class="footer-right">
          <a-button
            type="primary"
            @click="send"
            :disabled="disabled"
            class="btn-send"
            title="Alt+S 或 Ctrl+Enter 发送消息"
          >
            发送(
            <u>S</u>
            )
          </a-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(.ant-mentions) {
  background-color: #ffffff00;
}
.chat-input {
  display: flex;
  flex-direction: column;
  /* height: 200px; */
  /* border-top: 1px solid #ccc; */
  width: 100%;
}
.input-body {
  background-color: rgba(255, 255, 255, 0.474);
}
.input-area {
  display: flex;
  flex: 1;
  width: 100%;
}
.input-footer {
  display: flex;
  flex-direction: row;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}
.footer-left {
  display: flex;
  font-size: 12px;
  color: #ccc;
  padding-left: 12px;
  align-items: center;
  /* justify-content: space-between; */
  flex: 1;
  margin-right: 12px;
}
.footer-right {
  display: flex;
  padding-right: 12px;
}
.counter {
  margin-right: 8px;
}
.btn-send {
  font-size: 12px;
  padding: 0 12px;
  height: 28px;
}
</style>
