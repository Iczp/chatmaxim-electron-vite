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
  <a-space class="tool-bar no-drag">
    <slot></slot>
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
</template>

<style scoped>
.tool-bar {
  --btn-size: 32px;
  display: flex;
  height: var(--btn-size);
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999;
  -webkit-user-drag: none;
}
.btn {
  width: var(--btn-size);
  height: var(--btn-size);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.btn-close:hover {
  background-color: rgb(253, 61, 61);
}
</style>
