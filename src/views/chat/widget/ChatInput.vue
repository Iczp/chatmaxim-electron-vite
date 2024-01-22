<script setup lang="ts">
import { ref } from 'vue';
import {
  UploadOutlined,
  MehOutlined,
  VideoCameraOutlined,
  FolderOpenOutlined,
  ScissorOutlined,
} from '@ant-design/icons-vue';
import { useFileDialog } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
const { t } = useI18n();
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

const { files, open, reset, onChange } = useFileDialog({
  // accept: 'image/*', // Set to accept only image files
  directory: false, // Select directories instead of files if set true
});

onChange((files: any) => {
  /** do something with files */
  console.warn('files', files);
});

// event callback
function onSelectEmoji(emoji: any) {
  console.log(emoji);
  inputValue.value += emoji.i;

  /*
    // result
    { 
        i: "😚", 
        n: ["kissing face"], 
        r: "1f61a", // with skin tone
        t: "neutral", // skin tone
        u: "1f61a" // without tone
    }
    */
}

const groupNames = {
  smileys_people: '微笑与人',
  animals_nature: 'Animals & Nature',
  food_drink: 'Food & Drink',
  activities: 'Activities',
  travel_places: 'Travel places',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
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
        <a-popover trigger="click">
          <template #content>
            <EmojiPicker
              class="emoji-picker"
              :group-names="groupNames"
              :native="true"
              @select="onSelectEmoji"
              :hide-search="true"
              :hide-group-names="false"
              :disable-sticky-group-names="true"
              :disable-skin-tones="true"
            />
          </template>
          <a-button type="text"><MehOutlined /></a-button>
        </a-popover>

        <a-button type="text" @click="open"><FolderOpenOutlined /></a-button>
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
            :placeholder="t('SendContentPlaceholder')"
            :focus="true"
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
            :title="t('SendShortcuts')"
          >
            {{ t('Send') }}(
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
  background-color: transparent;
}
.emoji-picker.v3-emoji-picker .v3-body {
  color: red;
  padding-bottom: 0;
}

.ant-popover .ant-popover-inner,
:deep(.ant-popover .ant-popover-inner) {
  padding: 0 !important;
}
:deep(.emoji-picker.v3-emoji-picker .v3-body) {
  padding: 0;
  padding-bottom: 0;
}
.chat-input {
  display: flex;
  flex-direction: column;
  /* height: 200px; */
  /* border-top: 1px solid #ccc; */
  width: 100%;
}
.input-body {
  /* background-color: rgba(255, 255, 255, 0.474); */
  background-color: var(--background-color);
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
  color: var(--chat-input-counter-color);
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
