<script setup lang="ts">
import { useAttrs, useSlots } from 'vue';
import Div from '../components/LayoutItem.vue';
const slots = useSlots();
const attrs = useAttrs();

const props = defineProps<{
  title?: string;
}>();

// custom slot
const ignoreSlots = ['title'];
const inheritanceKeys = Object.keys(slots).filter(x => !ignoreSlots.some(d => d == x));
</script>

<template>
  <div class="label-group">
    <div class="title">{{ title }}</div>
    <div class="body">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<style scoped>
/* :deep(.layout-item) {
  --spacing-size: 8px;
} */
.label-group {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.title {
  display: flex;
}
.body {
  display: flex;
  flex-direction: column;
}
</style>
