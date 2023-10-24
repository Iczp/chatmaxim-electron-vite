<script setup lang="ts">
import { Ref, computed, reactive, ref } from 'vue';
import {
  IczpNet_Chat_MessageSections_Messages_Dtos_MessageDto,
  IczpNet_Chat_SessionUnits_Dtos_SessionUnitSettingDto,
  SessionUnitOwnerDto,
} from '../apis';
import { MessageDto } from '../apis/dtos';
import { formatMessageTime } from '../commons/utils';

import { UserOutlined } from '@ant-design/icons-vue';
import { MessageTypeEnums } from '../apis/enums';
const props = defineProps<{
  title?: string;
  active?: boolean;
  entity: SessionUnitOwnerDto | undefined;
  item: MessageDto;
  settings?: IczpNet_Chat_SessionUnits_Dtos_SessionUnitSettingDto;
  isPlay?: boolean;
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
const settings = computed(() => props.entity?.publicBadge || 0);
const senderName = computed(() => props.entity?.lastMessage?.senderName);
const destinationName = computed(
  () => props.entity?.destination?.name + '-' + props.entity?.ownerId,
);

const onMsgTap = (item: MessageDto) => {};

const onLongpress = (item: MessageDto) => {};

const onMsgLongpress = (event: CustomEvent) => {};
</script>

<template>
  <div class="chat-item">
    <div v-if="item.isShowTime" class="msg-sendtime"><span v-text="sendTime"></span></div>
    <!-- 消息-->
    <!-- item.senderType:{{item.senderType}} -->
    <!-- 消息撤回-->
    <msg-rollback v-if="item.rollbackTime != null" class="rollback-item" :item="item" />
    <msg-cmd
      v-else-if="item.messageType == MessageTypeEnums.Cmd"
      :item="item"
      @onTap="onMsgTap(item)"
    />
    <msg-html
      v-else-if="messageType == MessageTypeEnums.Html"
      :item="item"
      @onLongpress="onLongpress"
    />
    <div v-else-if="messageType == MessageTypeEnums.Article"><msg-article :item="item" /></div>
    <!-- 消息体 start-->
    <div v-else class="content-item" :class="{ self: item.isSelf }">
      <!-- {{item.isReverse}} -->
      <!-- 头像 -->
      <div class="media-info">
        <!-- <media-image
          :id="item.sender"
          :type="item.senderType"
          from="chat"
          :isNav="true"
          @dbtap="onDoubleTap(item)"
        /> -->
        <!-- <read-result :isSelf="item.isSelf" :messageId="item.id" /> -->
      </div>
      <div class="msg-info">
        <!-- 昵称 -->
        <media-named
          v-if="!item.isSelf && settings.isShowMemberName"
          :id="item.sender"
          :type="item.sender?.objectType"
          :isShowDep="settings.isShowMemberName"
        />

        <!-- 消息主体 -->
        <div
          class="content-info"
          @click="onMsgTap(item)"
          @longpress.prevent.stop="onMsgLongpress($event)"
        >
          <!-- 消息 Start -->
          <msg-image v-if="messageType == MessageTypeEnums.Image" :item="item" />
          <msg-sound
            v-else-if="messageType == MessageTypeEnums.Sound"
            :item="item"
            :play="isPlay"
          />
          <msg-location v-else-if="messageType == MessageTypeEnums.Location" :item="item" />
          <msg-contacts v-else-if="messageType == MessageTypeEnums.Contacts" :item="item" />
          <msg-link v-else-if="messageType == MessageTypeEnums.Link" :item="item" />
          <msg-video v-else-if="messageType == MessageTypeEnums.Video" :item="item" />
          <msg-red-envelope v-else-if="messageType == MessageTypeEnums.RedEnvelope" :item="item" />
          <msg-text v-else-if="messageType == MessageTypeEnums.Text" :item="item" />
          <msg-unsupported v-else :item="item" />
          <!-- 消息 End -->
          <msg-state :isSelf="item.isSelf" :state="item.state" />
          <!-- <read-result v-if="settings.isShowReaded" :isSelf="item.isSelf" :messageId="item.id" /> -->
        </div>
      </div>
    </div>
    <!-- 消息体 end-->
  </div>
</template>

<style scoped>
.message-item {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: var(--side-width);
}

.chat-item {
  /* // 消息与头像的间距 */
  --margin-width: 12px;
  display: flex;
  flex-direction: column;
}

.msg-sendtime {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  box-sizing: border-box;
  font-size: 12px;
  color: #ccc;
}

.media-info {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}

.msg-sendtime text {
  font-size: 12px;
  color: #ababab;
  /* // background-color: #ababab; */
  padding: 3px 5px;
  border-radius: 2px;
}

.cmd-item,
.rollback-item {
  justify-content: center;
  color: #929292;
  font-size: 12px;
}

.cmd-item {
  .cmd-item-text {
    color: #929292;
    background-color: #e3e3e3;
    padding: 2px 5px;
    border-radius: 4px;
  }
}

.cmd-item,
.rollback-item,
.content-item {
  display: flex;
  padding: 8px 20px;
  box-sizing: border-box;
}

.content-item.self {
  flex-direction: row-reverse;
}

.msg-info {
  display: flex;
  margin-left: var(--margin-width);
  flex-direction: column;
  flex: 1;
}

.content-info {
  color: #231815;
  display: flex;
  align-items: center;
  min-height: 40px;
}

.self {
  .content-info {
    flex-direction: row-reverse;
  }

  .media-name {
    align-self: flex-end;
  }

  .msg-info {
    margin-right: var(--margin-width);
    justify-content: flex-end;
  }
}

.unreadCount {
  position: fixed;
  height: 84px;
  right: -100%;
  top: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 44px 0 0 44px;
  padding: 0 10px 0 15px;
  z-index: 9;
  box-sizing: border-box;
  /* background-color: rgba($color: #fff, $alpha: 0.8); */
  color: #007aff;
  transition: all 0.5s linear;
}

.unreadCount.show {
  right: 0;
}

.unreadCount::before {
  position: absolute;
  width: 400%;
  height: 400%;
  content: '';
  border: 1px solid #007aff;
  border-right: none;
  border-radius: 96px 0 0 96px;
  box-sizing: border-box;
  transform: scale(0.25) translateX(-8px);
}
</style>
