<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref, watch } from 'vue';
import {
  IczpNet_Chat_MessageSections_Messages_Dtos_MessageOwnerDto as MessageOwnerDto,
  IczpNet_Chat_SessionUnits_Dtos_SessionUnitOwnerDetailDto as IczpSessionUnitOwnerDetailDto,
  MessageService,
  PagedResultDto,
  SessionUnitService,
} from '../apis';
import {
  UploadOutlined,
  MehOutlined,
  VideoCameraOutlined,
  FolderOpenOutlined,
  ScissorOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue';

import { useRoute } from 'vue-router';

const props = defineProps<{
  sessionUnitId: string;
  title?: string;
  aa?: string;
}>();
const route = useRoute();

const entity: Ref<IczpSessionUnitOwnerDetailDto> = ref({});

onMounted(() => {});

const messages: Ref<MessageOwnerDto[]> = ref([]);

const fetchData = ({ sessionUnitId }: { sessionUnitId: string }) => {
  SessionUnitService.getApiChatSessionUnitDetail({
    id: sessionUnitId,
  }).then(res => {
    console.log('SessionUnitService.getApiChatSessionUnitDetail', res);
    entity.value = res;
  });

  MessageService.getApiChatMessage({
    sessionUnitId: props.sessionUnitId,
  }).then(res => {
    messages.value = res.items!;
    console.log('MessageService.getApiChatMessage', res);
  });
};

const displayName = computed(
  () => props.title || entity.value?.displayName || entity.value?.destination?.name,
);

const scroll = ref(null);

watch(
  () => props.sessionUnitId,
  sessionUnitId => {
    console.log('watch scroll', sessionUnitId, scroll.value);
    fetchData({ sessionUnitId });
  },
  { immediate: true },
);

const textValue = ref('');
</script>

<template>
  <div class="page-container">
    <div class="page-title">
      <div class="page-title-left">
        <h1 class="main-title">{{ displayName }}</h1>
        <h2 class="sub-title">
          code{{ entity?.destination?.code }},title: {{ route.query.title }}当前在心
        </h2>
      </div>
      <div class="page-title-right">
        <MoreOutlined />
      </div>
    </div>
    <scroll-view class="message-container" ref="scroll">
      <p>Chating-{{ sessionUnitId }}.</p>

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
        <a-textarea
          v-model:value="textValue"
          class="textarea"
          placeholder="说点什么..."
          :rows="4"
        />
        <br />
      </div>
      <div class="input-footer">
        <div class="footer-left">200/1000</div>
        <div class="footer-right">
          <a-button type="primary" html-type="submit">
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
.page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
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
}
.textarea {
  width: 100%;
  height: 100%;
  border: none;
  padding: 12px;
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
