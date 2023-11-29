<script setup lang="ts">
import { useAttrs, useSlots } from 'vue';

const props = defineProps<{
  title?: string;
}>();
const slots = useSlots();
const attrs = useAttrs();
</script>

<template>
  <a-layout-content class="page-content" v-bind="attrs">
    <template v-for="(slot, index) of Object.keys(slots)" :key="index" v-slot:[slot]>
      <slot :name="slot"></slot>
    </template>
  </a-layout-content>
</template>

<style scoped></style>
