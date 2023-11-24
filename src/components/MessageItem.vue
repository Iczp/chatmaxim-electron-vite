<script setup lang="ts">
import { computed, ref } from 'vue';

import { MessageDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { formatMessageTime, getSenderNameForMessage } from '../commons/utils';
import Avatar from './Avatar.vue';

import MsgText from './MsgText.vue';
import MsgCmd from './MsgCmd.vue';
import MsgImage from './MsgText.vue';
import MsgLocation from './MsgText.vue';
import MsgContacts from './MsgText.vue';
import MsgLink from './MsgText.vue';
import MsgSound from './MsgText.vue';
import MsgVideo from './MsgText.vue';
import MsgRedEnvelope from './MsgText.vue';
import MsgUnsupported from './MsgUnsupported.vue';
import MsgState from './MsgState.vue';
import QuoteMessage from './QuoteMessage.vue';
import MsgRollback from './MsgRollback.vue';

import { SelfImprovement, PersonPin } from '../icons';
import { ContextmenuInput, LabelType as LabelType, MouseButton } from '../commons/contextmenu';
import { useMessageInfo } from '../commons/useMessageInfo';

const props = defineProps<{
  sessionUnitId: string;
  entity: MessageDto;
  selectable?: boolean;
  isPlay?: boolean;
}>();

// const emits = defineEmits(['contextmenu', 'update:selectable']);
const emits = defineEmits<{
  contextmenu: [ContextmenuInput];
  remind: [string];
  'update:selectable': [selectable: boolean];
}>();

const { senderName, messageType, isRollback, sendTime, sendTimeTitle } = useMessageInfo(
  props.entity,
);

const isShowMemberName = ref(true);

const onAvatarRightClick = (event: MouseEvent) => {
  emits('contextmenu', {
    entity: props.entity,
    event,
    labelType: LabelType.Avatar,
    mouseButton: MouseButton.Right,
  });
};

const onContentClick = (event: MouseEvent, mouseButton: MouseButton) => {
  emits('contextmenu', {
    entity: props.entity,
    event,
    labelType: LabelType.Content,
    mouseButton,
  });
};

const onMessageClick = (event: MouseEvent, mouseButton: MouseButton) => {
  emits('contextmenu', {
    entity: props.entity,
    event,
    labelType: LabelType.All,
    mouseButton,
  });
};
</script>

<template>
  <section
    class="message-item msg-layout"
    :class="{ selectable: selectable, checked: entity.checked }"
    @click.stop="onMessageClick($event, MouseButton.Click)"
    @click.right.stop.native="onMessageClick($event, MouseButton.Right)"
  >
    <header v-if="!entity.isShowTime" class="msg-header send-time" :title="sendTimeTitle">
      {{ sendTime }}
    </header>
    <MsgRollback v-if="isRollback" :name="senderName" />
    <MsgCmd v-else-if="messageType == MessageTypeEnums.Cmd" :item="entity" />
    <div v-else class="msg-body-wraper">
      <div v-if="selectable" class="checkbox-container">
        <a-checkbox v-model:checked="entity.checked" />
      </div>

      <section class="msg-body" :class="{ reverse: entity.isSelf }">
        <aside class="msg-aside">
          <Avatar
            :item="entity.senderSessionUnit?.owner"
            :size="40"
            :name="senderName"
            @click.right.stop.native="onAvatarRightClick"
          />
        </aside>

        <main class="msg-main">
          <header v-if="isShowMemberName" class="msg-main-header">
            <PersonPin v-if="entity.senderSessionUnit?.isCreator" class="svg-icon s16 color" />
            <SelfImprovement class="svg-icon-16" />
            <text>{{ senderName }}</text>
            <!-- <a-tag color="green">群主</a-tag> -->
          </header>

          <main
            class="msg-content"
            @click.stop="onContentClick($event, MouseButton.Click)"
            @click.right.stop.native="onContentClick($event, MouseButton.Right)"
          >
            <!-- <p>{{ item }}</p> -->
            <!-- 消息 Start -->
            <MsgImage v-if="messageType == MessageTypeEnums.Image" :item="entity" />
            <MsgSound
              v-else-if="messageType == MessageTypeEnums.Sound"
              :item="entity"
              :play="isPlay"
            />
            <MsgLocation v-else-if="messageType == MessageTypeEnums.Location" :item="entity" />
            <MsgContacts v-else-if="messageType == MessageTypeEnums.Contacts" :item="entity" />
            <MsgLink v-else-if="messageType == MessageTypeEnums.Link" :item="entity" />
            <MsgVideo v-else-if="messageType == MessageTypeEnums.Video" :item="entity" />
            <MsgRedEnvelope
              v-else-if="messageType == MessageTypeEnums.RedEnvelope"
              :item="entity"
            />
            <MsgText v-else-if="messageType == MessageTypeEnums.Text" :item="entity" />

            <MsgUnsupported v-else :r="entity.isSelf" />
            <!-- 消息 End -->
            <MsgState :state="entity.state" />
          </main>

          <footer v-if="entity.quoteMessage" class="msg-main-footer">
            <QuoteMessage :entity="entity.quoteMessage" />
          </footer>
        </main>
      </section>

      <footer class="msg-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </section>
</template>

<style scoped>
/* @import url(../style/message.css); */
/* @import url(../style/context-menu.css); */

.msg-main-footer :deep(.quote-message-body) {
  margin: 5px 12px 0 12px;
  border-radius: 0px 12px 12px 12px;
}
.reverse .msg-main-footer :deep(.quote-message-body) {
  border-radius: 12px 0px 12px 12px;
}
.message-item {
  margin: 0;
}
.msg-layout {
  display: flex;
  flex-direction: column;
  /* width: 100%; */
  box-sizing: border-box;
}
.msg-header {
  display: flex;
}
.msg-body-wraper {
  display: flex;
  flex-direction: row;
  padding: 12px;
  margin: 0 12px;
  border-radius: 4px;
}
.selectable .msg-body-wraper:hover {
  background-color: #efefef;
  box-shadow: 0 0 6px 0 #bbbbbbc9;
}
.selectable.checked .msg-body-wraper {
  background-color: #e7e7e7;
}
.checkbox-container {
  display: flex;
  margin-right: 12px;
  align-items: flex-start;
  box-sizing: border-box;

  /* padding: 12px 0; */
}

.msg-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
}
.msg-body.reverse {
  flex-direction: row-reverse;
}

.msg-body .msg-aside {
  /* margin-right: 12px; */
}
.msg-body.reverse .msg-aside {
  /* margin-left: 12px; */
}
.msg-aside {
  display: flex;
  flex-direction: row;
}

.msg-main {
  display: flex;
  flex: 1;
  flex-basis: 0;
  flex-direction: column;
  align-items: flex-start;
}
.reverse .msg-main {
  align-items: flex-end;
}
.msg-main-header {
  display: flex;
  /* min-height: 20px; */
  align-items: center;
  margin: 0 12px;
  margin-bottom: 2px;
  color: #666;
  font-size: 12px;
  height: 20px;
}
.msg-main-footer {
  display: flex;
}
.msg-content {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex: 1;
}
.reverse .msg-content {
  flex-direction: row-reverse;
}
.reverse .msg-main-header {
  justify-content: flex-end;
}

.msg-footer {
  display: flex;
  flex-direction: column;
}

.send-time {
  display: flex;
  justify-content: center;
  color: #acacac;
  font-size: 12px;
  width: 100%;
}
</style>
