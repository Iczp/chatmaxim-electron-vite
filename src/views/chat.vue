<script setup lang="ts">
import { CSSProperties, computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto as IczpSessionUnitOwnerDetailDto,
  MessageSenderService,
  ApiError,
} from '../apis';

import ChatSetting from './ChatSetting.vue';

import MessageItem from '../components/MessageItem.vue';
import ScrollView from '../components/ScrollView.vue';
import ChatInput from '../components/ChatInput.vue';
import { message } from 'ant-design-vue';
import { useImStore } from '../stores/im';
import { MessageDto } from '../apis/dtos';
import { ContextmenuInput, showContextMenuForMessage } from '../commons/contextmenu';
import QuoteMessage from '../components/QuoteMessage.vue';
import { useSessionUnitId } from '../commons/useSessionUnit';
import { useDestinationList } from '../commons/useDestinationList';
import { useMessageList } from '../commons/useMessageList';

const store = useImStore();

const props = defineProps<{
  sessionUnitId: string;
  title?: string;
}>();

const sessionUnitId = props.sessionUnitId;

const route = useRoute();

const info = computed(() => store.getItem(sessionUnitId));

const destinationList = useDestinationList({
  id: sessionUnitId,
  maxResultCount: 20,
});

const { isInputEnabled, destinationName, isImmersed, memberName } = useSessionUnitId(sessionUnitId);

const messageList = useMessageList({ sessionUnitId });

const chatInput = ref<InstanceType<typeof ChatInput> | null>(null);

const scroll = ref<InstanceType<typeof ScrollView> | null>(null);

// const scroll = ref();

const quoteMessage = ref<MessageDto | null | undefined>();

const selectable = ref(false);

const isSendBtnEnabled = ref(true);

const playMessageId = ref<number | undefined>();

const detail = ref<IczpSessionUnitOwnerDetailDto>({});

watch(
  () => sessionUnitId,
  sessionUnitId => {
    console.log('watch scroll', sessionUnitId);
  },
  { immediate: true },
);

const textValue = ref('669+++');

const open = ref<boolean>(false);
const showDrawer = () => {
  open.value = true;
};

const afterOpenChange = (bool: boolean) => {
  // console.log('open', bool);
};

// const scrollToBottom = () => {
//   nextTick(() => {
//     const el: HTMLElement = scroll.value.$el;
//     el.scrollTop = el.scrollHeight;
//   });
// };
const onSend = async ({ event, value }: any) => {
  console.log('send', textValue.value);
  isSendBtnEnabled.value = false;
  MessageSenderService.postApiChatMessageSenderSendText({
    sessionUnitId: sessionUnitId,
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
      messageList.fetchNew();
      console.log('scrollBar.value', scroll.value);
      scroll.value?.scrollToBottom({ duration: 1500 });
      // const el: HTMLElement = scroll.value;
      // el.scrollTop = el.scrollHeight;
      // messageList.changeTick(scrollToBottom);
    })
    .catch((err: ApiError) => {
      console.error('sendRet', err);
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

const showContextMenu = ({ labelType, mouseButton, event, entity }: ContextmenuInput) =>
  showContextMenuForMessage({
    labelType,
    event,
    entity,
    sessionUnitId: sessionUnitId,
    selectable,
    playMessageId,
    mouseButton,
    onRemind(entity) {
      console.log('remind:', entity);
    },
    onQuote(entity) {
      console.log('onQuote', this, entity);
      quoteMessage.value = entity;
    },
    onFollowing(targetSessionUnitId: string, isFollowing: boolean) {
      messageList.items.value
        .filter(x => x.senderSessionUnit?.id == targetSessionUnitId)
        .forEach(x => (x.isFollowing = isFollowing));
    },
  });

const onReachEnd = (event: CustomEvent) => {
  const el = event.target as HTMLElement;
  console.info('onReachEnd');
  const isReachEnd = el.scrollTop != 0; //&& el.scrollTop > el.offsetHeight;
  if (!isReachEnd) {
    console.error(
      'onReachEnd',
      isReachEnd,
      el.clientHeight,
      el.offsetHeight,
      el.scrollHeight,
      el.scrollTop,
    );

    return;
  }
};

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
      :description="`code${detail?.destination?.code}:memberCount(${destinationList.totalCount.value})`"
      @more="showDrawer"
      :search="true"
      :top="true"
      more
    >
      <template v-if="isImmersed" v-slot:title>
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
        <ChatSetting :entity="info" :sessionUnitId="sessionUnitId" />
      </a-drawer>
      <scroll-view class="message-container" ref="scroll" @ps-y-reach-end="onReachEnd">
        <MessageItem
          v-for="item in messageList.items.value"
          :key="item.id"
          :entity="item"
          :sessionUnitId="sessionUnitId"
          v-model:selectable="selectable"
          @contextmenu="showContextMenu"
        ></MessageItem>
      </scroll-view>
    </page-content>
    <page-footer class="footer">
      <ChatInput
        ref="chatInput"
        :disabled="!isInputEnabled"
        v-model:value="textValue"
        @send="onSend"
      >
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
