<script setup lang="ts">
import { CSSProperties, computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto as IczpSessionUnitOwnerDetailDto,
  MessageService,
  SessionUnitService,
  MessageSenderService,
  ApiError,
} from '../apis';

import type { CancelablePromise } from '../apis/core/CancelablePromise';
import ChatSetting from './ChatSetting.vue';

import MessageItem from '../components/MessageItem.vue';
import ChatInput from '../components/ChatInput.vue';
import { message } from 'ant-design-vue';
// import { Mentions, Form } from 'ant-design-vue';

import { useImStore } from '../stores/im';
import { MessageDto, ResultValue } from '../apis/dtos';
import { ContextmenuInput, showContextMenuForMessage } from '../commons/contextmenu';
import QuoteMessage from '../components/QuoteMessage.vue';

const store = useImStore();

const props = defineProps<{
  sessionUnitId: string;
  title?: string;
}>();

const route = useRoute();

const chatInput = ref<InstanceType<typeof ChatInput> | null>(null);

const quoteMessage = ref<MessageDto | null | undefined>();

const selectable = ref(false);

const isSendBtnEnabled = ref(true);

const playMessageId = ref<number | undefined>();

const detail = ref<IczpSessionUnitOwnerDetailDto>({});

const info = computed(() => store.getItem(props.sessionUnitId!));

const setting = computed(() => info.value?.setting);

const isInputEnabled = computed(() => info.value?.setting?.isInputEnabled);

watch(
  () => selectable.value,
  v => {
    console.log('isSelectable', v);
  },
);
const messages = reactive<MessageDto[]>([]);

const ret = reactive<ResultValue<MessageDto>>({
  isPosting: false,
  isEof: false,
  items: [],
});

let task1: CancelablePromise<IczpSessionUnitOwnerDetailDto> | null;

const fetchData = ({ sessionUnitId }: { sessionUnitId: string }) => {
  task1 = SessionUnitService.getApiChatSessionUnitDetail({
    id: sessionUnitId,
  });
  // task1?.cancel();

  task1.then(res => {
    // console.log('SessionUnitService.getApiChatSessionUnitDetail', res);
    detail.value = res;
  });

  MessageService.getApiChatMessage({
    sessionUnitId: props.sessionUnitId,
    maxResultCount: 10,
  }).then(res => {
    ret.items = res.items!.map((x, i) => ({ ...x, state: 1, isSelf: i % 2 == 0 }));
    // console.log('MessageService.getApiChatMessage', res);
  });
};

// const displayName = computed(
//   () => route.query.title || props.title || entity.value?.displayName || entity.value?.destination?.name,
// );

const destinationName = computed(
  () =>
    info.value?.setting?.rename || info.value?.destination?.name || (route.query.title as string),
);

const pageTitle = ref('');

const scroll = ref(null);

watch(
  () => props.sessionUnitId,
  sessionUnitId => {
    task1?.cancel();
    // console.log('watch scroll', sessionUnitId, scroll.value);
    pageTitle.value = destinationName.value || '';
    fetchData({ sessionUnitId });
  },
  { immediate: true },
);

const textValue = ref('669+++');

const chatSettingDisplay = ref(false);
const open = ref<boolean>(false);
const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};

const afterOpenChange = (bool: boolean) => {
  // console.log('open', bool);
};

const onSend = async ({ event, value }: any) => {
  console.log('send', textValue.value);
  isSendBtnEnabled.value = false;
  MessageSenderService.postApiChatMessageSenderSendText({
    sessionUnitId: props.sessionUnitId,
    requestBody: {
      quoteMessageId: quoteMessage.value?.id,
      ignoreConnections: null,
      remindList: [],
      content: {
        text: value,
      },
    },
  })
    .then(res => {
      console.log('sendRet', res);
      chatInput.value?.clear();
      quoteMessage.value = null;
      Object.assign(quoteMessage, null);

      fetchData({ sessionUnitId: props.sessionUnitId });
    })
    .catch((err: ApiError) => {
      console.error('sendRet', err.body.error.message);
      message.error({
        key: 'vm-chat',
        content: err.body.error.message,
      });
    })
    .finally(() => {
      isSendBtnEnabled.value = true;
    });
};
const onTitleClick = () => {
  console.log('onTitleClick', detail.value);
};

const onRemoveQuoteMessage = () => (quoteMessage.value = undefined);

const entries = computed(() =>
  Object.keys(detail.value).map(key => ({
    key,
    value: (detail.value as Record<string, any>)[key],
  })),
);
const entryItems = computed(() => [
  {
    text: '名称',
    value: detail.value.destination?.name,
  },
  {
    text: '类型',
    value: detail.value.destination?.objectType,
  },
  {
    text: 'SessionId',
    value: detail.value.sessionId,
  },
  {
    text: '群内名称',
    value: setting.value?.memberName,
  },
]);

