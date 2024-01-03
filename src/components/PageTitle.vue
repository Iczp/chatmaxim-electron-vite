<script setup lang="ts">
import {
  EllipsisOutlined,
  ShrinkOutlined,
  CloseOutlined,
  MinusOutlined,
  ArrowsAltOutlined,
  PushpinOutlined,
  BorderOutlined,
  SearchOutlined,
  VerifiedOutlined,
} from '@ant-design/icons-vue';
import ToolBar from './TooBar.vue';
import { setWindow } from '../commons/setWindow';
import { useWindowStore } from '../stores/window';
import { computed } from 'vue';

const windowStore = useWindowStore();
const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    more?: boolean;
    top?: boolean;
    search?: boolean;
  }>(),
  {
    search: false,
  },
);
const onTitleClick = () => {
  console.log('onTitleClick');
};
const isAlwaysOnTop = computed(() => windowStore.isAlwaysOnTop);
const toggleAlwayOnTop = () => {
  setWindow({
    isAlwaysOnTop: !windowStore.isAlwaysOnTop,
  });
};
</script>

<template>
  <header class="page-title drag">
    <div class="page-title-left" @click="onTitleClick">
      <div class="main-title" :title="title">
        <slot>
          <a-space>
            <div class="main-title-text">
              <text class="text-ellipsis no-drag" @click="$emit('more', $event)">{{ title }}</text>
            </div>

            <VerifiedOutlined v-if="search" style="color: rgb(0, 207, 0); font-size: 16px" />
            <slot name="title"></slot>
          </a-space>
        </slot>
      </div>
      <slot v-if="description" name="description">
        <div class="sub-title">
          <text class="no-drag" @click="$emit('more', $event)">{{ description }}</text>
        </div>
      </slot>
    </div>
    <div class="page-title-right no-drag">
      <tool-bar>
        <a-button
          v-if="top"
          type="text"
          class="btn"
          @click="toggleAlwayOnTop"
          :title="`${isAlwaysOnTop ? '取消置顶' : '置顶'}`"
        >
          <PushpinOutlined class="pin" :class="{ 'alway-on-top': isAlwaysOnTop }" />
        </a-button>
        <a-button v-if="search" type="text" class="btn" title="搜索">
          <SearchOutlined />
        </a-button>
      </tool-bar>
      <slot v-if="more">
        <a-button type="text" class="btn" @click="$emit('more', $event)">
          <!-- <EllipsisOutlined /> -->
          <icon type="more" />
        </a-button>
      </slot>
    </div>
  </header>
</template>

<style scoped>
.page-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 32px;
  /* background-color: #f5f5f5ac; */

  flex-shrink: 0;
  /* border-bottom: 1px solid rgba(213, 213, 213, 0.596); */
  box-sizing: border-box;
  /* padding: 5px 0; */
  /* background: linear-gradient(135deg,#f5f5f5ac, rgba(1, 156, 148, 0.2)) border-box; */
  /* background: linear-gradient(135deg, #f5f5f5ac, rgba(1, 156, 148, 0.2)) border-box; */
}
.btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-close:hover {
  background-color: rgb(253, 61, 61);
}

.page-title-left {
  display: flex;
  flex: 1;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  flex-direction: column;
  padding: 0 8px;
}
.page-title-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 32px;
}
.main-title {
  display: flex;
  align-items: center;
  margin: 0;
  height: 32px;
}
.main-title-text {
  display: flex;
  /* font-size: 18px; */
  font-weight: bold;
  margin: 0;
  padding: 0;
  -webkit-user-drag: none;
  max-width: 240px;
}
.sub-title {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin: 0;
  color: #ccc;
  height: 20px;
}

.pin {
  color: #666;
  transition: all 0.3s linear;
}
.pin.alway-on-top {
  color: deepskyblue;
  transform: rotate(-45deg);
}
</style>
