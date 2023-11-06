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
const props = defineProps<{
  title?: string;
  description?: string;
  more?: boolean;
  top?: boolean;
  search?: boolean;
}>();
const onTitleClick = () => {
  console.log('onTitleClick');
};
</script>

<template>
  <header class="page-title drag">
    <div class="page-title-left" @click="onTitleClick">
      <div class="main-title" :title="title">
        <a-space>
          <div class="main-title-text">
            <text class="text-ellipsis no-drag" @click="$emit('more', $event)">{{ title }}</text>
          </div>

          <VerifiedOutlined v-if="search" style="color: rgb(0, 207, 0); font-size: 16px" />
          <slot name="title"></slot>
        </a-space>

        <!-- <icon type="play" /> -->
      </div>
      <slot name="description">
        <div v-if="description" class="sub-title">
          <text class="no-drag" @click="$emit('more', $event)">{{ description }}</text>
        </div>
      </slot>
    </div>
    <div class="page-title-right no-drag">
      <a-space class="tool-bar">
        <a-button v-if="top" type="text" class="btn" title="置顶">
          <PushpinOutlined />
        </a-button>
        <a-button v-if="search" type="text" class="btn" title="搜索">
          <SearchOutlined />
        </a-button>
        <a-button type="text" class="btn" title="最小化">
          <MinusOutlined />
        </a-button>
        <a-button type="text" class="btn" title="最大化">
          <BorderOutlined />
        </a-button>

        <a-button type="text" class="btn btn-close" title="关闭">
          <CloseOutlined />
        </a-button>
      </a-space>
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
.tool-bar {
  display: flex;
  height: 32px;
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
.page-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /*  */
  height: 64px;
  background-color: #f5f5f5ac;
  font-size: 16px;
  flex-shrink: 0;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
.page-title-left {
  display: flex;
  flex: 1;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  flex-direction: column;
  padding: 0 20px;
}
.page-title-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.main-title {
  display: flex;
  align-items: center;
  margin: 0;
  height: 32px;
}
.main-title-text {
  display: flex;
  font-size: 18px;
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
</style>
