<script setup lang="ts">
import {
  HtmlHTMLAttributes,
  computed,
  h,
  watch,
} from 'vue';
import Avatar from './Avatar.vue';
import {
  SessionUnitOwnerDto,
} from '../apis';
import { formatMessageTime } from '../commons/utils';
import Text from '../components/Text.vue';

import {
  HeartTwoTone,
} from '@ant-design/icons-vue';

import { ChatObjectTypeEnums, MessageTypeEnums } from '../apis/enums';
import ContextMenu from '@imengyu/vue3-context-menu';
import { AlignBottom, AlignTop, NotificationsActive, NotificationsOff } from '../icons';
import { setImmersed, setTopping } from '../commons/setting';

const props = defineProps<{
  title?: string;
  active?: boolean;
  item: SessionUnitOwnerDto | undefined;
  index?: number;
}>();
const emits = defineEmits<{
  contextmenu: [SessionUnitOwnerDto, MouseEvent | PointerEvent];
}>();

// const entity = props.entity;

const setting = props.item?.setting;

watch(
  () => props.item,
  v => {
    // console.log('watch:', v);
  },
);
watch(
  () => props.item?.setting?.isImmersed,
  v => {
    console.log('watch isImmersed:', v, props.item?.id, props.index);
  },
);
const isTopping = computed(() => Number(props.item?.sorting) > 0);
const lastMessage = computed(() => props.item?.lastMessage);

const messageType = computed(
  () => props.item?.lastMessage?.messageType as MessageTypeEnums | undefined,
);
const isImmersed = computed(() => props.item?.setting?.isImmersed);
const isRollback = computed(() => props.item?.lastMessage?.rollbackTime != null);
const destination = computed(() => props.item?.destination);

const objectType = computed(() => props.item?.destination?.objectType);
const content = computed(() => props.item?.lastMessage?.content);

const sendTime = computed(() =>
  formatMessageTime(new Date(props.item?.lastMessage?.creationTime!)),
);
const badge = computed(() => props.item?.publicBadge || 0);
const senderName = computed(() => props.item?.lastMessage?.senderDisplayName);
const destinationName = computed(
  () => props.item?.setting?.rename || props.item?.destination?.name,
);

const onRightClick = (e: MouseEvent | PointerEvent) => {
  //prevent the browser's default menu

  const item: SessionUnitOwnerDto = props.item!;

  console.log('onRightClick', item, e);

  e.preventDefault();

  const iconClass: HtmlHTMLAttributes = { class: 'svg-icon s16' };
  const isTopping = Number(item.sorting) > 0;
  const isImmersed = item.setting?.isImmersed;
  //show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    minWidth: 80,
    customClass: 'session-context-menu',
    items: [
      {
        label: isTopping ? '取消置顶' : '消息置顶',
        icon: h(isTopping ? AlignBottom : AlignTop, iconClass),
        // divided: 'down',
        disabled: false,
        customClass: 'first-child',
        onClick: () => {
          setTopping({ sessionUnitId: item.id!, isTopping: !isTopping });
        },
      },
      {
        label: isImmersed ? '开启通知' : '免打扰',
        icon: h(isImmersed ? NotificationsActive : NotificationsOff, iconClass),
        divided: 'down',
        disabled: false,
        onClick: () => {
          setImmersed({ sessionUnitId: item.id!, isImmersed: !isImmersed });
        },
      },
      {
        label: '清空消息',
        // icon: h(isImmersed ? NotificationsActive : NotificationsOff, iconClass),
        disabled: false,
        onClick: () => {},
      },
      {
        label: '删除会话',
        // icon: h(isImmersed ? NotificationsActive : NotificationsOff, iconClass),
        disabled: false,
        customClass: 'last-child',
        onClick: () => {},
      },
    ],
  });
};

// var intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
//   console.log('sessionItemRef', entries[0]);
//   visibility.value = entries[0].intersectionRatio > 0;
//   // 如果不可见，就返回
//   if (entries[0].intersectionRatio <= 0) return;
// });

