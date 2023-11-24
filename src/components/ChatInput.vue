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
defineEmits(['update:modelValue', 'send']);

defineProps<{
  disabled?: boolean;
  value?: string | number;
}>();

const textValue = ref('');
const textarea = ref(null as HTMLInputElement | null);

const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
const send = (e: any) => {
  console.log('send', e);
};
const onInput = (e: InputEvent) => {
  console.log('onInput', e.data, (e.target as HTMLInputElement).value);
};
const click = (e: any) => {
  console.log('click', e);
  // setSelectionRange(start, end)
  // textarea.value?.setSelectionRange(1, 2)
  // https://stackoverflow.com/questions/42289080/for-text-input-how-to-make-it-so-that-clicking-on-it-will-select-everything
};
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
          <!-- <a-textarea
            ref="textarea"
            class="textarea"
            placeholder="说点什么..."
            :rows="4"
            @keydown.ctrl.enter="send"
            @input="onInput"
            @click="click"
          /> -->
          <!-- @keydown.ctrl.83.prevent.stop="send" -->
          <!-- @input="$emit('update:modelValue', $event.target.value)" -->
          <a-mentions
            class="textarea"
            :value="value"
            rows="5"
            placeholder="说点什么..."
            :options="options"
            :autofocus="false"
            :disabled="disabled"
            @keydown.ctrl.enter="send"
          ></a-mentions>
          <!-- <br /> <br /> <br /> <br /> <br /> -->
        </scroll-view>
      </div>
      <div class="input-footer">
        <div class="footer-left">{{ (value?.toString() || '').length }} /1000</div>
        <div class="footer-right">
          <a-button
            type="primary"
            @click="$emit('send', $event)"
            :disabled="disabled"
            class="btn-send"
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
.chat-input {
  display: flex;
  flex-direction: column;
  /* height: 200px; */
  /* border-top: 1px solid #ccc; */
  width: 100%;
}
.input-body {
  background-color: white;
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
}
.footer-left {
  display: flex;
  font-size: 12px;
  color: #ccc;
  padding-left: 12px;
}
.footer-right {
  display: flex;
  padding-right: 12px;
}
.btn-send {
  font-size: 12px;
  padding: 0 12px;
  height: 28px;
}
</style>
