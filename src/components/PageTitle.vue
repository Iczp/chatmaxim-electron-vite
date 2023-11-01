<script setup lang="ts">
import { EllipsisOutlined } from '@ant-design/icons-vue';
const props = defineProps<{
  title?: string | number;
  description?: string | number;
  more?: boolean;
}>();
const onTitleClick = () => {
  console.log('onTitleClick');
};
</script>

<template>
  <div class="page-title drag">
    <div class="page-title-left" @click="onTitleClick">
      <div class="main-title">
        <text>{{ title }}</text>
        <!-- <icon type="play" /> -->
        <slot name="title"></slot>
      </div>
      <slot name="description">
        <div v-if="description" class="sub-title">
          <text>{{ description }}</text>
        </div>
      </slot>
    </div>
    <div class="page-title-right no-drag">
      <slot v-if="more">
        <a-button type="text" @click="$emit('more', $event)">
          <!-- <EllipsisOutlined /> -->
          <icon type="more" />
        </a-button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  height: 32px;
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
