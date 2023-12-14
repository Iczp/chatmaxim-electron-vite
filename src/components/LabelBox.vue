<script setup lang="ts">
import { useAttrs, useSlots } from 'vue';
import LayoutItem from '../components/LayoutItem.vue';
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
  <layout-item class="label-box" v-bind="attrs" header>
    <template #title>
      <slot name="title">
        <span>{{ title }}</span>
      </slot>
    </template>
    <template v-for="(slot, index) of inheritanceKeys" :key="index" v-slot:[slot]>
      <slot :name="slot"></slot>
    </template>
  </layout-item>
</template>

<style scoped>
/* :deep(.layout-item) {
  --spacing-size: 8px;
} */
.label-box {
  padding: 6px 0px;
  --spacing-size: 8px;
}
</style>
