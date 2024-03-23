<script setup lang="ts">
import { useAttrs, useSlots } from 'vue';
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
  <div class="label-box">
    <div class="title">
      <slot name="title">
        <span>{{ title }}</span>
      </slot>
    </div>
    <div v-if="slots['default']" class="description">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<style scoped>
/* :deep(.layout-item) {
  --spacing-size: 8px;
} */
.label-box {
  padding: 6px 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* border-bottom: 1px solid #666; */
  line-height: 150%;
}
.title {
  display: flex;
}
.description {
  display: flex;
}
</style>
