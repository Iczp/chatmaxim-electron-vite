<script setup lang="ts">
import { CSSProperties, Ref, computed, onMounted, reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import {
  IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto as MessageOwnerDto,
  IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto as IczpSessionUnitOwnerDetailDto,
  MessageService,
  PagedResultDto,
  SessionUnitService,
  MessageSenderService,
  ApiError,
} from '../apis';
import type { CancelablePromise } from '../apis/core/CancelablePromise';
import {
  UploadOutlined,
  MehOutlined,
  VideoCameraOutlined,
  FolderOpenOutlined,
  ScissorOutlined,
  MoreOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue';
import ChatSetting from './ChatSetting.vue';

import MessageLayout from '../components/MessageLayout.vue';
import ChatInput from '../components/ChatInput.vue';
import { message } from 'ant-design-vue';
// import { Mentions, Form } from 'ant-design-vue';

import { useImStore } from '../stores/im';
import { MessageDto, ResultValue } from '../apis/dtos';

const store = useImStore();

const props = defineProps<{
  sessionUnitId: string;
  title?: string;
}>();
const route = useRoute();

const detail = ref<IczpSessionUnitOwnerDetailDto>({});

const info = computed(() => store.getItem(props.sessionUnitId!));

const setting = computed(() => info.value?.setting);

const isInputEnabled = computed(() => info.value?.setting?.isInputEnabled);

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
const isSendBtnEnabled = ref(true);
const onSend = async () => {
  console.log('send', textValue.value);
  isSendBtnEnabled.value = false;
  MessageSenderService.postApiChatMessageSenderSendText({
    sessionUnitId: props.sessionUnitId,
    requestBody: {
      quoteMessageId: null,

      ignoreConnections: null,

      remindList: [],
      content: {
        text: textValue.value,
      },
    },
  })
    .then(res => {
      console.log('sendRet', res);
      textValue.value = '';

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
  <div
    class="chat"
    :class="{ dragenter: isDrag }"
    @dragenter="dragenter"
    @dragleave="dragleave"
    @dragover="dragover"
    @drop="drop"
    @mouseleave="mouseleave"
  >
    <a-layout class="layout">
      <a-layout-content :style="contentStyle" class="layout-content">
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

        <div class="page-container">
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
          <!-- <div class="message-container"> -->
          <scroll-view class="message-container" ref="scroll">
            <!-- <h3>prop.id :{{ sessionUnitId }}</h3>
            <div>entity id:{{ detail }}</div>
            <div>setting:{{ setting }}</div> -->
            <MessageLayout v-for="(item, index) in ret.items" :key="item.id" :item="item">
              <h3>{{ item.senderDisplayName }}</h3>
              <p>{{ item }}</p>
            </MessageLayout>
          </scroll-view>
          <!-- </div> -->
          {{ textValue }}
          <ChatInput v-model:value="textValue" @send="onSend" />
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped>
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
.ps {
  width: 100%;
  height: 100%;
}
.page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.qs {
  width: 100%;
  height: 100%;
}
.page-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  background-color: #f5f5f5ac;
  font-size: 16px;
  flex-shrink: 0;
  border-bottom: 1px solid #ccc;

  box-sizing: border-box;
}
.page-title-left {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
}
.page-title-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.main-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  height: 32px;
}
.sub-title {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin: 0;
  color: #ccc;
  height: 20px;
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
.chat-input {
  display: flex;
  flex-direction: column;
  height: 200px;

  /* background-color: #f6f6f6; */
  justify-content: stretch;
  align-items: stretch;
  flex-shrink: 0;
  border-top: 1px solid #ccc;
}
.tool-bar {
  display: flex;
  height: 36px;
  align-items: center;
  /* padding: 0 12px; */
}
.input-area {
  display: flex;
  flex: 1;
  width: 100%;
}
.textarea {
  width: 100%;
  height: 100%;
  border: none;
  /* padding: 12px; */
  border-radius: 0;
  resize: none;
  font-size: 14px;
}
:where(.css-dev-only-do-not-override-kqecok).ant-input:focus,
:where(.css-dev-only-do-not-override-kqecok).ant-input-focused {
  /* border-color: #4096ff; */
  box-shadow: none;
  border-inline-end-width: 1px;
  outline: 0;
}
.input-footer {
  display: flex;
  flex-direction: row;
  height: 36px;
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
.send {
  height: 24px;
}
</style>
