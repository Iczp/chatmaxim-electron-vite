<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref, watch } from 'vue';
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
} from '@ant-design/icons-vue';

import { message } from 'ant-design-vue';
// import { Mentions, Form } from 'ant-design-vue';

const props = defineProps<{
  sessionUnitId: string;
  title?: string;
  aa?: string;
}>();
const route = useRoute();

const entity = ref<IczpSessionUnitOwnerDetailDto>({});

const messages = ref<MessageOwnerDto[]>([]);

let task1: CancelablePromise<IczpSessionUnitOwnerDetailDto> | null;

const fetchData = ({ sessionUnitId }: { sessionUnitId: string }) => {
  task1 = SessionUnitService.getApiChatSessionUnitDetail({
    id: sessionUnitId,
  });
  // task1?.cancel();

  task1.then(res => {
    // console.log('SessionUnitService.getApiChatSessionUnitDetail', res);
    entity.value = res;
  });

  MessageService.getApiChatMessage({
    sessionUnitId: props.sessionUnitId,
    maxResultCount: 30,
  }).then(res => {
    messages.value = res.items!;
    // console.log('MessageService.getApiChatMessage', res);
  });
};

// const displayName = computed(
//   () => route.query.title || props.title || entity.value?.displayName || entity.value?.destination?.name,
// );
const pageTitle = ref('');

const scroll = ref(null);

watch(
  () => props.sessionUnitId,
  sessionUnitId => {
    task1?.cancel();
    // console.log('watch scroll', sessionUnitId, scroll.value);
    pageTitle.value = route.query.title as string;
    fetchData({ sessionUnitId });
  },
  { immediate: true },
);
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
const textValue = ref('');

const open = ref(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
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
  console.log('onTitleClick', entity.value);
};
</script>

<template>
  <div class="page-container">
    <div class="page-title">
      <div class="page-title-left" @click="onTitleClick">
        <h1 class="main-title">{{ pageTitle }}</h1>
        <h2 class="sub-title">
          code{{ entity?.destination?.code }},title: {{ route.query.title }}当前在心
        </h2>
      </div>
      <div class="page-title-right" @click="showDrawer">
        <MoreOutlined />
      </div>
    </div>

    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="true"
      :open="open"
      :get-container="false"
      :style="{ position: 'absolute' }"
      @close="onClose"
    >
      <p>Some contents...</p>
    </a-drawer>

    <scroll-view class="message-container" ref="scroll">
      <p>prop.id :{{ sessionUnitId }}.</p>

      <div>entity id:{{ entity?.id }}</div>

      <div v-for="(item, index) in messages" class="message-item">
        <h3>senderName:{{ item.senderName }}</h3>
        <p>{{ item.content }}</p>
      </div>
    </scroll-view>
    <div class="chat-input">
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
      <div class="input-area">
        <scroll-view>
          <!-- <a-textarea
            v-model:value="textValue"
            class="textarea"
            placeholder="说点什么..."
            :rows="4"
          /> -->
          <a-mentions
            class="textarea"
            v-model:value="textValue"
            rows="5"
            placeholder="说点什么..."
            :options="options"
            :autofocus="true"
          ></a-mentions>
          <!-- <br /> <br /> <br /> <br /> <br /> -->
        </scroll-view>
      </div>
      <div class="input-footer">
        <div class="footer-left">{{ textValue.length }} /1000</div>
        <div class="footer-right">
          <a-button type="primary" @click="onSend" :disabled="!isSendBtnEnabled">
            发送(
            <u>S</u>
            )
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  padding: 0 12px;
  box-sizing: border-box;
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
  padding: 20px;
  /* width: 100%; */
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
