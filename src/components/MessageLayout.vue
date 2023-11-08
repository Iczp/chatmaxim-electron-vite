<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { message } from 'ant-design-vue';

import { MessageDto } from '../apis/dtos';
import { MessageTypeEnums } from '../apis/enums';
import { formatMessageTime } from '../commons/utils';
import ContextMenu from '@imengyu/vue3-context-menu';
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
import Copy from '../icons/Copy.vue';
import {
  UserOutlined,
  SmileTwoTone,
  HeartTwoTone,
  CheckCircleTwoTone,
} from '@ant-design/icons-vue';

const props = defineProps<{
  item: MessageDto;
  selectable?: boolean;
  isPlay?: boolean;
}>();
const emits = defineEmits(['contextmenu', 'update:selectable']);

const messageType = computed(() => props.item.messageType);
const isRollback = computed(() => props.item?.rollbackTime != null);
const sendTime = computed(() => formatMessageTime(new Date(props.item.creationTime!)));
const senderName = computed(
  () => props.item.senderName || props.item.senderDisplayName || props.item.sender?.name || '-',
);
const isShowMemberName = ref(true);
// const onRightClick = (e: Event) => {
//   const el = e.currentTarget as HTMLElement;
//   console.log('onRightClick', el.offsetTop, el.offsetLeft);
// };

const onRightClick = (e: MouseEvent) => {
  //prevent the browser's default menu
  e.preventDefault();
  // emits('contextmenu', e)
  const item = props.item;
  //show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    customClass: 'message-context-menu',
    items: [
      {
        label: '复制',
        icon: h(UserOutlined),
        divided: 'down',
        disabled: false,
        onClick: e => {
          console.log('contextmenu item click', e, this);
          message.success({ content: '复制成功!', duration: 2 });
        },
      },
      {
        label: '引用',
        icon: h(UserOutlined),
        onClick: () => {},
      },
      {
        label: '收藏',
        icon: h(UserOutlined),

        onClick: () => {},
      },
      {
        label: '提醒',
        icon: h(UserOutlined),
        onClick: () => {},
      },
      {
        label: '多选',
        icon: h(UserOutlined),
        onClick: () => {
          console.log('emits update:selectable', !props.selectable);

          emits('update:selectable', !props.selectable);
        },
      },
      {
        label: '撤回',
        icon: h(UserOutlined),
        onClick: () => {},
      },
    ],
  });
};
</script>

<template>
  <section class="message-item msg-layout" :class="{ selectable: selectable }">
    <header class="msg-header send-time">{{ sendTime }}</header>
    <MsgRollback v-if="isRollback" :name="senderName" />
    <MsgCmd v-else-if="messageType == MessageTypeEnums.Cmd" :item="item" />
    <div v-else class="msg-body-wraper">
      <div v-if="selectable" class="checkbox-container">
        <a-checkbox v-model:checked="item.checked" />
      </div>

      <section class="msg-body" :class="{ reverse: item.isSelf }">
        <aside class="msg-aside">
          <Avatar :item="item.sender" :size="40" :name="senderName" />
        </aside>

        <main class="msg-main">
          <header v-if="isShowMemberName" class="msg-main-header">
            {{ senderName }}
            <!-- <Copy /> -->
            ---
          </header>

          <main class="msg-content" @click.right.native="onRightClick">
            <!-- <p>{{ item }}</p> -->
            <!-- 消息 Start -->
            <MsgImage v-if="messageType == MessageTypeEnums.Image" :item="item" />
            <MsgSound
              v-else-if="messageType == MessageTypeEnums.Sound"
              :item="item"
              :play="isPlay"
            />
            <MsgLocation v-else-if="messageType == MessageTypeEnums.Location" :item="item" />
            <MsgContacts v-else-if="messageType == MessageTypeEnums.Contacts" :item="item" />
            <MsgLink v-else-if="messageType == MessageTypeEnums.Link" :item="item" />
            <MsgVideo v-else-if="messageType == MessageTypeEnums.Video" :item="item" />
            <MsgRedEnvelope v-else-if="messageType == MessageTypeEnums.RedEnvelope" :item="item" />
            <MsgText v-else-if="messageType == MessageTypeEnums.Text" :item="item" />

            <MsgUnsupported v-else :r="item.isSelf" />
            <!-- 消息 End -->
            <MsgState :state="item.state" />
          </main>

          <footer class="msg-main-footer">
            <QuoteMessage :item="item.quoteMessageId?.toString()" :r="item.isSelf" />
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
@import url(../style/message-context-menu.css);
.message-item {
  margin: 8px 0;
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
  padding: 12px 20px;
}
.selectable .msg-body-wraper:hover {
  background-color: #e7e7e7;
}
.checked .msg-body-wraper {
  background-color: #666;
}
.checkbox-container {
  display: flex;
  margin-right: 20px;
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
  /* align-items: center; */
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
