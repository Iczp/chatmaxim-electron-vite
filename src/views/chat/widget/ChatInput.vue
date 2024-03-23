<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import {
  UploadOutlined,
  MehOutlined,
  VideoCameraOutlined,
  FolderOpenOutlined,
  ScissorOutlined,
} from '@ant-design/icons-vue';
import { useColorMode, useFileDialog } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import EmojiPicker from 'vue3-emoji-picker';
import ColorTheme from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import { useWindowStore } from '../../../stores/window';
import { computed } from 'vue';

const windowStore = useWindowStore();
const colorScheme = computed(() => windowStore.colorScheme as 'dark' | 'light' | 'auto');
import { useTextSelection } from '@vueuse/core';
import { reactive } from 'vue';
import { MessageInput, TextContentDto } from '../../../apis/dtos';
import { MessageTypeEnums } from '../../../apis/enums';
import { MessageContent } from '../../../apis/dtos/message/messageContent';

import { screenshots } from '../../../ipc/screenshots';
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
  send1: [
    {
      value: string;
      event: MouseEvent | PointerEvent | undefined;
    },
  ];
  send: [
    {
      messageType: MessageTypeEnums;
      content: MessageContent;
      event?: MouseEvent | PointerEvent | undefined;
    },
  ];
  open: [File[] | Blob[], 'filesystem' | 'screenshots'];
}>();

const selectionState = useTextSelection();
const inputRef = ref();
const isInputFocus = ref(true);
const inputValue = ref('');
onMounted(() => {
  console.log('inputRef', inputRef);
  nextTick(() => {
    // inputRef.value?.focus();
    console.log('inputRef', inputRef);
  });
});
// const isSendDisabled = ref(false);
const textarea = ref(null as HTMLInputElement | null);

const selection = ref<{
  start: number | null;
  end: number | null;
}>({ start: 0, end: 0 });

const isSendBtnDisabled = computed(() => inputValue.value.length == 0);
const onInput = (e: any) => {
  console.log('onInput', e.data);
  const el = (textareaRef.value = e.target as HTMLInputElement);
  console.log('=====', el.selectionStart, el.selectionEnd);
};
const textareaRef = ref<HTMLInputElement>();
const onInputClick = (e: any) => {
  const el = e.target as HTMLInputElement;

  console.log('onInputClick', el.selectionStart, el.selectionEnd, e);
};
const onBlur = (e: any) => {
  const el = (textareaRef.value = e.target as HTMLInputElement);
  selection.value = {
    start: el.selectionStart,
    end: el.selectionEnd,
  };
  // el?.focus();
  console.log('onBlur', el.selectionStart, el.selectionEnd, e);
};
const onFocus = (e: any) => {
  const el = (textareaRef.value = e.target as HTMLInputElement);
  console.log('onFocus', el.selectionStart, el.selectionEnd, e);
};
const onInputChange = (e: any) => {
  const el = (textareaRef.value = e.target as HTMLInputElement);
  console.log('onInputChange', el.selectionStart, el.selectionEnd);
};

const onTextChange = (...e: any) => {
  console.log('onTextChange', ...e);
};

const onTextSelect = (e: any) => {
  console.log('onTextChange', e);
};
const send = (event?: MouseEvent | PointerEvent): void => {
  emits('send', {
    messageType: MessageTypeEnums.Text,
    content: <TextContentDto>{
      text: inputValue.value,
    },
    event,
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

onChange((files: FileList | null) => {
  /** do something with files */
  console.warn('files', files);

  const items: File[] = [];
  // Print each format files
  for (let i = 0; i < (files || []).length; i++) {
    const file = files![i];
    items.push(file!);
  }

  emits('open', items, 'filesystem');
});

const visible = ref<boolean>(false);

const hide = () => {
  visible.value = false;
};

const tryToSetCursorIndex = () => {
  const el = textareaRef.value as HTMLInputElement;
  console.log('appendText', el);
  if (el) {
    nextTick(() => {
      const cursorIndex = selection.value.end;
      // 设置光标位置
      el.focus();
      // 设置选中的范围
      el.setSelectionRange(cursorIndex, cursorIndex);

      console.log('appendText setSelectionRange', cursorIndex);
    });
  }
};
const appendText = (value: string, focus?: boolean) => {
  if (!value) {
    return;
  }
  const text = inputValue.value;

  const { start, end } = selection.value;

  let newValue = '';
  if (start != null) {
    newValue += text.substring(0, start!);
  }
  newValue += value;
  if (end != null && end < text.length) {
    newValue += text.substring(end);
  }
  inputValue.value = newValue;
  selection.value = {
    start: Number(start) + value.length,
    end: Number(end) + value.length,
  };
  tryToSetCursorIndex();
  // if (focus != null) {
  //   isInputFocus.value = focus;
  // }
};
// event callback
function onSelectEmoji(emoji: any) {
  console.log(emoji);
  appendText(emoji.i, true);
  hide();
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
const onSrceenshot = () => {
  screenshots({}).then(res => {
    console.log('screenshots', res);
    var file = new File([res.blob!], `srceenshot-${new Date().getTime()}.png`, {
      type: 'image/png',
    });
    emits('open', [file], 'screenshots');
  });
};
defineExpose({
  clear,
  send,
  inputValue,
  appendText,
});
</script>

<template>
  <section class="chat-input" disabled="disabled">
    <div class="tool-bar">
      <a-space>
        <a-popover trigger="click" v-model:open="visible" overlayClassName="emoji-popover">
          <template #content>
            <EmojiPicker
              class="emoji-picker"
              :theme="colorScheme"
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
        <!-- <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
          <a-button type="text"><VideoCameraOutlined /></a-button>
        </a-popconfirm> -->

        <a-button type="text" @click="onSrceenshot"><ScissorOutlined /></a-button>

        <!-- <a-button type="text">
          <UploadOutlined />
        </a-button> -->
      </a-space>
    </div>
    <div class="input-body">
      <div class="input-area">
        <!-- <textarea
          rows="2"
          @input="onInput"
          @change="onInputChange"
          @click="onInputClick"
          @blur="onBlur"
        ></textarea> -->
        <scroll-view>
          <a-mentions
            ref="inputRef"
            class="textarea"
            v-model:value="inputValue"
            rows="5"
            :placeholder="t('SendContentPlaceholder')"
            :options="mentions"
            :autofocus="isInputFocus"
            :disabled="disabled"
            @keydown.ctrl.enter="send"
            @change="onTextChange"
            @select="onTextSelect"
            @blur="onBlur"
            @focus="onFocus"
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
            :disabled="isSendBtnDisabled"
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
<style>
.emoji-picker.v3-emoji-picker .v3-body {
  padding-bottom: 0;
}
.v3-group h5 {
  color: var(--v3picker-fg);
}
.emoji-popover.ant-popover .ant-popover-inner {
  padding: 0;
}
</style>
<style scoped>
:root {
  --antd-arrow-background-color: red;
}
:deep(.ant-mentions) {
  background-color: transparent;
}
.emoji-picker {
  padding: 0;
}

.emoji-popover.ant-popover .ant-popover-inner :deep(.emoji-popover.ant-popover .ant-popover-inner) {
  background-color: unset;
  padding: 0;
  --antd-arrow-background-color: red;
}
.emoji-popover.ant-popover .ant-popover-inner :deep(.ant-popover .ant-popover-inner) {
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
