<script setup lang="ts">
import { computed, watch } from 'vue';
import { SessionUnitOwnerDto } from '../apis';
import {
  formatMessageTime,
  getDestinationNameForSessionUnit,
  getSenderNameForMessage,
} from '../commons/utils';

import { HeartTwoTone } from '@ant-design/icons-vue';

import { ChatObjectTypeEnums, MessageTypeEnums } from '../apis/enums';
import ChatObject from '../components/ChatObject.vue';
import MessageProview from '../components/MessageProview.vue';

const props = defineProps<{
  title?: string;
  active?: boolean;
  entity?: SessionUnitOwnerDto;
  index?: number;
}>();
const emits = defineEmits<{
  contextmenu: [
    {
      event: MouseEvent | PointerEvent;
      entity?: SessionUnitOwnerDto;
    },
  ];
}>();

watch(
  () => props.entity?.setting?.isImmersed,
  v => {
    console.log('watch isImmersed:', v, props.entity?.id, props.index);
  },
);
const isTopping = computed(() => Number(props.entity?.sorting) > 0);

const lastMessage = computed(() => props.entity?.lastMessage);

const messageType = computed(
  () => props.entity?.lastMessage?.messageType as MessageTypeEnums | undefined,
);
const isImmersed = computed(() => props.entity?.setting?.isImmersed);

const destination = computed(() => props.entity?.destination);

const objectType = computed(() => props.entity?.destination?.objectType);

const sendTime = computed(() =>
  formatMessageTime(new Date(props.entity?.lastMessage?.creationTime!)),
);
const badge = computed(() => props.entity?.publicBadge || 0);

const senderName = computed(() => getSenderNameForMessage(props.entity?.lastMessage));

const destinationName = computed(() => getDestinationNameForSessionUnit(props.entity));

const isShowSender = computed(() => senderName.value && messageType.value != MessageTypeEnums.Cmd);
</script>

<template>
  <chat-object
    :entity="destination"
    class="session-item"
    draggable="true"
    :class="{ active }"
    :object-type="objectType?.toString()"
    @click.right.native="emits('contextmenu', { entity, event: $event })"
    sub
    sub-right
    title-right
  >
    <template #title>
      <div class="object-name" :title="destinationName!">
        <span class="text-ellipsis">{{ destinationName }} - {{ entity?.ownerId }}</span>
        <a-tag v-if="objectType == ChatObjectTypeEnums.Robot" color="blue" class="object-type-tag">
          机器人
        </a-tag>
      </div>
    </template>

    <template #title-right>
      <div class="sendtime">
        <span class="text-ellipsis">{{ sendTime }}</span>
      </div>
    </template>

    <template #sub>
      <div class="text-ellipsis">
        <!-- @我 -->
        <span v-if="entity!.remindMeCount!>0" class="remind">
          {{ Number(entity?.remindMeCount) > 99 ? '99+' : entity?.remindMeCount }}@我
        </span>
        <!-- 我关注的 flowing -->
        <!-- 发送人信息 -->
        <span v-if="isShowSender" class="sender">{{ senderName }}:</span>
        <message-proview :entity="lastMessage" />
      </div>
    </template>
    <template #sub-right>
      <a-space>
        <a-badge v-if="badge != 0" :count="badge" :overflow-count="99" :dot="isImmersed" />
        <icon v-if="isImmersed" type="mute" size="14" />
        <heart-two-tone v-if="isTopping" two-tone-color="#eb2f96" />
      </a-space>
    </template>
  </chat-object>
</template>

<style scoped>
/* @import url(../style/message.css); */
.session-item {
  --spacing-size: 12px;
  height: var(--side-width);
  position: relative;
  padding: var(--spacing-size);
  box-sizing: border-box;
  align-items: center;
  flex-shrink: 0;
  cursor: default;
  user-select: none;
  transition: all 0.3s;
}

.session-item::after {
  content: '';
  height: 1px;
  left: 68px;
  right: 0px;
  bottom: 0;
  position: absolute;
  transform: scaleY(0.5);
  overflow: hidden;
  background-color: rgba(223, 223, 223, 0.41);
}
.session-item:last-child::after {
  background-color: rgba(242, 20, 20, 0.41);
}
.session-item::before {
  /* display: none; */
  content: '';
  left: 0;
  height: 0;
  position: absolute;
  width: 3px;
  border-radius: 1px;
  /* height: 100%; */
  background-color: rgba(24, 144, 255, 0.1);
  transition: all 0.3s;
  pointer-events: none;
}
.session-item.active::before,
.session-item.active .active-bar {
  display: block;
  height: 100%;
  background-color: rgba(24, 144, 255, 1);
  z-index: 1;
}

.session-item.active {
  /* background-color: rgba(255, 255, 255, 1); */
  /* background: linear-gradient(135deg, #79b4eb, #97d79c) border-box; */
  background: linear-gradient(135deg, #ddefff, #e9ffeb) border-box;
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

.object-name {
  display: flex;
  max-width: 112px;
  font-weight: 500;
  align-items: center;
  flex: 1;
}
.object-type-tag {
  font-size: 10px;
  margin: 0 2px;
  padding: 2px;
  line-height: 100%;
  height: 16px;
  display: flex;
  box-sizing: border-box;
  border-radius: 4px;
}

.sendtime {
  display: flex;
  max-width: 120px;
  color: #ccc;
  font-size: 12px;
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
