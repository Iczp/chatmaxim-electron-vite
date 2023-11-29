<script setup lang="ts">
import { ref, useAttrs, useSlots } from 'vue';
import { PerfectScrollbarOptions, PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useScrollTo } from '@pureadmin/utils';
const slots = useSlots();
const attrs = useAttrs();

const props = defineProps<{
  options?: PerfectScrollbarOptions;
}>();

const scrollbarRef = ref();
const scrollToBottom = (args?: {
  directions?: 'scrollTop' | 'scrollLeft';
  duration?: number | undefined;
  callback?: (() => void) | undefined;
}): void => {
  const el: HTMLElement = scrollbarRef.value.ps.element;
  console.log('scrollbarRef', el, scrollbarRef.value);
  const scrollTo = useScrollTo({
    ...args,
    el: ref(el),
    to: el.scrollHeight,
    directions: args?.directions || 'scrollTop',
    // duration: duration || 1200,
  });
  console.log('typeof scrollTo', typeof scrollTo, scrollTo);
  if (typeof scrollTo == 'object') {
    scrollTo.start();
  }
};

defineExpose({
  scrollToBottom,
});
</script>

<template>
  <PerfectScrollbar ref="scrollbarRef" class="chat-object" v-bind="attrs">
    <template v-for="(slot, index) of Object.keys(slots)" :key="index" v-slot:[slot]>
      <slot :name="slot"></slot>
    </template>
  </PerfectScrollbar>
</template>

<style scoped>
.ps {
  margin: 0;
}
</style>
