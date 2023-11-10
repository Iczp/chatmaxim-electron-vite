<script setup lang="ts">
import Icon from '@ant-design/icons-vue';
/// <reference types="vite-svg-loader" />
import Bookmarks from '../svgs/bookmarks_black_24dp.svg'; // '*.svg' ?component文件的路径
import { ref } from 'vue';
import { CSSProperties } from 'ant-design-vue/es/_util/cssinjs/hooks/useStyleRegister';
const size = ref(24);
const defaultSize = ref(24);
const style = ref<CSSProperties>({
  scale: 20 / defaultSize.value,
});
</script>
<template>
  <Icon class="svg-icon" :icon="Bookmarks"  type=" "/>
</template>
<style scoped>
.svg-icon {
  fill: green;
}
</style>