const showContextMenu = ({ labelType, mouseButton, event, entity }: ContextmenuInput) =>
  showContextMenuForMessage({
    labelType,
    event,
    entity,
    sessionUnitId: props.sessionUnitId,
    selectable,
    playMessageId,
    mouseButton,
    onQuote(entity) {
      console.log('onQuote', this, entity);
      quoteMessage.value = entity;
    },
  });

const contentStyle: CSSProperties = {
  // display: 'flex',
  // textAlign: 'center',
  // minHeight: '100%',
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#108ee9',
};

const bodyStyle: CSSProperties = {
  display: 'flex',
  backgroundColor: '#f6f6f6',
  margin: 0,
  padding: 0,
};

// onMounted(() => {
//   document.addEventListener('drop', (e: any) => {
//     e.preventDefault();
//     e.stopPropagation();

//     for (const f of e.dataTransfer.files) {
//       console.log('File(s) you dragged here: ', f.path);
//     }
//   });
//   document.addEventListener('dragover', e => {
//     e.preventDefault();
//     e.stopPropagation();
//   });
// });
const isDrag = ref(false);
const dragenter = (e: DragEvent) => {
  console.log('dragenter', e);
  isDrag.value = true;
};
const dragleave = (e: DragEvent) => {
  console.log('dragleave', e);
};
const dragover = (e: DragEvent) => {
  // console.log('dragover', e);
};
const drop = (e: DragEvent) => {
  console.log('drop', e);
  isDrag.value = false;
};

const mouseleave = (e: MouseEvent) => {
  // console.log('mouseleave', e);
  isDrag.value = false;
};
</script>

<template>
  <page
    class="chat"
    :class="{ dragenter: isDrag }"
    @dragenter="dragenter"
    @dragleave="dragleave"
    @dragover="dragover"
    @drop="drop"
    @mouseleave="mouseleave"
  >
    <PageTitle
      :title="destinationName"
      :description="`code${detail?.destination?.code},title: ${route.query.title}当前在心`"
      @more="showDrawer"
      :search="true"
      :top="true"
      more
    >
      <template v-if="setting?.isImmersed" v-slot:title>
        <icon type="mute" size="16" color="gray" />
      </template>
    </PageTitle>

    <page-content :style="contentStyle" class="layout-content">
      <a-drawer
        width="320"
        v-model:open="open"
        class="chat-setting"
        :bodyStyle="bodyStyle"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        title="聊天设置"
        placement="right"
        @after-open-change="afterOpenChange"
      >
        <ChatSetting :entity="info" :sessionUnitId="props.sessionUnitId" />
      </a-drawer>
      <scroll-view class="message-container" ref="scroll">
        <MessageItem
          v-for="(item, index) in ret.items"
          :key="item.id"
          :entity="item"
          :sessionUnitId="props.sessionUnitId"
          v-model:selectable="selectable"
          @contextmenu="showContextMenu"
        ></MessageItem>
      </scroll-view>
    </page-content>
    <page-footer class="footer">
      <ChatInput ref="chatInput" v-model:value="textValue" @send="onSend">
        <QuoteMessage
          v-if="quoteMessage"
          :entity="quoteMessage"
          @remove="onRemoveQuoteMessage"
          removable
        />
      </ChatInput>
    </page-footer>
  </page>
</template>

<style scoped>
:deep(.page-title) {
  height: 64px;
}
:deep(.page-title-left) {
  padding: 0 20px;
}
:deep(.main-title-text) {
  font-size: 16px;
}
.chat-setting {
  background-color: #d70c0c;
  color: red;
}
.chat {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex: 1;
}
.dragenter {
  background-color: #15e53b2a;
}
.layout {
  background-color: unset;
}
.layout-side {
  display: flex;
  /* background-color: #f5f5f5ac; */
  background-color: unset;
  border-left: 1px solid #ccc;
}
.layout-content {
  display: flex;
  background-color: unset;
}
:deep(.ant-mentions) {
  /* background-color: #f5f5f5ac; */
  border: none;
  /* padding: 12px; */
  border-radius: 0;
  resize: none;
  box-shadow: none;
}

.message-container {
  display: flex;
  flex-direction: column;
  background-color: rgba(241, 241, 241, 0.485);
  flex: 1;
  /* padding: 20px; */
  /* flex-wrap: wrap; */
  width: 100%;
  box-sizing: border-box;
}
.message-item {
  display: flex;
}

.footer {
  padding: 0;
  height: auto;
  flex-direction: column;
}
</style>
