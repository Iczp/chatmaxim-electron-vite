<script setup lang="ts">
import {
  WatchStopHandle,
  computed,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';

import ChatSetting from './widget/ChatSetting.vue';
import DropViewer from './widget/DropViewer.vue';
import MessageItem from './components/MessageItem.vue';

import Loading from '../../components/Loading.vue';

import ScrollView from '../../components/ScrollView.vue';
import ChatInput from './widget/ChatInput.vue';

import { message } from 'ant-design-vue';
import { useImStore } from '../../stores/im';
import { MessageDto } from '../../apis/dtos';
import { ContextmenuInput, showContextMenuForMessage } from '../../commons/contextmenu';
import QuoteMessage from './components/QuoteMessage.vue';
import { useSessionUnitId } from '../../commons/useSessionUnit';
import { useMessageList } from '../../commons/useMessageList';
import { MessageStateEnums, MessageTypeEnums } from '../../apis/enums';
import { useSessionUnitDetail } from '../../commons/useSessionUnitDetail';
import { setReadedMessageId } from '../../commons/setting';
import { sendMessage } from '../../commons/sendMessage';
import { useDrop } from '../../commons/useDrop';
import { useShortcutStore } from '../../stores/shortcut';
import { FileContentDto } from '../../apis/dtos/message/FileContentDto';
import { mapToFileContentDto, mapToImageContentDtoAsync } from '../../commons/utils';
import { ChatObjectService } from '../../apis';
import { useI18n } from 'vue-i18n';
import { setWindow } from '../../ipc/setWindow';
import { useWindowStore } from '../../stores/window';
import { openChildWindow } from '../../ipc/openChildWindow';
import { toRaw } from 'vue';
const { t } = useI18n();
const store = useImStore();
const windowStore = useWindowStore();
const props = defineProps<{
  sessionUnitId: string;
  title?: string;
  /* 是否独立窗口（由Router传入参数 isSeparated, /src/routes/index.ts） */
  isSeparated?: boolean;
}>();
const route = useRoute();

const isSeparated = route.path.split('/').some(x => x == 'separate-chat');

const sessionUnitId = props.sessionUnitId;

const chatObjectId = Number(route.params.chatObjectId);

const sessionUnit = computed(() => store.getSessionUnit(sessionUnitId));

const loadingHeight = ref(40);

// const destinationList = useDestinationList({
//   id: sessionUnitId,
//   maxResultCount: 20,
// });

const { isInputEnabled, destination, destinationName, isImmersed, lastMessageId, readedMessageId } =
  useSessionUnitId(sessionUnitId);

const chatTitle = computed(
  () => destinationName.value || props.title || (route.query.title as string),
);

const activeLastMessageId = ref<number | null | undefined>();

const localReadedMessageId = ref<number | null | undefined>();

// onBeforeRouteUpdate((to, from) => {
//   console.log('onBeforeRouteUpdate', to, from);
//   setReadedMessageId({ sessionUnitId, messageId: lastMessageId.value! });
// });

const {
  list,
  fetchHistorical,
  fetchLatest,
  maxMessageId,
  onMessage,
  latestMessageCount,
  isBof,
  cancelChecked,
  isPendingOfFetchLatest,
  isPendingOfFetchHistorical,
} = useMessageList({ sessionUnitId });

const chatInput = ref<InstanceType<typeof ChatInput> | null>(null);

const scroll = ref<InstanceType<typeof ScrollView> | null>(null);

const dropViewer = ref<InstanceType<typeof DropViewer> | null>(null);

const chatSetting = ref<InstanceType<typeof ChatSetting> | null>(null);

const scrollElement = computed(() => scroll.value?.getElement());

// const scroll = ref();

const quoteMessage = ref<MessageDto>();

const selectable = ref(false);

const isSendBtnEnabled = ref(true);

const playMessageId = ref<number>();

const { detail, fetchDetail } = useSessionUnitDetail({ sessionUnitId });

watch(
  () => sessionUnitId,
  (sessionUnitId, old) => {
    console.warn('watch scroll', sessionUnitId, old);
  },
  { immediate: true },
);

watch(
  () => route.fullPath,
  (val, old) => {
    console.warn('watch route.fullPath', val, old);
  },
  { immediate: true },
);
const textValue = ref('669+++');

const showDrawer = () => {
  chatSetting.value?.open({
    chatObjectId: chatObjectId,
    sessionUnitId: sessionUnitId,
    entity: sessionUnit.value,
  });
  // openChatSettings();
};
const openChatSettings = () => {
  openChildWindow({
    t,
    window: {
      name: `${windowStore.name}:chat-settings`,
      path: `/chat-settings/members/${sessionUnitId}?chatObjectId=${chatObjectId}`,
      payload: {
        sessionUnit: toRaw(sessionUnit.value),
        memberCount: detail.value?.sessionUnitCount,
      },
      // isModel: true,
      parent: windowStore.name,
      isPreventClose: true,
      visiblity: true,
    },
  });
};
const scrollTo = (duration: number = 1500) => {
  scroll.value?.scrollTo({ duration });
};

const shortcutStore = useShortcutStore();

let stopShortcutWatch: WatchStopHandle | undefined;
let startShortcutWatch = () => {
  stopShortcutWatch = watch(
    () => shortcutStore['CommandOrControl+Enter'] + shortcutStore['Alt+S'],
    ticks => {
      const inputValue = chatInput.value?.inputValue;
      console.warn('CommandOrControl+Enter', ticks, inputValue);
      onSend({ value: inputValue });
    },
  );
};

const _onDeactivated = () => {
  // activeLastMessageId.value = lastMessageId.value;
  stopShortcutWatch?.call(this);
  localReadedMessageId.value = readedMessageId.value;
  selectable.value = false;
  cancelChecked();
};

const isSendPending = ref(false);
const _onActivated = () => {
  startShortcutWatch();
  scrollTo(0);
  //fetchDetail
  if (!detail.value) {
    fetchDetail();
  }
  fetchLatest({
    caller: 'onActivated',
  })
    .then(({ items, list, maxResultCount }) => {
      list.value = items.length == maxResultCount ? items : list.value.concat(items);
      nextTick(() => scrollTo(0));
    })
    .catch(err => {
      console.error(err);
    });

  onMessage(receivedMessage => {
    const isLatestMessage = Number(receivedMessage?.id) > Number(maxMessageId.value);
    console.warn(
      'onMessage isLatestMessage',
      isLatestMessage,
      receivedMessage.id,
      maxMessageId.value,
    );
    // store.clearBadge(chatObjectId, sessionUnitId);
    // setReadedMessageId({ sessionUnitId, messageId: receivedMessage!.id! });
    if (isLatestMessage && !isSendPending.value) {
      fetchLatest({
        caller: 'onMessage',
      })
        .then(({ items, list, maxResultCount }) => {
          console.warn('[chat] fetchLatest');
          list.value = items.length == maxResultCount ? items : list.value.concat(items);
          nextTick(() => scroll.value?.scrollTo({ duration: 1500 }));
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
  // ---------------------------------------------
  // activeLastMessageId.value = lastMessageId.value;
  localReadedMessageId.value = readedMessageId.value;
  store.clearBadge(chatObjectId, sessionUnitId);
  console.log('onActivated', destinationName.value);
  if (lastMessageId.value && Number(lastMessageId.value) > Number(readedMessageId.value)) {
    setReadedMessageId({ sessionUnitId, messageId: lastMessageId.value! });
  }
};

if (isSeparated) {
  onMounted(_onActivated);
  onUnmounted(_onDeactivated);
} else {
  onActivated(_onActivated);
  onDeactivated(_onDeactivated);
}

const onSend = async ({ event, value }: any) => {
  if (!value) {
    message.error({ content: t('Please Enter'), key: 'send-message' });
    return;
  }
  sendMessageContent({
    isClearInput: true,
    messageType: MessageTypeEnums.Text,
    content: {
      text: value,
    },
  });
};

const clearChatInput = (isClear: boolean): void => {
  if (!isClear) {
    return;
  }
  chatInput.value?.clear();
  quoteMessage.value = undefined;
};

const spliceItem = (autoId: number | undefined, arr: MessageDto[]) => {
  const findIndex = list.value?.findIndex(x => x.autoId == autoId);
  console.log('findIndex', findIndex);
  if (findIndex != -1) {
    // if (arr.length > 0) {
    //   arr[0].isShowTime = list.value[0].isShowTime;
    // }
    list.value.splice(findIndex, 1, ...arr);
  }
};

const sendMessageContent = async ({
  content,
  messageType,
  isClearInput,
  file,
}: {
  messageType: MessageTypeEnums;
  content: any;
  isClearInput: boolean;
  file?: Blob | File | any;
}) => {
  isSendPending.value = true;

  sendMessage({
    file,
    sessionUnitId,
    senderSessionUnit: detail.value,
    messageType,
    lastItem:
      list.value.length > 0
        ? //list.value.findLast(x => x.state == MessageStateEnums.Ok) ||
          list.value[list.value.length - 1]
        : undefined,
    quoteMessage: quoteMessage.value,
    content,
    onBefore(input) {
      isSendBtnEnabled.value = false;
      list.value.push(input);
      // setTimeout(() => {
      //   input.state = 3;
      // }, 1000);
      scroll.value?.scrollTo({ duration: 1500 });
      // nextTick(() => scroll.value?.scrollTo({ duration: 1500 }));
    },
    onSuccess(entity, input) {
      clearChatInput(isClearInput);

      fetchLatest({ caller: 'sendMessageContent' })
        .then(({ items, list }) => {
          // setTimeout(() => {
          spliceItem(input.autoId, items);
          // list.value = list.value.concat(items);
          // }, 1000);

          // scroll.value?.scrollTo({ duration: 0 });
          // nextTick(() => scroll.value?.scrollTo({ duration: 1500 }));
        })
        .catch(err => {
          spliceItem(input.autoId, []);
          console.error(err);
        })
        .finally(() => {
          isSendPending.value = false;
        });
    },
    onError(err, input) {
      spliceItem(input.autoId, []);
      list.value.push({
        ...input,
        state: MessageStateEnums.Error,
        error: err.message,
      });
      // scroll.value?.scrollTo({ duration: 1500 });
      console.error('sendRet', err);
      message.error({
        key: 'vm-chat',
        content: err.message,
      });
    },
    onAfter(input) {
      isSendBtnEnabled.value = true;
      // isSendPending.value = false;
    },
  });
};

const onRemoveQuoteMessage = () => (quoteMessage.value = undefined);

const showContextMenu = ({ labelType, mouseButton, event, entity }: ContextmenuInput) =>
  showContextMenuForMessage({
    t,
    labelType,
    event,
    entity,
    chatObjectId,
    sessionUnitId,
    sessionUnit: sessionUnit.value,
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
      list.value
        .filter(x => x.senderSessionUnit?.id == targetSessionUnitId)
        .forEach(x => (x.isFollowing = isFollowing));
    },
  });

const onReachStart = (event: CustomEvent) => {
  const el = event.target as HTMLElement;
  console.info('onReachStart');
  const isReachStart = el.scrollTop == 0;
  if (isBof.value) {
    console.error('onReachStart isBof', isBof.value);
    // message.info({ content: '没有了', key: 'list-bof' });
    return;
  }
  if (isPendingOfFetchHistorical.value) {
    return;
  }
  if (!isReachStart) {
    console.error('onReachStart', isReachStart);
    return;
  }

  const originalScrollHeight = scrollElement.value?.scrollHeight || 0;
  console.log('originalScrollHeight', originalScrollHeight);

  fetchHistorical()
    .then(x => {
      const newScrollHeight = scrollElement.value?.scrollHeight || 0;
      console.log('newScrollHeight', newScrollHeight);
      const scrollTop = newScrollHeight - originalScrollHeight - loadingHeight.value * 2;

      scroll.value?.scrollTo({ to: scrollTop, duration: 0 });

      nextTick(() => {
        // console.log('scrollHeight nextTick', scrollElement.value?.scrollHeight);
      });
    })
    .catch(err => {
      console.log(err);
    });
};
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
const uploadFile = (file: Blob) => {
  ChatObjectService.postApiChatChatObjectUpdatePortrait({
    id: 13,
    formData: {
      file,
    },
    onUploadProgress(progressEvent) {
      console.log('uploadFile onUploadProgress', progressEvent);
    },
  });
};
const dropHandle = (ev: DragEvent, { files, text }: { files?: any[]; text?: string }) => {
  console.log('dropHandle', ev, { files, text });
  if (!(Number(files?.length) > 0 || text)) {
    return;
  }
  dropViewer.value?.open({
    destination: destination.value,
    files,
    text,
    onConfirm(files, text) {
      console.log('onDropToSend', files, text);
      if (text) {
        sendMessageContent({
          isClearInput: false,
          messageType: MessageTypeEnums.Text,
          content: { text },
        });
      }
      if (files?.length != 0) {
        files!.forEach(async file => {
          const suffix = `.${file.name.split('.').pop().toLowerCase()}`;
          switch (suffix) {
            case '.jpg':
            case '.jpeg':
            case '.gif':
            case '.png':
            case '.tiff':
              const content = await mapToImageContentDtoAsync(file);
              sendMessageContent({
                file,
                isClearInput: false,
                messageType: MessageTypeEnums.Image,
                content: content,
              });
              break;

            default:
              sendMessageContent({
                file,
                isClearInput: false,
                messageType: MessageTypeEnums.File,
                content: mapToFileContentDto(file),
              });
              break;
          }
        });
      }
    },
  });
};

const { vDrop } = useDrop();

const onResend = (entity: MessageDto) => {
  console.log('onResend', entity);
  onRemove(entity);
  sendMessageContent({
    content: entity.content,
    messageType: entity.messageType!,
    isClearInput: false,
    file: entity.file,
  });
};
const onRemove = (entity: MessageDto) => {
  console.log('onRemove', entity);
  spliceItem(entity.autoId, []);
};
</script>

<template>
  <page class="chat-page" v-drop="dropHandle">
    <PageTitle
      :title="chatTitle"
      :description="`code${destination?.code}:memberCount(${
        detail?.sessionUnitCount || ''
      }) readedMessageId:${readedMessageId}`"
      @more="openChatSettings"
      @titleClick="showDrawer"
      :search="true"
      :top="true"
      more
    >
      <template v-if="isImmersed" v-slot:title>
        <!-- <icon type="mute" size="14" /> -->
        <icon type="mute" size="14" class="mute" />
      </template>
    </PageTitle>

    <page-content class="layout-content">
      <DropViewer ref="dropViewer" />
      <ChatSetting
        v-if="sessionUnitId"
        ref="chatSetting"
        :entity="sessionUnit"
        :sessionUnitId="sessionUnitId"
      />

      <scroll-view
        class="message-container"
        ref="scroll"
        @ps-y-reach-start="onReachStart"
        @ps-y-reach-end="onReachEnd"
      >
        <Loading v-if="isPendingOfFetchHistorical" :height="loadingHeight" />
        <!-- <EmptyData v-if="isBof" text="没有了" :height="20" /> -->
        <a-divider v-if="isBof" class="message-divider">{{ t('message.listStart') }}</a-divider>
        <MessageItem
          v-for="(item, index) in list"
          :key="item.id || item.autoId"
          :entity="item"
          :sessionUnitId="sessionUnitId"
          v-model:selectable="selectable"
          @resend="onResend(item)"
          @remove="onRemove(item)"
          @contextmenu="showContextMenu"
        >
          <template v-if="index != list.length - 1 && localReadedMessageId == item.id" #footer>
            <a-divider class="message-divider">{{ t('message.dividerNewNews') }}</a-divider>
          </template>
        </MessageItem>

        <Loading
          v-if="list.length == 0 && isPendingOfFetchLatest"
          :height="loadingHeight"
          :text="t('message.receiving')"
        />
      </scroll-view>
      <!-- <div class="latest-counter">有 {{ latestMessageCount }} 条最新消息</div> -->
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
  border-bottom: 1px solid var(--divider-color);
  color: var(--chat-page-main-title-color);
}
:deep(.page-title-left) {
  /* padding: 0 20px; */
}
:deep(.main-title-text) {
  font-size: 16px;
}
:deep(.sub-title) {
  color: var(--chat-page-sub-title-color);
}
.mute {
  color: var(--mute-color);
}
.chat-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex: 1;
  transition: all 0.3s linear;
  color: var(--chat-page-color);
  background-color: var(--chat-page-background-color);
}
.dragenter {
  background-color: #1584e57c;
}
.layout {
  background-color: unset;
}
.layout-side {
  display: flex;
  /* background-color: #f5f5f5ac; */
  background-color: unset;
  /* border-left: 1px solid var(--sider-border-color); */
}
.layout-content {
  display: flex;
  background-color: unset;
  position: relative;
}
.latest-counter {
  position: absolute;
  top: 20px;
  color: rgb(17, 0, 255);
  background-color: #ffffff6c;
  border: 1px solid #9999998e;
  border-radius: 12px;
  height: 24px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  right: 12px;
  font-size: 12px;
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
  /* background-color: rgba(241, 241, 241, 0.485); */
  flex: 1;
  /* padding: 20px; */
  /* flex-wrap: wrap; */
  width: 100%;
  box-sizing: border-box;
}
.message-item {
  display: flex;
}
.message-divider {
  font-size: 12px;
  color: var(--message-divider-color);
  justify-content: center;
}
.message-divider::before,
.message-divider::after {
  background-color: var(--message-divider-others-color);
  width: 20%;
}
.footer {
  padding: 0;
  height: auto;
  flex-direction: column;
}
</style>