// const visibility = ref(false);
// const sessionItemRef = ref<HTMLElement | null>();
// onMounted(() => {
//   intersectionObserver.observe(sessionItemRef.value!);
// });
// onUnmounted(() => {
//   if (sessionItemRef.value) {
//     intersectionObserver.unobserve(sessionItemRef.value);
//   }
// });
</script>

<template>
  <div
    ref="sessionItemRef"
    class="session-item"
    draggable="true"
    :class="{ active }"
    :object-type="objectType?.toString()"
    @click.right.native="onRightClick"
  >
    <!-- <div class="active-bar"></div> -->
    <!-- <template v-if="visibility"> -->
    <Avatar :entity="destination" :name="destination?.name" />

    <main class="session-main">
      <div class="title-container">
        <div class="title-left object-name" :title="destinationName!">
          <span class="text-ellipsis">{{ index }} {{ destinationName }} - {{ item?.ownerId }}</span>
          <a-tag
            v-if="objectType == ChatObjectTypeEnums.Robot"
            color="blue"
            class="object-type-tag"
          >
            机器人
          </a-tag>
        </div>
        <div class="title-right"><span class="text-ellipsis">{{ sendTime }}</span></div>
      </div>
      <div class="description-container">
        <div class="description-left">
          <div class="text-ellipsis">
            <!-- <span>不支持的类型=========================</span> -->
            <!-- @我 -->
            <span v-if="item!.remindMeCount!>0" class="remind">
              {{ Number(item?.remindMeCount) > 99 ? '99+' : item?.remindMeCount }}@我
            </span>
            <!-- 发送人信息 -->
            <span v-if="senderName && messageType != MessageTypeEnums.Cmd" class="sender">
              {{ senderName }}:
            </span>
            <!-- 消息内容 -->
            <span v-if="isRollback">消息被撤回</span>
            <span v-else-if="messageType == MessageTypeEnums.Cmd">
              <Text :value="content.text" />
            </span>
            <span v-else-if="messageType == MessageTypeEnums.Text">
              <Text :value="content.text" />
            </span>

            <span v-else-if="messageType == MessageTypeEnums.Image">[图片]</span>
            <span v-else-if="messageType == MessageTypeEnums.Video">[视频]</span>
            <span v-else-if="messageType == MessageTypeEnums.Location">
              [位置]{{ content.name }}
            </span>
            <span v-else-if="messageType == MessageTypeEnums.Contacts">
              [名片]{{ content.title }}
            </span>
            <span v-else-if="messageType == MessageTypeEnums.Sound">[语音]</span>

            <span v-else-if="messageType == MessageTypeEnums.RedEnvelope">[红包]</span>
            <span v-else-if="messageType == MessageTypeEnums.Html">
              {{ content.title }} {{ content.content }}
            </span>
            <span v-else>[不支持的类型]</span>
          </div>
        </div>
        <div class="description-right">
          <a-space>
            <a-badge v-if="badge != 0" :count="badge" :overflow-count="99" :dot="isImmersed" />
            <icon v-if="isImmersed" type="mute" size="14" />
            <heart-two-tone v-if="isTopping" two-tone-color="#eb2f96" />
          </a-space>
        </div>
      </div>
    </main>
    <!-- </template> -->
  </div>
</template>

<style scoped>
/* @import url(../style/message.css); */
.session-item {
  display: flex;
  /* flex: 1; */
  flex-direction: row;
  justify-content: space-between;
  height: var(--side-width);
  position: relative;
}

.session-item::after {
  content: '';
  height: 1px;
  left: 72px;
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
.session-item::before,
.active-bar {
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

.session-main {
  display: flex;
  flex: 1;
}

.session-main {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  flex: 1;
}

.message-title,
.description-container {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
}

.description-left {
  display: flex;
  flex: 1;
  /* max-width: calc(100% - 30px); */
  max-width: 136px;
}
.description-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.title-container {
  display: flex;
  justify-content: space-between;
  color: rgba(0, 0, 0, 1);
  font-size: 14px;
  height: 28px;
  align-items: center;
}
.title-left {
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

.title-right {
  display: flex;
  max-width: 120px;
  color: #ccc;
  font-size: 12px;
}

.description-container {
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
