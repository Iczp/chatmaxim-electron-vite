<script setup lang="ts">
import { Ref, computed, reactive, ref } from 'vue';
import {
  IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto,
  SessionUnitOwnerDto,
} from '../apis';
import { formatMessageTime } from '../commons/utils';
import Badge from '../components/Badge.vue';
import Avatar from '../components/Avatar.vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { MessageTypeEnums } from '../apis/enums';
const props = defineProps<{
  title?: string;
  active?: boolean;
  entity: SessionUnitOwnerDto | undefined;
}>();

const messageType = computed(
  () => props.entity?.lastMessage?.messageType as MessageTypeEnums | undefined,
);

const isRollback = computed(() => props.entity?.lastMessage?.rollbackTime != null);
const destination = computed(() => props.entity?.destination);
const lastMessage = computed(() => props.entity?.lastMessage);
const objectType = computed(() => props.entity?.destination?.objectType);
const content = computed(() => props.entity?.lastMessage?.content);
const sendTime = computed(() =>
  formatMessageTime(new Date(props.entity?.lastMessage?.creationTime!)),
);
const badge = computed(() => props.entity?.publicBadge || 0);
const senderName = computed(() => props.entity?.lastMessage?.senderName);
const destinationName = computed(
  () => props.entity?.destination?.name + '-' + props.entity?.ownerId,
);
</script>

<template>
  <div class="session-item" :class="{ active }">
    <div class="active-bar"></div>
    <!-- <Avatar /> -->
    <a-avatar :size="48" :alt="destination?.name">
      <template #icon><UserOutlined /></template>
    </a-avatar>

    <div class="session-description">
      <div class="session-title">
        <div class="title-left">
          <div class="text-ellipsis">{{ destinationName }}</div>
        </div>
        <div class="title-right">{{ sendTime }}</div>
      </div>
      <div class="message-content">
        <div class="content-left">
          <div class="text-ellipsis">
            <!-- <span>不支持的类型=========================</span> -->
            <!-- @我 -->
            <span v-if="entity!.remindMeCount!>0" class="remind">
              {{ Number(entity?.remindMeCount) > 99 ? '99+' : entity?.remindMeCount }}@我
            </span>
            <!-- 发送人信息 -->
            <span v-if="senderName && messageType != MessageTypeEnums.Cmd" class="sender">
              {{ senderName }}:
            </span>
            <!-- 消息内容 -->
            <span v-if="isRollback">消息被撤回</span>
            <span v-else-if="messageType == MessageTypeEnums.Text">{{ content.text }}</span>
            <span v-else-if="messageType == MessageTypeEnums.Image">[图片]</span>
            <span v-else-if="messageType == MessageTypeEnums.Video">[视频]</span>
            <span v-else-if="messageType == MessageTypeEnums.Location">
              [位置]{{ content.name }}
            </span>
            <span v-else-if="messageType == MessageTypeEnums.Contacts">
              [名片]{{ content.title }}
            </span>
            <span v-else-if="messageType == MessageTypeEnums.Sound">[语音]</span>
            <span v-else-if="messageType == MessageTypeEnums.Cmd">{{ content.text }}</span>
            <span v-else-if="messageType == MessageTypeEnums.RedEnvelope">[红包]</span>
            <span v-else-if="messageType == MessageTypeEnums.Html">
              {{ content.title }} {{ content.content }}
            </span>
            <span v-else>[不支持的类型]</span>
          </div>
        </div>
        <div class="content-right">
          <a-badge v-if="badge != 0" :count="badge" :overflow-count="99" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-item {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: var(--side-width);
}
.active-bar {
  /* display: none; */
  left: 0;
  height: 0;
  position: absolute;
  width: 3px;
  border-radius: 1px;
  /* height: 100%; */
  background-color: rgba(24, 144, 255, 0.1);
  transition: all 0.3s;
}
.session-item.active .active-bar {
  display: block;
  height: 100%;
  background-color: rgba(24, 144, 255, 1);
}
.session-item {
  display: flex;
  position: relative;
  flex-direction: row;
  box-sizing: border-box;
  height: 64px;
  align-items: center;
  flex-shrink: 0;
  padding: 0 12px;
  cursor: default;
  user-select: none;
  transition: all 0.3s;
}
.session-item.active {
  background-color: rgba(255, 255, 255, 1);
}
.session-item.active:hover {
  background-color: rgba(255, 255, 255, 1);
}
.session-item:active {
  background-color: rgba(26, 144, 255, 0.3);
}
.session-item:hover {
  background-color: rgba(230, 230, 230, 0.813);
}

.session-description {
  display: flex;
  flex: 1;
}

.session-description {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  flex: 1;
}

.message-title,
.message-content {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
}

.content-left {
  display: flex;
  flex: 1;
  /* max-width: calc(100% - 30px); */
  max-width: 150px;
}
.session-title {
  display: flex;
  justify-content: space-between;
  color: rgba(0, 0, 0, 1);
  font-size: 14px;
  height: 28px;
  align-items: center;
}
.title-left {
  display: flex;
  max-width: 120px;
  font-weight: 500;
}
.title-right {
  display: flex;
  max-width: 120px;
  color: #ccc;
  font-size: 12px;
}

.message-content {
  position: relative;
  color: rgb(150, 150, 150);
  font-size: 12px;
  height: 20px;
}
.remind {
  display: inline-flex;

  color: white;
  background: #ff4d4f;
  border-radius: 4px;
  padding: 0 4px;
  box-shadow: 0 0 0 1px #ffffff;
  margin-right: 4px;
}
</style>
