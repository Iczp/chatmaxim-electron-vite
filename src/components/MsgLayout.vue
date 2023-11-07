<script setup lang="ts">
import { computed, ref } from 'vue';
import { MessageDto } from '../apis/dtos';
import ContextMenu from '@imengyu/vue3-context-menu';
import { formatMessageTime } from '../commons/utils';
import Avatar from './Avatar.vue';

const props = defineProps<{
  item: MessageDto;
  avatar?: boolean;
  isPlay?: boolean;
}>();



const messageType = computed(() => props.item.messageType);

const isRollback = computed(() => props.item?.rollbackTime != null);

const sendTime = computed(() => formatMessageTime(new Date(props.item.creationTime!)));

const isShowMemberName = ref(true);
</script>

<template>
  <section class="message-item msg-layout">
    <header class="msg-header">
      <slot name="header">
        <div class="send-time">{{ sendTime }}</div>
      </slot>
    </header>
    <section class="msg-body" :class="{ reverse: item.isSelf }">
      <slot v-if="avatar" name="avatar">
        <aside v-if="isShowMemberName" class="msg-avatar">
          <Avatar :item="item.sender" :size="40" :name="item.senderDisplayName" />
        </aside>
      </slot>
      <main class="msg-main">
        <header class="msg-main-header">
          {{ item.senderName || item.senderDisplayName || '-' }}
        </header>
        <slot></slot>
        <footer class="msg-main-footer">
          <MsgQuote :item="item.quoteMessageId?.toString()" />
        </footer>
      </main>
    </section>
    <footer class="msg-footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<style scoped>
.message-item {
  margin: 12px 0;
}
.msg-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}
.msg-header {
  display: flex;
}
.msg-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.msg-body.reverse {
  flex-direction: row-reverse;
}

.msg-body .msg-avatar {
  /* margin-right: 12px; */
}
.msg-body.reverse .msg-avatar {
  /* margin-left: 12px; */
}
.msg-avatar {
  display: flex;
  flex-direction: row;
}
.msg-main {
  display: flex;
  flex: 1;
  flex-basis: 0;
  flex-direction: column;
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
  color: gray;
  font-size: 12px;
  width: 100%;
}

.reserve .msg-quote {
  border-radius: 12px 12px 12px 0px;
}
</style>
