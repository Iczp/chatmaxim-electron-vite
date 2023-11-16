<script setup lang="ts">
import { HtmlHTMLAttributes, computed, h, ref } from 'vue';
import { message } from 'ant-design-vue';

import { MessageDto } from '../apis/dtos';
import { ChatObjectTypeEnums, MessageTypeEnums } from '../apis/enums';
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

import {
  UserOutlined,
  CopyOutlined,
  SmileTwoTone,
  HeartTwoTone,
  StarFilled,
  StarOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons-vue';
import { CSSProperties } from 'ant-design-vue/es/_util/cssinjs/hooks/useStyleRegister';
import {
  Bookmarks,
  CheckList,
  ContentCopy,
  Forward,
  NotificationsActive,
  Rollback,
  Quote,
  BookmarkAdd,
  BookmarkRemove,
  Remind,
  Alarm,
  VideoStop,
  VideoPlay,
  MusicNote,
  FileDownload,
  GroupRemove,
  PersonAdd,
  WavingHand,
  ChatOff,
} from '../icons';
import Notification from 'ant-design-vue/es/vc-notification/Notification';
import { forwardMessage, rollbackMessage, setFavorite } from '../commons/messageContextMenuHandle';
import { objectPicker } from '../commons/objectPicker';

const props = defineProps<{
  sessionUnitId: string;
  item: MessageDto;
  selectable?: boolean;
  isPlay?: boolean;
}>();

// const emits = defineEmits(['contextmenu', 'update:selectable']);
const emits = defineEmits<{
  contextmenu: [];
  remind: [string];
  'update:selectable': [selectable: boolean];
}>();

const messageType = computed(() => props.item.messageType);
const isRollback = computed(() => props.item?.rollbackTime != null);
const sendTime = computed(() => formatMessageTime(new Date(props.item.creationTime!)));
const sendTimeTitle = computed(() => props.item.creationTime);
const senderName = computed(
  () =>
    props.item.senderName ||
    props.item.senderDisplayName ||
    props.item.senderSessionUnit?.displayName ||
    '-',
);
const isShowMemberName = ref(true);
// const onRightClick = (e: Event) => {
//   const el = e.currentTarget as HTMLElement;
//   console.log('onRightClick', el.offsetTop, el.offsetLeft);
// };

const iconClass: HtmlHTMLAttributes = { class: 'svg-icon s16' };

const onAvatarRightClick = (e: MouseEvent) => {
  //prevent the browser's default menu
  e.preventDefault();
  // emits('contextmenu', e)
  const item = props.item;

  //show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    minWidth: 80,
    customClass: 'avatar-context-menu',
    items: [
      {
        label: `设置名称`,
        // icon: h(ContentCopy, iconClass),
        hidden: !item.isSelf,
        customClass: 'first-child',
        disabled: false,
        onClick: () => {},
      },
      {
        label: `@${senderName.value}`,
        // icon: h(Remind, iconClass),
        hidden: item.isSelf,
        customClass: 'first-child',
        disabled: false,
        onClick: () => {
          emits('remind', `@${senderName.value}`);
        },
      },
      {
        label: `禁言`,
        icon: h(ChatOff, iconClass),
        hidden: item.isSelf,
        disabled: false,
        onClick: () => {
          console.log(`@${senderName.value}`, item);
        },
      },

      {
        label: `拍一拍`,
        icon: h(WavingHand, iconClass),

        hidden: item.isSelf,
        disabled: false,
        onClick: () => {
          console.log(`@${senderName.value}`, item);
        },
      },
      {
        label: item.isFollowing ? `取消关注` : `特别关注`,
        icon: h(Remind, iconClass),
        hidden: item.isSelf,
        disabled: false,
        customClass: 'last-child',
        onClick: () => {
          console.log(`@${senderName.value}`, item);
        },
      },
      {
        label: `加为好友`,
        icon: h(PersonAdd, iconClass),
        hidden: item.isSelf || item.senderSessionUnit?.isFriendship,
        disabled: false,
        onClick: () => {
          console.log(`@${senderName.value}`, item);
        },
      },
      {
        label: `移出群聊`,
        icon: h(GroupRemove, iconClass),
        hidden: item.isSelf || [ChatObjectTypeEnums.Room].some(x => x == 0),
        disabled: false,
        onClick: () => {
          console.log(`@${senderName.value}`, item);
        },
      },
    ],
  });
};
const onMessageRightClick = (e: MouseEvent) => {
  //prevent the browser's default menu
  e.preventDefault();
  // emits('contextmenu', e)
  const item = props.item;
  console.log('message', item);

  //show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    minWidth: 80,
    customClass: 'message-context-menu',
    items: [
      {
        label: '复制',
        icon: h(ContentCopy, iconClass),
        divided: 'down',
        disabled: false,
        hidden: ![MessageTypeEnums.Text].some(x => x == item.messageType),
        onClick: e => {
          console.log('contextmenu item click', item);
          message.success({ content: '复制成功!', duration: 2 });
        },
      },
      {
        label: props.isPlay ? '停止播放' : '播放',
        icon: h(props.isPlay ? VideoStop : VideoPlay, iconClass),
        divided: 'down',
        disabled: false,
        hidden: ![MessageTypeEnums.Sound, MessageTypeEnums.Video].some(x => x == item.messageType),
        onClick: e => {},
      },
      {
        label: '转发',
        icon: h(Forward, iconClass),
        disabled: false,
        onClick: e => {
          console.log('contextmenu item click', item);
          forwardMessage({
            chatObjectId: 13,
            sessionUnitId: props.sessionUnitId,
            messageId: item.id!,
          });
        },
      },
      {
        label: '引用',
        icon: h(Quote, iconClass),
        onClick: () => {},
      },
      {
        label: item.isFavorited ? '取消收藏' : '收藏',
        icon: h(item.isFavorited ? BookmarkRemove : BookmarkAdd, iconClass),
        onClick: async () => {
          item.isFavorited = await setFavorite({
            sessionUnitId: props.sessionUnitId,
            messageId: item.id!,
            isFavorite: !item.isFavorited,
          });
        },
      },
      {
        label: '另存为…',
        icon: h(FileDownload, iconClass),
        disabled: false,
        // hidden: ![MessageTypeEnums.File, MessageTypeEnums.Image].some(x => x == item.messageType),
        onClick: e => {
          console.log('contextmenu item click', item);
          message.success({ content: '复制成功!', duration: 2 });
        },
      },
      {
        label: '提醒',
        disabled: true,
        icon: h(Alarm, iconClass),
        onClick: () => {},
      },
      {
        label: props.selectable ? '取消多选' : '多选',
        icon: h(CheckList, iconClass),
        onClick: () => {
          console.log('emits update:selectable', !props.selectable);

          emits('update:selectable', !props.selectable);
        },
      },
      {
        label: '撤回',
        icon: h(Rollback, iconClass),
        onClick: () => {
          rollbackMessage({ messageId: item.id! }).then(v => {
            item.isRollback = true;
            item.content = null;
          });
        },
      },
    ],
  });
};
</script>

<template>
  <section
    class="message-item msg-layout"
    :class="{ selectable: selectable, checked: item.checked }"
  >
    <header v-if="!item.isShowTime" class="msg-header send-time" :title="sendTimeTitle">
      {{ sendTime }}
    </header>
    <MsgRollback v-if="isRollback" :name="senderName" />
    <MsgCmd v-else-if="messageType == MessageTypeEnums.Cmd" :item="item" />
    <div v-else class="msg-body-wraper">
      <div v-if="selectable" class="checkbox-container">
        <a-checkbox v-model:checked="item.checked" />
      </div>

      <section class="msg-body" :class="{ reverse: item.isSelf }">
        <aside class="msg-aside">
          <Avatar
            :item="item.senderSessionUnit?.owner"
            :size="40"
            :name="senderName"
            @click.right.native="onAvatarRightClick"
          />
        </aside>

        <main class="msg-main">
          <header v-if="isShowMemberName" class="msg-main-header">
            {{ senderName }}
            <Forward class="svg-icon s12" />
            <ContentCopy class="svg-icon s16" />
          </header>

          <main class="msg-content" @click.right.native="onMessageRightClick">
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
/* @import url(../style/context-menu.css); */

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
