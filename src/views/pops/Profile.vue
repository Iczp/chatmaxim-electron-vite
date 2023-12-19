<script setup lang="ts">
import { computed, watch, ref, h, onMounted, onActivated, onDeactivated } from 'vue';
import { useWindowStore } from '../../stores/window';
import { SessionUnitDetailDto, SessionUnitSenderDto } from '../../apis/dtos';
import ChatObject from '../../components/ChatObject.vue';
import LabelBox from '../../components/LabelBox.vue';
import LabelGroup from '../../components/LabelGroup.vue';
import TooBar from '../../components/TooBar.vue';
import { ChatOn, PersonAdd } from '../../icons';
import { HeartFilled } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import { SessionUnitService } from '../../apis/services/SessionUnitService';

const props = defineProps<{
  sessionUnitId: string;
  chatObjectId: number | string;
}>();

const windowStore = useWindowStore();

const sender = computed(() => windowStore.payload as SessionUnitSenderDto | undefined);

const detail = ref<SessionUnitDetailDto | undefined>();
const route = useRoute();
watch(
  () => route.fullPath,
  v => {
    console.log('route', route);

    SessionUnitService.getApiChatSessionUnitDetail({
      id: route.params.sessionUnitId as string,
    }).then(res => {
      detail.value = res;
    });
  },
);
const a = Object.entries(sender);

onActivated(() => {
  console.warn('onActivated');
});

onDeactivated(() => {
  console.warn('onDeactivated');
});

onMounted(() => {
  console.warn('onMounted');
});
</script>

<template>
  <page>
    <!-- <page-title /> -->
    <page-header>
      <TooBar />
      <div class="header drag">
        <chat-object :entity="sender?.owner" class="chat-object" :size="48" sub>
          <template #title-right>
            <HeartFilled />
          </template>
          <template #sub>
            <LabelBox class="chat-object-entry" title="账号">{{ sender?.owner?.code }}</LabelBox>
            <LabelBox class="chat-object-entry" title="群内昵称">
              {{ sender?.setting?.memberName }}
            </LabelBox>
          </template>
        </chat-object>
      </div>
      <div class="h-line"></div>
    </page-header>
    <page-content>
      <scroll-view>
        <LabelGroup title="会话信息">
          <LabelBox title="备注">{{ sender?.setting?.memberName }}</LabelBox>
          <LabelBox title="入群时间">20-23-3203</LabelBox>
          <LabelBox title="邀请人">20-23-3203</LabelBox>
        </LabelGroup>
        <LabelGroup title="会话信息">
          <LabelBox title="共同群聊">{{ sender?.setting?.memberName }}</LabelBox>
        </LabelGroup>
        <!-- <LabelGroup title="ddd">
          <LabelBox v-for="(value, key) in sender?.owner" :key="key" :title="`${key}`" sub>
            {{ value }}
          </LabelBox>
        </LabelGroup> -->
      </scroll-view>
    </page-content>
    <page-footer>
      <a-space>
        {{ sender?.friendshipSessionUnitId }}
        <a-button
          v-if="sender?.isFriendship"
          class="btn"
          type="text"
          :icon="h(ChatOn, { class: 'svg-icon s16' })"
        >
          发送消息
        </a-button>
        <a-button v-else class="btn" type="text" :icon="h(PersonAdd, { class: 'svg-icon s16' })">
          加为好友
        </a-button>
        <!-- <a-button class="btn" type="text">Dashed</a-button> -->
      </a-space>
    </page-footer>
  </page>
</template>

<style scoped>
.header {
  padding: 0 20px;
}
:deep(.sub-left) {
  flex-direction: column;
}
.h-line {
  width: 100%;
  height: 1px;
  background-color: #999;
  transform: scaleY(0.25);
}
.btn {
  display: flex;
  /* flex: 1; */
  font-size: 12px;
  align-items: center;
  justify-content: center;
}
:deep(.page-footer) {
  justify-content: space-around;
}

.chat-object-entry {
  padding: 0;
  border: none;
  justify-content: flex-start;
}
.chat-object-entry :deep(.title) {
  color: gray;
}
.chat-object-entry :deep(.title)::after {
  content: ':';
  margin: 0 4px;
}
</style>
